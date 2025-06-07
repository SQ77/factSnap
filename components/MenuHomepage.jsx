import { useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import { router } from "expo-router";

export default function MenuHomepage() {
    const [visible, setVisible] = useState(false);

    const toggleMenu = () => setVisible((prev) => !prev);
    const closeMenu = () => setVisible(false);

    const handleSignOut = async () => {
        closeMenu();
        await supabase.auth.signOut();
        router.replace("/login");
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleMenu}>
                <Ionicons name="menu" size={28} style={styles.menuIcon} />
            </TouchableOpacity>

            {visible && (
                <View style={styles.dropdown}>
                    <Pressable onPress={handleSignOut} style={styles.menuItem}>
                        <Text style={styles.menuText}>Sign Out</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        marginBottom: 20,
    },
    menuIcon: {
        color: "#fff",
    },
    dropdown: {
        position: "absolute",
        top: 40,
        left: 0,
        backgroundColor: "#333",
        borderRadius: 6,
        paddingVertical: 8,
        minWidth: 120,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    menuItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    menuText: {
        color: "#fff",
        fontSize: 16,
    },
});
