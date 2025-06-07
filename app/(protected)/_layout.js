import { Stack, usePathname, router } from "expo-router";
import { BottomNavigation } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { PaperProvider } from "react-native-paper";
import { MD3LightTheme as DefaultTheme } from "react-native-paper";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import CustomStatusBar from "../../components/CustomStatusBar";

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "#2695a6",
        secondary: "#4b566e",
        background: "#ffffff",
        surface: "#ffffff",
        onPrimary: "#ffffff",
        onSurface: "#000000",
    },
};

export default function RootLayout() {
    const pathname = usePathname();
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session) {
                router.replace("/login");
            } else {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Sync selected tab with current path
    useEffect(() => {
        const getIndexFromPath = () => {
            switch (pathname) {
                case "/history":
                    return 1;
                case "/community":
                    return 2;
                case "/learn":
                    return 3;
                default:
                    return 0;
            }
        };
        setIndex(getIndexFromPath());
    }, [pathname]);

    const routes = [
        { key: "", title: "Home", focusedIcon: "home" },
        { key: "history", title: "History", focusedIcon: "scan-helper" },
        {
            key: "community",
            title: "Community",
            focusedIcon: "account-multiple",
        },
        { key: "learn", title: "Learn", focusedIcon: "chart-box" },
    ];

    const handleTabChange = (newIndex) => {
        setIndex(newIndex);
        const route = routes[newIndex].key;
        router.push(`/${route}`);
    };

    if (loading) return null; // or a splash screen

    return (
        <PaperProvider theme={theme}>
            <CustomStatusBar backgroundColor={theme.colors.primary} />
            <View style={styles.container}>
                <View style={styles.content}>
                    <Stack screenOptions={{ headerShown: false }} />
                </View>
                <BottomNavigation.Bar
                    navigationState={{ index, routes }}
                    onTabPress={({ route, preventDefault }) => {
                        preventDefault();
                        const newIndex = routes.findIndex(
                            (r) => r.key === route.key
                        );
                        handleTabChange(newIndex);
                    }}
                    labeled={false}
                    style={styles.navbar}
                    activeColor="#000000"
                    inactiveColor="#999999"
                    activeIndicatorStyle={{
                        backgroundColor: "transparent",
                    }}
                />
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    navbar: {
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
});
