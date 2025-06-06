import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { supabase } from "../../lib/supabase";
import QuickActionsCard from "../../components/QuickActionsCard";
import Highlights from "../../components/Highlights";
import RecentScans from "../../components/RecentScans";
import WaveBackgroundTop from "../../components/WaveBackgroundTop";
import WaveBackgroundBottom from "../../components/WaveBackgroundBottom";
import MenuHomepage from "../../components/MenuHomepage";

export default function Home() {
    const [username, setUsername] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            const email = session?.user?.email;
            if (email) {
                const name = email.split("@")[0];
                setUsername(name);
            }
        };

        fetchUser();
    }, []);

    return (
        <ScrollView>
            <WaveBackgroundTop />

            <View style={styles.content}>
                <View style={styles.menuHomepage}>
                    <MenuHomepage />
                </View>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Hello, {username || "there"}
                    </Text>
                    <Text style={styles.subtitle}>
                        What would you like to check today?
                    </Text>
                </View>

                <View style={styles.cardContainer}>
                    <QuickActionsCard />
                </View>

                <View style={styles.highlightsContainer}>
                    <Highlights />
                </View>

                <View>
                    <RecentScans />
                </View>
            </View>

            <WaveBackgroundBottom />

            <StatusBar style="auto" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
    menuHomepage: {
        zIndex: 99,
    },
    header: {
        alignItems: "flex-start",
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 8,
        color: "white",
    },
    subtitle: {
        fontSize: 16,
        color: "#555",
        marginBottom: 10,
        color: "white",
    },
    cardContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    highlightsContainer: {
        marginTop: 10,
    },
});
