import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from "react-native";
import { supabase } from "../lib/supabase";
import { useRouter } from "expo-router";
import WaveBackgroundTop from "../components/WaveBackgroundTop";
import WaveBackgroundBottom from "../components/WaveBackgroundBottom";

export default function SignInScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignIn = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        setLoading(false);

        if (error) {
            Alert.alert("Login failed", error.message);
        } else {
            router.replace("/");
        }
    };

    return (
        <View style={styles.container}>
            <Image source = {require('../assets/adaptive-icon.png')} style = {{width:100,height:100,alignSelf:'center',}}></Image>

            <WaveBackgroundTop></WaveBackgroundTop>
            
            <Text style={styles.header}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity
                onPress={handleSignIn}
                disabled={loading}
                style={[styles.loginBtn, loading && { opacity: 0.6 }]}
             >
            <Text style={styles.loginBtnText}>
                {loading ? "Logging In..." : "Log In"}
            </Text>
            </TouchableOpacity>

            <Text
                onPress={() => router.push("/signup")}
                style={{ color: "#2695a6", marginTop: 20, textAlign: "center" }}
            >
                Don't have an account? Sign up
            </Text>
            <WaveBackgroundBottom></WaveBackgroundBottom>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 24 },
    header: { fontSize: 24, marginBottom: 24, textAlign: "center" },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 16,
        borderRadius: 8,
    },
    loginBtn: {
        backgroundColor: '#2695A6',
        paddingVertical: 14,
        borderRadius: 8, 
        alignItems: 'center',
        marginBottom: 20,
      },
      loginBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
      },
      
});
