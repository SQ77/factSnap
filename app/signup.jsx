import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { useRouter } from "expo-router";

export default function SignUp() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });
        setLoading(false);

        if (error) {
            Alert.alert("Error signing up", error.message);
        } else {
            Alert.alert(
                "Success",
                "Check your email for the confirmation link!",
                [{ text: "OK", onPress: () => router.replace("/login") }]
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
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
            <Button
                title={loading ? "Signing up..." : "Sign Up"}
                onPress={handleSignUp}
                disabled={loading}
            />
            <Text
                style={styles.signInText}
                onPress={() => router.push("/login")}
            >
                Already have an account? Log in
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 15,
        borderRadius: 5,
    },
    signInText: {
        marginTop: 15,
        color: "#2695a6",
        textAlign: "center",
    },
});
