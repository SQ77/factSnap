import { Card, Text, IconButton, useTheme } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function QuickActionsCard() {
    const { colors } = useTheme();

    return (
        <Card>
            <Card.Content>
                <View style={styles.row}>
                    <View style={styles.action}>
                        <Link href="/scan">
                            <View
                                style={[
                                    styles.circle,
                                    { backgroundColor: colors.primary },
                                ]}
                            >
                                <IconButton
                                    icon="scan-helper"
                                    iconColor="white"
                                    size={24}
                                />
                            </View>
                        </Link>
                        <Text variant="titleSmall" style={styles.label}>
                            Quick Scan
                        </Text>
                    </View>

                    <View style={styles.action}>
                        <Link href="/history">
                            <View style={styles.circle}>
                                <IconButton
                                    icon="text-box-search-outline"
                                    iconColor="white"
                                    size={30}
                                />
                            </View>
                        </Link>
                        <Text variant="titleSmall" style={styles.label}>
                            Your History
                        </Text>
                    </View>
                    <View style={styles.action}>
                        <Link href="/community">
                            <View
                                style={[
                                    styles.circle,
                                    { backgroundColor: colors.secondary },
                                ]}
                            >
                                <IconButton
                                    icon="trending-up"
                                    iconColor="white"
                                    size={30}
                                />
                            </View>
                        </Link>
                        <Text variant="titleSmall" style={styles.label}>
                            Trending
                        </Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 5,
        paddingVertical: 10,
    },
    action: {
        alignItems: "center",
        width: 110,
    },
    label: {
        marginTop: 10,
        textAlign: "center",
    },
    circle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "pink",
    },
});
