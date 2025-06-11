import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert, Image, TouchableOpacity } from "react-native";
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
            <View style={styles.formContainer}>
                <Image 
                    source={require('../assets/adaptive-icon.png')} 
                    style={styles.logo}
                    resizeMode="contain"
                />
                
                <Text style={styles.title}>Sign Up</Text>
                
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                
                <TouchableOpacity 
                    style={[styles.button, loading && styles.buttonDisabled]} 
                    onPress={handleSignUp}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => router.push("/login")}>
                    <Text style={styles.signInText}>
                        Already have an account? Log in
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.05)', // Light translucent background
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Translucent white container
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8, // Android shadow
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: "center",
        color: '#333',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: "rgba(204, 204, 204, 0.8)",
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 15,
        marginBottom: 20,
        borderRadius: 12,
        fontSize: 16,
        color: '#333',
    },
    button: {
        width: '100%',
        backgroundColor: '#2695a6',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#2695a6',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: 'rgba(38, 149, 166, 0.6)',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signInText: {
        color: "#2695a6",
        textAlign: "center",
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});