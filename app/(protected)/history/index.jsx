import { useState, useEffect, useCallback, useRef } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase";
import WaveBackgroundTop from "../../../components/WaveBackgroundTop";
import WaveBackgroundBottom from "../../../components/WaveBackgroundBottom";
import ResultsModal from "../../../components/ResultsModal";

const mockData = [
    {
        id: "3",
        title: "Economic Crisis",
        type: "Screenshot",
        date: "19 Apr 2025, 3:13 pm",
    },
    {
        id: "5",
        title: "Free Money Claim",
        type: "Upload",
        date: "10 Apr 2025, 9:30 am",
    },
];

const TABS = ["All", "Scans", "Screenshots", "Uploads"];

export default function HistoryScreen() {
    const { showModal, filename } = useLocalSearchParams();
    const [modalVisible, setModalVisible] = useState(false);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pendingImageId, setPendingImageId] = useState(null);
    const [selectedTab, setSelectedTab] = useState("All");
    const [userImages, setUserImages] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Use refs to track current values in the subscription callback
    const pendingImageIdRef = useRef(null);
    const subscriptionRef = useRef(null);

    const router = useRouter();

    // Component mount log
    useEffect(() => {
        console.log("HistoryScreen component mounted");
        return () => {
            console.log("HistoryScreen component unmounting");
        };
    }, []);

    // Fetch user images from Supabase
    const fetchUserImages = useCallback(async () => {
        try {
            setFetchLoading(true);

            // Get current user
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError) {
                console.error("Error getting user:", userError);
                return;
            }

            if (!user) {
                console.log("No authenticated user found");
                setUserImages([]);
                return;
            }

            // Fetch user images
            const { data, error } = await supabase
                .from("user_images")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching user images:", error);
                return;
            }

            console.log("Fetched user images:", data);
            setUserImages(data || []);
        } catch (error) {
            console.error("Unexpected error fetching user images:", error);
        } finally {
            setFetchLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Initial data fetch
    useEffect(() => {
        fetchUserImages();
    }, [fetchUserImages]);

    // Handle pull-to-refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUserImages();
    }, [fetchUserImages]);

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        };
        return date.toLocaleDateString("en-GB", options);
    };

    // Transform user_images data to match the expected format
    const transformUserImageData = (userImage) => {
        return {
            id: userImage.id,
            title: "User Image Scan",
            type: "Scan",
            date: formatDate(userImage.created_at),
            status: userImage.status,
            credibility: userImage.credibility,
            explanation: userImage.explanation,
            image_text: userImage.image_text,
            filename: userImage.filename,
            rawData: userImage, // Keep original data for modal
        };
    };

    // Handle URL parameters on screen load
    useEffect(() => {
        if (showModal === "true" && filename) {
            console.log("Opening modal for image:", filename);
            console.log("Setting pendingImageId to:", filename);
            setPendingImageId(filename);
            pendingImageIdRef.current = filename;
            setModalVisible(true);
            setLoading(true);

            // Don't clear URL parameters immediately - wait for processing to complete
            // This prevents component remounting while we're waiting for results
        }
    }, [showModal, filename]);

    // Single Supabase realtime subscription that persists
    useEffect(() => {
        console.log("Setting up realtime subscription");

        const subscription = supabase
            .channel(`user_images_results_${Date.now()}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "user_images",
                    filter: "status=eq.done",
                },
                (payload) => {
                    console.log("Realtime update received:", payload);

                    const currentPendingId = pendingImageIdRef.current;
                    console.log("Current pending ID:", currentPendingId);
                    console.log("Update payload:", {
                        id: payload.new.id,
                        filename: payload.new.filename,
                        status: payload.new.status,
                    });

                    if (!currentPendingId) {
                        console.log("No pending image, ignoring update");
                        // Still refresh the list to show new completed scans
                        fetchUserImages();
                        return;
                    }

                    // Check if this update is for the image we're waiting for
                    const isMatchingUpdate =
                        payload.new.id === currentPendingId ||
                        payload.new.filename === currentPendingId;

                    console.log("Is matching update?", isMatchingUpdate);

                    if (isMatchingUpdate) {
                        console.log("Processing completed for pending image");
                        setResults(payload.new);
                        setLoading(false);
                        // Clear the pending ID after processing
                        setPendingImageId(null);
                        pendingImageIdRef.current = null;
                    } else {
                        console.log("Update not for pending image:", {
                            updateId: payload.new.id,
                            updateFilename: payload.new.filename,
                            pendingId: currentPendingId,
                        });
                    }

                    // Refresh the list to show updated data
                    fetchUserImages();
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "user_images",
                },
                (payload) => {
                    console.log("New image inserted:", payload);
                    // Refresh the list when new images are added
                    fetchUserImages();
                }
            )
            .subscribe((status) => {
                console.log("Realtime subscription status:", status);
                if (status === "SUBSCRIBED") {
                    console.log("Successfully subscribed to realtime updates");
                }
            });

        subscriptionRef.current = subscription;

        // Cleanup function
        return () => {
            console.log("Cleaning up realtime subscription");
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
        };
    }, [fetchUserImages]);

    // Update the ref whenever pendingImageId changes
    useEffect(() => {
        pendingImageIdRef.current = pendingImageId;
    }, [pendingImageId]);

    // Handle modal dismiss
    const handleModalDismiss = useCallback(() => {
        setModalVisible(false);
        setResults(null);
        setLoading(false);
        setPendingImageId(null);
        pendingImageIdRef.current = null;

        // Clear URL parameters after modal is dismissed
        router.replace("/history");
    }, [router]);

    // Add a timeout to prevent infinite loading
    useEffect(() => {
        if (loading && pendingImageId) {
            const timeout = setTimeout(() => {
                console.log("Processing timeout reached");
                setLoading(false);
                // You might want to show an error message here
            }, 30000); // 30 second timeout

            return () => clearTimeout(timeout);
        }
    }, [loading, pendingImageId]);

    // Combine mock data with transformed user images
    const transformedData = userImages.map(transformUserImageData);
    const combinedData = [...transformedData, ...mockData];

    // Sort by date (newest first)
    const sortedData = combinedData.sort((a, b) => {
        const dateA = a.rawData
            ? new Date(a.rawData.created_at)
            : new Date(a.date);
        const dateB = b.rawData
            ? new Date(b.rawData.created_at)
            : new Date(b.date);
        return dateB - dateA;
    });

    const filteredData =
        selectedTab === "All"
            ? sortedData
            : sortedData.filter((item) => {
                  if (selectedTab === "Scans") {
                      return item.type === "Scan";
                  }
                  return item.type === selectedTab.slice(0, -1);
              });

    // Handle item press to show results
    const handleItemPress = (item) => {
        // Only handle scans with results
        if (
            item.type === "Scan" &&
            item.status === "done" &&
            (item.credibility !== null || item.explanation)
        ) {
            setResults(item.rawData);
            setModalVisible(true);
        }
        // Mock data items (Screenshots/Uploads) are not interactive
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => handleItemPress(item)}
            disabled={item.type !== "Scan" || item.status !== "done"}
        >
            <View style={styles.cardIconContainer}>
                <Ionicons
                    style={styles.cardIcon}
                    name={
                        item.type === "Scan"
                            ? "document-text-outline"
                            : item.type === "Upload"
                            ? "cloud-upload-outline"
                            : "image-outline"
                    }
                    size={26}
                    color="#fff"
                />
                {item.type === "Scan" && item.status === "pending" && (
                    <View style={styles.statusIndicator}>
                        <ActivityIndicator size="small" color="#FFA500" />
                    </View>
                )}
                {item.type === "Scan" && item.status === "done" && (
                    <View
                        style={[styles.statusIndicator, styles.doneIndicator]}
                    >
                        <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="#4CAF50"
                        />
                    </View>
                )}
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.cardRow}>
                    <Text style={styles.cardType}>
                        {item.type === "Scan" && item.status
                            ? `${item.type} • ${
                                  item.status === "pending"
                                      ? "Processing..."
                                      : "Complete"
                              }`
                            : item.type}
                    </Text>
                    <Text style={styles.cardDate}>{item.date}</Text>
                </View>
                {item.type === "Scan" &&
                    item.status === "done" &&
                    item.credibility !== null && (
                        <View style={styles.credibilityContainer}>
                            <Text style={styles.credibilityLabel}>
                                Credibility:{" "}
                            </Text>
                            <Text
                                style={[
                                    styles.credibilityValue,
                                    {
                                        color:
                                            item.credibility >= 70
                                                ? "#4CAF50"
                                                : item.credibility >= 40
                                                ? "#FFA500"
                                                : "#F44336",
                                    },
                                ]}
                            >
                                {Math.round(item.credibility)}%
                            </Text>
                        </View>
                    )}
            </View>
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Ionicons
                name={
                    selectedTab === "All" || selectedTab === "Scans"
                        ? "document-text-outline"
                        : selectedTab === "Screenshots"
                        ? "image-outline"
                        : "cloud-upload-outline"
                }
                size={64}
                color="#ccc"
            />
            <Text style={styles.emptyStateText}>
                {selectedTab === "All"
                    ? "No items yet"
                    : `No ${selectedTab.toLowerCase()} yet`}
            </Text>
            <Text style={styles.emptyStateSubtext}>
                {selectedTab === "All" || selectedTab === "Scans"
                    ? "Tap the scan button below to analyze your first image"
                    : `No ${selectedTab.toLowerCase()} to display`}
            </Text>
        </View>
    );

    if (fetchLoading) {
        return (
            <SafeAreaView style={styles.root}>
                <WaveBackgroundTop />
                <View style={styles.topContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Your History</Text>
                        <Ionicons name="menu" size={24} color="#fff" />
                    </View>
                    <View style={styles.tabsContainer}>
                        {TABS.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setSelectedTab(tab)}
                                style={styles.tabButton}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        selectedTab === tab &&
                                            styles.activeTabText,
                                    ]}
                                >
                                    {tab}
                                </Text>
                                {selectedTab === tab && (
                                    <View style={styles.underline} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2695A6" />
                    <Text style={styles.loadingText}>
                        Loading your scans...
                    </Text>
                </View>
                <WaveBackgroundBottom />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.root}>
            <WaveBackgroundTop />
            <View style={styles.topContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Your History</Text>
                    <Ionicons name="menu" size={24} color="#fff" />
                </View>

                <View style={styles.tabsContainer}>
                    {TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setSelectedTab(tab)}
                            style={styles.tabButton}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    selectedTab === tab && styles.activeTabText,
                                ]}
                            >
                                {tab}
                            </Text>
                            {selectedTab === tab && (
                                <View style={styles.underline} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingBottom: 130,
                    flexGrow: 1,
                }}
                ListEmptyComponent={renderEmptyState}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />

            <TouchableOpacity
                style={styles.scanButton}
                onPress={() => router.push("/scan")}
            >
                <Ionicons name="scan" size={30} color="#fff" />
            </TouchableOpacity>

            <WaveBackgroundBottom />

            <ResultsModal
                visible={modalVisible}
                onDismiss={handleModalDismiss}
                results={results}
                loading={loading}
                title="Analysis Results"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#F5F6FA",
    },
    topContainer: {
        backgroundColor: "#2695A6",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        paddingBottom: 20,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    headerText: {
        fontSize: 28,
        color: "#fff",
        fontWeight: "bold",
    },
    tabsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 10,
    },
    tabButton: {
        alignItems: "center",
        paddingHorizontal: 10,
    },
    tabText: {
        fontSize: 14,
        color: "#888",
    },
    activeTabText: {
        color: "#2695A6",
        fontWeight: "600",
    },
    underline: {
        height: 2,
        backgroundColor: "#2695A6",
        width: "100%",
        marginTop: 4,
        borderRadius: 5,
    },
    card: {
        backgroundColor: "#333",
        flexDirection: "row",
        padding: 16,
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    cardIconContainer: {
        position: "relative",
        marginRight: 12,
    },
    cardIcon: {
        // marginRight: 12,
    },
    statusIndicator: {
        position: "absolute",
        top: -8,
        right: -8,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 2,
    },
    doneIndicator: {
        backgroundColor: "transparent",
    },
    cardTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    cardRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 4,
    },
    cardType: {
        color: "#ccc",
        fontSize: 12,
    },
    cardDate: {
        color: "#ccc",
        fontSize: 12,
    },
    credibilityContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    credibilityLabel: {
        color: "#ccc",
        fontSize: 12,
    },
    credibilityValue: {
        fontSize: 12,
        fontWeight: "bold",
    },
    scanButton: {
        position: "absolute",
        bottom: 45,
        alignSelf: "center",
        backgroundColor: "#4b566e",
        padding: 20,
        borderRadius: 50,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#666",
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },
    emptyStateText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#666",
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
        lineHeight: 20,
    },
});
