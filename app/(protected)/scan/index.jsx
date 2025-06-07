import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Alert,
    Dimensions,
} from "react-native";
import { Button, Text, ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { supabase } from "../../../lib/supabase";

const { width, height } = Dimensions.get("window");

export default function ScanScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [flashMode, setFlashMode] = useState("off");
    const [showLoading, setShowLoading] = useState(false);
    const cameraRef = useRef(null);
    const router = useRouter();

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleFlash() {
        setFlashMode((current) => (current === "off" ? "on" : "off"));
    }

    async function uploadImageToSupabase(imageUri, fileName) {
        try {
            // Read the image file as base64
            const base64 = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Convert base64 to ArrayBuffer
            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const {
                data: { user },
            } = await supabase.auth.getUser();

            // Upload to Supabase storage
            const { data, error } = await supabase.storage
                .from("images")
                .upload(`${user.id}/${fileName}`, byteArray, {
                    contentType: "image/jpeg",
                    upsert: false,
                });

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    async function takePicture() {
        if (cameraRef.current) {
            try {
                setShowLoading(true);
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                });

                // Generate unique filename
                const fileName = `camera_${Date.now()}.jpg`;

                // Upload to Supabase
                await uploadImageToSupabase(photo.uri, fileName);

                Alert.alert("Success", "Photo uploaded successfully!");
            } catch (error) {
                Alert.alert("Error", "Failed to upload photo");
            } finally {
                setShowLoading(false);
            }
        }
    }

    async function pickImage() {
        try {
            // Request media library permissions
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== "granted") {
                Alert.alert(
                    "Permission Required",
                    "FactSnap needs camera roll permissions to select images."
                );
                return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                try {
                    setShowLoading(true);

                    // Generate unique filename
                    const fileName = `gallery_${Date.now()}.jpg`;

                    // Upload to Supabase
                    await uploadImageToSupabase(result.assets[0].uri, fileName);

                    Alert.alert("Success", "Image uploaded successfully!");
                } catch (uploadError) {
                    Alert.alert("Error", "Failed to upload image");
                } finally {
                    setShowLoading(false);
                }
            }
        } catch (error) {
            Alert.alert("Error", "Failed to pick image from gallery");
        }
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                flash={flashMode}
                ref={cameraRef}
            >
                {/* Header with back button and controls */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => router.push("/history")}
                    >
                        <Ionicons name="chevron-back" size={24} color="white" />
                    </TouchableOpacity>

                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={[
                                styles.headerButton,
                                flashMode === "on" && styles.activeButton,
                            ]}
                            onPress={toggleFlash}
                        >
                            <Ionicons name="flash" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Document frame with corner brackets */}
                <View style={styles.frameContainer}>
                    <View style={styles.frame}>
                        {/* Top left corner */}
                        <View style={[styles.corner, styles.topLeft]} />
                        {/* Top right corner */}
                        <View style={[styles.corner, styles.topRight]} />
                        {/* Bottom left corner */}
                        <View style={[styles.corner, styles.bottomLeft]} />
                        {/* Bottom right corner */}
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                </View>

                {/* Bottom controls */}
                <View style={styles.bottomControls}>
                    <TouchableOpacity
                        style={styles.galleryButton}
                        onPress={pickImage}
                    >
                        <Ionicons name="images" size={24} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.captureButton}
                        onPress={takePicture}
                    >
                        <Ionicons name="scan" size={28} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.docButton}
                        onPress={() => router.push("/history")}
                    >
                        <Ionicons
                            name="document-text"
                            size={24}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
            </CameraView>

            {/* Loading Spinner */}
            {showLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    message: {
        textAlign: "center",
        paddingBottom: 10,
        color: "white",
    },
    camera: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },
    activeButton: {
        backgroundColor: "rgba(255,255,255,0.3)",
    },
    headerRight: {
        flexDirection: "row",
    },
    frameContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },
    frame: {
        width: width * 0.8,
        height: height * 0.4,
        position: "relative",
    },
    corner: {
        position: "absolute",
        width: 40,
        height: 40,
        borderColor: "white",
        borderWidth: 4,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    bottomControls: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 40,
        paddingBottom: 40,
    },
    galleryButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#2695a6",
        justifyContent: "center",
        alignItems: "center",
    },
    docButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 99,
    },
});
