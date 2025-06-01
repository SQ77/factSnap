import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import QuickActionsCard from "../components/QuickActionsCard";

export default function Home() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Hello, Sam</Text>
                <Text style={styles.subtitle}>
                    What would you like to check today?
                </Text>
            </View>
            <View style={styles.cardContainer}>
                <QuickActionsCard />
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 80,
    },
    header: {
        alignItems: "flex-start",
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#555",
        marginBottom: 10,
    },
    cardContainer: {
        alignItems: "center",
    },
});
