import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import WaveBackgroundTop from "../../../components/WaveBackgroundTop";
import WaveBackgroundBottom from "../../../components/WaveBackgroundBottom";

export default function RedFlagsScreen() {
    const router = useRouter();

    return (
            <ScrollView>
                <WaveBackgroundTop />

                <View style={styles.container}>
                    {/* Header Row */}
                    <View style={styles.headerRow}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={24} color="white" />
                        </TouchableOpacity>
                        <View style={styles.levelBadge}>
                            <Text style={styles.levelText}>Current Level: 2</Text>
                        </View>
                    </View>

                    {/* Title Card */}
                    <View style={styles.titleCard}>
                        <Text style={styles.title}>Red Flag Spotting</Text>
                        <Text style={styles.subtitle}>
                            Your crash course on spotting fake news and scam messages.
                        </Text>
                    </View>

                    {/* Position Row */}
                    <View style={styles.footerRow}>
                        <Text style={styles.positionText}>Current Position: 192</Text>
                        <TouchableOpacity onPress={() => router.push("/learn/leaderboard")}>
                            <Text style={styles.linkText}>View Leaderboard ➤</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Game Card 1 */}
                    <View style={styles.taskCard}>
                        <Image
                            source={require("../../../assets/icon.png")}
                            style={styles.taskImage}
                        />
                        <View style={styles.taskContent}>
                            <Text style={styles.taskTitle}>Spot the Red Flags</Text>
                            <Text style={styles.taskBullet}>🔍 Detect classic scam tricks</Text>
                            <Text style={styles.taskBullet}>🚩 Identify subtle red flags in messages</Text>
                            <Text style={styles.taskBullet}>🧠 Learn with instant feedback and tips</Text>
                            <Text style={styles.taskBullet}>⚔️ Stay one step ahead of scammers</Text>
                            <Text style={styles.attempt}>Last attempt: <Text style={{ fontWeight: "bold" }}>Yesterday</Text></Text>
                            <Text style={styles.attempt}>Your score: <Text style={{ fontWeight: "bold" }}>19</Text></Text>
                        </View>
                        <TouchableOpacity style={styles.playButton}>
                            <Ionicons name="play" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Game Card 2 */}
                    <View style={styles.taskCard}>
                        <Image
                            source={require("../../../assets/icon.png")}
                            style={styles.taskImage}
                        />
                        <View style={styles.taskContent}>
                            <Text style={styles.taskTitle}>Legit or Sketch?</Text>
                            <Text style={styles.taskBullet}>📱 Review fake messages</Text>
                            <Text style={styles.taskBullet}>🧠 Tap “Legit” or “Sketch” to decide</Text>
                            <Text style={styles.taskBullet}>🎯 Levels get harder as scams evolve</Text>
                            <Text style={styles.taskBullet}>📬 Get instant feedback to improve</Text>
                            <Text style={styles.attempt}>Last attempt: <Text style={{ fontWeight: "bold" }}>-</Text></Text>
                            <Text style={styles.attempt}>Your score: <Text style={{ fontWeight: "bold" }}>-</Text></Text>
                        </View>
                        <TouchableOpacity style={styles.playButton}>
                            <Ionicons name="play" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <WaveBackgroundBottom />
            </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 30,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
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
    titleCard: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        alignItems :'center',
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: "#444",
        alignItems : 'center',
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 14,
        marginBottom: 20,
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
    taskCard: {
        backgroundColor: "white",
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    taskImage: {
        height: 160,
        width: "100%",
        borderRadius: 8,
        marginBottom: 10,
        resizeMode: "cover",
    },
    taskContent: {
        marginBottom: 12,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 8,
    },
    taskBullet: {
        fontSize: 13,
        marginBottom: 2,
    },
    attempt: {
        fontSize: 12,
        color: "#666",
        marginTop: 6,
    },
    playButton: {
        position: "absolute",
        right: 16,
        bottom: 16,
        backgroundColor: "#4b566e",
        padding: 12,
        borderRadius: 50,
    },
});
