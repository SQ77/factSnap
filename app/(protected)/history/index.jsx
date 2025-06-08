import { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase";
import WaveBackgroundTop from "../../../components/WaveBackgroundTop";
import WaveBackgroundBottom from "../../../components/WaveBackgroundBottom";
import ResultsModal from "../../../components/ResultsModal";

const mockData = [
    {
        id: "1",
        title: "Company Regulations",
        type: "Scan",
        date: "25 Apr 2025, 5:30 pm",
    },
    {
        id: "2",
        title: "Extra-Departmental Reward",
        type: "Scan",
        date: "21 Apr 2025, 10:30 am",
    },
    {
        id: "3",
        title: "Economic Crisis",
        type: "Screenshot",
        date: "19 Apr 2025, 3:13 pm",
    },
    {
        id: "4",
        title: "Homemade Remedy",
        type: "Scan",
        date: "18 Apr 2025, 11:15 am",
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

    const router = useRouter();

    // Handle URL parameters on screen load
    useEffect(() => {
        if (showModal === "true" && filename) {
            console.log("Opening modal for image:", filename);
            setPendingImageId(filename);
            setModalVisible(true);
            setLoading(true);

            // Optional: Clear URL parameters after reading them
            // This prevents the modal from reopening if user navigates back
            setTimeout(() => {
                router.replace("/history");
            }, 100);
        }
    }, [showModal, filename]);

    // Supabase realtime subscription
    useEffect(() => {
        const subscription = supabase
            .channel("user_images_results")
            .on(
                "postgres_changes",
                {
                    event: "*", // Listen to INSERT and UPDATE
                    schema: "public",
                    table: "user_images",
                    filter: "status=eq.done", // Only when processing is complete
                },
                (payload) => {
                    console.log("Realtime update received:", payload);

                    // Check if this update is for the image we're waiting for
                    if (pendingImageId && payload.new.id === pendingImageId) {
                        console.log(
                            "Processing completed for pending image:",
                            payload.new
                        );
                        setResults(payload.new);
                        setLoading(false);
                    } else if (
                        pendingImageId &&
                        payload.new.filename === pendingImageId
                    ) {
                        // Fallback: also check by filename in case ID was passed as filename
                        console.log(
                            "Processing completed for pending image (by filename):",
                            payload.new
                        );
                        setResults(payload.new);
                        setLoading(false);
                    }
                }
            )
            .subscribe((status) => {
                console.log("Realtime subscription status:", status);
            });

        return () => {
            console.log("Unsubscribing from realtime");
            subscription.unsubscribe();
        };
    }, [pendingImageId]);

    // Handle modal dismiss
    const handleModalDismiss = useCallback(() => {
        setModalVisible(false);
        setResults(null);
        setLoading(false);
        setPendingImageId(null);
    }, []);

    const filteredData =
        selectedTab === "All"
            ? mockData
            : mockData.filter((item) => item.type === selectedTab.slice(0, -1));

    const renderItem = ({ item }) => (
        <View style={styles.card}>
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
            <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.cardRow}>
                    <Text style={styles.cardType}>{item.type}</Text>
                    <Text style={styles.cardDate}>{item.date}</Text>
                </View>
            </View>
        </View>
    );

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
                contentContainerStyle={{ paddingBottom: 130 }}
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
                title="Processing Results"
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
    cardIcon: {
        marginRight: 12,
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
});
