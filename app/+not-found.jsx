import { Link, Stack } from "expo-router";
import { View, StyleSheet, Text } from "react-native";

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen
                options={{ title: "Oops! This screen doesn't exist." }}
            />
            <View style={styles.container}>
                <Text style={styles.title}>
                    Oops! This screen doesn't exist.
                </Text>
                <Link href="/">Go to home screen</Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
