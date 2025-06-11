import { Card, Text, Button } from "react-native-paper";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function RecentScans() {
    const router = useRouter();
    const [scansData, setScansData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRecentScans();
    }, []);

    const fetchRecentScans = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get the current authenticated user
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                throw new Error("Unable to fetch user information");
            }

            const userId = user.id;

            // Fetch scans by this user only
            const { data, error: fetchError } = await supabase
                .from("user_images")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })
                .limit(5);

            if (fetchError) {
                throw fetchError;
            }

            // Process the data and get signed URLs
            const processedData = await Promise.all(
                data.map(async (item) => {
                    let imageUrl = null;

                    if (item.filename && userId) {
                        const imagePath = `${userId}/${item.filename}`;

                        const { data: signedUrlData, error: urlError } =
                            await supabase.storage
                                .from("images")
                                .createSignedUrl(imagePath, 60 * 60 * 24);

                        if (urlError) {
                            console.error(
                                "Error creating signed URL:",
                                urlError
                            );
                            imageUrl = null;
                        } else {
                            imageUrl = signedUrlData?.signedUrl;
                        }
                    }

                    return {
                        id: item.id,
                        title: item.title || "User Scan",
                        image: imageUrl,
                        timestamp: formatDate(item.created_at),
                        score: item.credibility || 0,
                        rawData: item,
                    };
                })
            );

            setScansData(processedData);
        } catch (err) {
            console.error("Error fetching recent scans:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return "Today";
        } else if (diffDays === 2) {
            return "Yesterday";
        } else if (diffDays <= 7) {
            return `${diffDays - 1} days ago`;
        } else {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading recent scans...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>
                    Error loading scans: {error}
                </Text>
                <Button mode="outlined" onPress={fetchRecentScans}>
                    Retry
                </Button>
            </View>
        );
    }

    if (scansData.length === 0) {
        return (
            <View>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>Your Recent Scans</Text>
                    <Button
                        mode="text"
                        compact
                        onPress={() => router.push("/history")}
                    >
                        Browse All &gt;
                    </Button>
                </View>
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyText}>No scans found</Text>
                </View>
            </View>
        );
    }

    return (
        <View>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Your Recent Scans</Text>
                <Button
                    mode="text"
                    compact
                    onPress={() => router.push("/history")}
                >
                    Browse All &gt;
                </Button>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {scansData.map((item) => (
                    <Card key={item.id} style={styles.card}>
                        <Card.Cover
                            source={{
                                uri:
                                    item.image ||
                                    "https://via.placeholder.com/300x200?text=No+Image",
                            }}
                            style={styles.cardCover}
                        />
                        <View style={styles.cardContent}>
                            <View style={styles.details}>
                                <Text
                                    style={styles.cardTitle}
                                    numberOfLines={2}
                                >
                                    {item.title}
                                </Text>
                                <Text style={styles.meta}>
                                    Credibility Score:{" "}
                                    <Text style={styles.bold}>
                                        {item.score}/100
                                    </Text>
                                </Text>
                                <Text style={styles.meta}>
                                    {item.timestamp}
                                </Text>
                            </View>
                        </View>
                    </Card>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "500",
        marginTop: 16,
        marginBottom: 20,
    },
    card: {
        marginBottom: 20,
        padding: 5,
        borderRadius: 12,
        marginRight: 18,
        width: 280,
        overflow: "hidden",
    },
    cardCover: {
        height: 150,
        borderRadius: 8,
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 6,
    },
    details: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 2,
        marginTop: 8,
    },
    meta: {
        fontSize: 12,
        marginBottom: 2,
    },
    bold: {
        fontWeight: "bold",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginBottom: 10,
        fontSize: 16,
    },
    emptyText: {
        textAlign: "center",
        fontSize: 16,
        color: "#666",
    },
});
