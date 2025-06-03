import { Card, Text, Button } from "react-native-paper";
import { View, StyleSheet, ScrollView } from "react-native";
import { useRouter } from 'expo-router';

const sampleData = [
    {
        id: 1,
        title: "New 'Freecycling' scam",
        image: "https://picsum.photos/500",
        timestamp: "25 Apr",
        score: 22,
    },
    {
        id: 2,
        title: "Think Before You Share",
        image: "https://picsum.photos/600",
        timestamp: "19 Apr",
        score: 21,
    },
];

export default function RecentScans() {
    const router = useRouter();

    return (
        <View>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Your Recent Scans</Text>
                <Button
                    mode="text"
                    compact
                    onPress={() => router.push('/history')}
                >
                    Browse All &gt;
                </Button>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {sampleData.map((item) => (
                    <Card key={item.id} style={styles.card}>
                        <Card.Cover source={{ uri: item.image }} />
                        <View style={styles.cardContent}>
                            <View style={styles.details}>
                                <Text style={styles.cardTitle}>
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
        borderRadius: 12,
        marginRight: 18,
        padding: 10,
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 6,
    },
    image: {
        width: 100,
        height: 120,
        borderRadius: 8,
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
});
