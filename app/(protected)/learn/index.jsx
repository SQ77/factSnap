import { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import WaveBackgroundTop from "../../../components/WaveBackgroundTop";
import WaveBackgroundBottom from "../../../components/WaveBackgroundBottom";

const categories = [
    { title: "Red Flag Spotting", emoji: "🚩", route: "/learn/red-flags" },
    { title: "Decision Simulators", emoji: "🧠", route: "/learn/decision" },
    { title: "Fake News & Misinformation", emoji: "📰", route: "/learn/fake_news" },
    { title: "Scams in Singapore", emoji: "🇸🇬", route: "/learn/scams" },
];

export default function Learn() {
    const [level] = useState(2);
    const router = useRouter();

    return (
        <SafeAreaView>
                <WaveBackgroundTop />

                {/* Main block with curved bottom */}
                <View style={styles.topContainer}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerText}>Learn</Text>
                        <View style={styles.levelBadge}>
                            <Text style={styles.levelText}>Current Level: {level}</Text>
                        </View>
                    </View>
                    <View style = {{alignItems:'center'}}>
                        <Text style={styles.sectionTitle}>Categories</Text>
                    </View>

                    <View style={styles.grid}>
                        {categories.map((cat, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.card}
                                onPress={() => router.push(cat.route)}
                            >
                                <Text style={styles.icon}>{cat.emoji}</Text>
                                <Text style={styles.cardText}>{cat.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.footerRow}>
                        <Text style={styles.positionText}>Current Position: 192</Text>
                        <TouchableOpacity onPress={() => router.push('/learn/leaderboard')}>
                            <Text style={styles.linkText}>View Leaderboard ➤</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <WaveBackgroundBottom style = {{bottom:80}}pointerEvents="none"/>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    
    
    topContainer: {
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop: 50,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    headerText: {
        fontSize: 26,
        color: "#fff",
        fontWeight: "bold",
    },
    levelBadge: {
        backgroundColor: "white",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    levelText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#007C91",
    },
    sectionTitle: {
        fontSize: 26,
        fontWeight: "600",
        color: "white",
        marginBottom: 20,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: 20,
        marginBottom: 30,
    },
    card: {
        width: "47%",
        backgroundColor: "white",
        borderRadius: 14,
        paddingVertical: 28,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    icon: {
        fontSize: 28,
        marginBottom: 12,
    },
    cardText: {
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 14,
    },
    positionText: {
        fontSize: 14,
        color: "#007C91",
    },
    linkText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#007C91",
    },
});
