import { Card, Text, Button, IconButton } from "react-native-paper";
import { View, StyleSheet, ScrollView, Image } from "react-native";

const sampleData = [
    {
        id: 1,
        title: "New 'Freecycling' scam",
        image: "https://picsum.photos/700",
        author: "cyberwatcher",
        score: 22,
        numFlagged: 42,
        verdict: "High scam chance",
    },
    {
        id: 2,
        title: "Think Before You Share",
        image: "https://picsum.photos/800",
        author: "jess.tee",
        score: 21,
        numFlagged: 12,
        verdict: "Likely Misleading",
    },
];

export default function Highlights() {
    return (
        <View>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Today's Highlights</Text>
                <Button
                    mode="text"
                    compact
                    onPress={() => console.log("View more pressed")}
                >
                    View More &gt;
                </Button>
            </View>
            <Text style={styles.subtitle}>
                Latest catches by fellow fact-checkers
            </Text>
            <ScrollView>
                {sampleData.map((item) => (
                    <Card key={item.id} style={styles.card}>
                        <View style={styles.cardContent}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            <View style={styles.details}>
                                <Text style={styles.cardTitle}>
                                    {item.title}
                                </Text>
                                <Text style={styles.author}>
                                    Posted by @{item.author}
                                </Text>
                                <Text style={styles.meta}>
                                    Credibility Score:{" "}
                                    <Text style={styles.bold}>
                                        {item.score}/100
                                    </Text>
                                </Text>
                                <Text style={styles.meta}>
                                    Flagged by:{" "}
                                    <Text style={styles.bold}>
                                        {item.numFlagged} users
                                    </Text>
                                </Text>
                                <Text style={styles.verdict}>
                                    {item.verdict}
                                </Text>
                            </View>
                            <IconButton icon="chevron-right" size={24} />
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
        marginTop: 8,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 12,
        color: "#555",
        marginBottom: 20,
        fontStyle: "italic",
    },
    card: {
        marginBottom: 20,
        borderRadius: 12,
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },
    image: {
        width: 100,
        height: 120,
        borderRadius: 8,
    },
    details: {
        flex: 1,
        marginLeft: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 2,
    },
    author: {
        fontSize: 12,
        color: "#888",
        marginBottom: 20,
    },
    meta: {
        fontSize: 12,
        marginBottom: 2,
    },
    verdict: {
        fontSize: 14,
        color: "red",
        fontWeight: "bold",
        marginTop: 6,
    },
    bold: {
        fontWeight: "bold",
    },
});
