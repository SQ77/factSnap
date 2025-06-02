import { Card, Text, Button } from "react-native-paper";
import { View, StyleSheet } from "react-native";

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
            <Card>
                <Card.Content>
                    <Text>Card content</Text>
                </Card.Content>
            </Card>
            <Card>
                <Card.Content>
                    <Text>Card content</Text>
                </Card.Content>
            </Card>
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
});
