import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const top3 = [
    {
        id: 1,
        name: "Lawrence W",
        points: 43,
        image: { uri: "https://i.pravatar.cc/150?img=10" },
    },
    {
        id: 2,
        name: "Aaron Tan",
        points: 40,
        image: { uri: "https://i.pravatar.cc/150?img=2" },
    },
    {
        id: 3,
        name: "A. Boyd",
        points: 38,
        image: { uri: "https://i.pravatar.cc/150?img=3" },
    },
];

const others = [
    {
        id: 4,
        name: "Li Jialin",
        points: 36,
        image: { uri: "https://i.pravatar.cc/150?img=4" },
    },
    {
        id: 5,
        name: "Ben Leong",
        points: 35,
        image: { uri: "https://i.pravatar.cc/150?img=5" },
    },
    {
        id: 6,
        name: "Steven Halim",
        points: 34,
        image: { uri: "https://i.pravatar.cc/150?img=6" },
    },
    {
        id: 7,
        name: "Angela Yao",
        points: 33,
        image: { uri: "https://i.pravatar.cc/150?img=7" },
    },
    {
        id: 8,
        name: "Terence Sim",
        points: 32,
        image: { uri: "https://i.pravatar.cc/150?img=8" },
    },
    {
        id: 9,
        name: "Yang Yue",
        points: 31,
        image: { uri: "https://i.pravatar.cc/150?img=9" },
    },
];

export default function LeaderboardScreen() {
    const renderItem = ({ item }) => (
        <View style={styles.rowCard}>
            <Text style={styles.rankText}>{item.id}</Text>
            <Image source={item.image} style={styles.avatarSmall} />
            <Text style={styles.nameText}>{item.name}</Text>
            <Text style={styles.pointsText}>{item.points} pts</Text>
        </View>
    );
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        router.back();
                    }}
                >
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.positionBadge}>
                    <Text style={styles.positionText}>Your Position: 192</Text>
                </View>
            </View>

            {/* Title */}
            <View style={styles.titleBar}>
                <Text style={styles.title}>Leaderboard</Text>
            </View>

            {/* Top 3 */}
            <View style={styles.top3Container}>
                {/* 2nd */}
                <View style={styles.topItemSmall}>
                    <Text style={[styles.medal, { backgroundColor: "silver" }]}>
                        2
                    </Text>
                    <Image
                        source={top3[1].image}
                        style={styles.avatarSmallTop}
                    />
                    <Text style={styles.topName}>{top3[1].name}</Text>
                    <Text style={styles.topPoints}>{top3[1].points} pts</Text>
                </View>

                {/* 1st */}
                <View style={styles.topItemLarge}>
                    <Text style={[styles.medal, { backgroundColor: "gold" }]}>
                        1
                    </Text>
                    <Image
                        source={top3[0].image}
                        style={styles.avatarLargeTop}
                    />
                    <Text style={styles.topName}>{top3[0].name}</Text>
                    <Text style={styles.topPoints}>{top3[0].points} pts</Text>
                </View>

                {/* 3rd */}
                <View style={styles.topItemSmall}>
                    <Text
                        style={[styles.medal, { backgroundColor: "#cd7f32" }]}
                    >
                        3
                    </Text>
                    <Image
                        source={top3[2].image}
                        style={styles.avatarSmallTop}
                    />
                    <Text style={styles.topName}>{top3[2].name}</Text>
                    <Text style={styles.topPoints}>{top3[2].points} pts</Text>
                </View>
            </View>

            {/* Scrollable list */}
            <View style={styles.listWrapper}>
                <FlatList
                    data={others}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F6FA",
        paddingTop: 30,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        alignItems: "center",
        marginBottom: 10,
    },
    positionBadge: {
        backgroundColor: "#E6F8FA",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    positionText: {
        color: "#2695A6",
        fontWeight: "600",
    },
    titleBar: {
        backgroundColor: "#2695A6",
        paddingVertical: 10,
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#fff",
    },
    topItem: {
        alignItems: "center",
    },
    crownContainer: {
        backgroundColor: "gold",
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginBottom: -10,
        zIndex: 1,
    },
    crown: {
        fontWeight: "700",
        fontSize: 14,
        color: "#000",
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginBottom: 6,
    },
    avatarSmall: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },
    topName: {
        fontSize: 14,
        fontWeight: "600",
    },
    topPoints: {
        fontSize: 12,
        color: "#666",
    },
    listWrapper: {
        backgroundColor: "#2695A6",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        flex: 1,
    },
    rowCard: {
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        marginBottom: 10,
    },
    rankText: {
        fontWeight: "700",
        marginRight: 10,
        fontSize: 16,
        width: 20,
    },
    nameText: {
        flex: 1,
        fontWeight: "500",
        fontSize: 14,
    },
    pointsText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    top3Container: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-end",
        marginVertical: 20,
    },
    topItemSmall: {
        alignItems: "center",
        flex: 1,
    },
    topItemLarge: {
        alignItems: "center",
        flex: 1.2,
    },
    avatarSmallTop: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "#ccc",
        marginBottom: 6,
    },
    avatarLargeTop: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: "gold",
        marginBottom: 6,
    },
    medal: {
        color: "#000",
        fontWeight: "700",
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 999,
        overflow: "hidden",
        marginBottom: -10,
        zIndex: 2,
    },
});
