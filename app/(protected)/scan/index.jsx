import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
    Button,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function ScanScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [flashMode, setFlashMode] = useState("off");
    const [showShareDialog, setShowShareDialog] = useState(false);
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

    async function takePicture() {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                // Simulate document sharing
                setShowShareDialog(true);
            } catch (error) {
                Alert.alert("Error", "Failed to take picture");
            }
        }
    }

    function handleShare() {
        setShowShareDialog(false);
        Alert.alert("Success", "Document shared successfully!");
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
                    <TouchableOpacity style={styles.galleryButton}>
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

            {/* Share Dialog Overlay */}
            {showShareDialog && (
                <View style={styles.overlay}>
                    <View style={styles.shareDialog}>
                        <View style={styles.shareHeader}>
                            <Text style={styles.shareTitle}>
                                Christopher Wright shared a document
                            </Text>
                        </View>

                        <View style={styles.shareContent}>
                            <View style={styles.shareInfo}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>CW</Text>
                                </View>
                                <View style={styles.shareDetails}>
                                    <Text style={styles.shareText}>
                                        Christopher Wright
                                        (christopherwright@work.ca) has invited
                                        you to add to a shared document.
                                    </Text>
                                    <Text style={styles.shareSubtext}>
                                        Shared 2 minutes ago
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.documentTitle}>
                                📄 Pro-active Security Report.docx
                            </Text>
                            <Text style={styles.documentSubtitle}>
                                Document shared via Work email app
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.shareButton}
                            onPress={handleShare}
                        >
                            <Text style={styles.shareButtonText}>Share</Text>
                        </TouchableOpacity>
                    </View>
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
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    shareDialog: {
        backgroundColor: "white",
        borderRadius: 15,
        margin: 20,
        padding: 20,
        maxWidth: 350,
        width: "90%",
    },
    shareHeader: {
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        paddingBottom: 15,
        marginBottom: 15,
    },
    shareTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    shareContent: {
        marginBottom: 20,
    },
    shareInfo: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 15,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#4CAF50",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    avatarText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    shareDetails: {
        flex: 1,
    },
    shareText: {
        fontSize: 14,
        color: "#333",
        lineHeight: 20,
        marginBottom: 4,
    },
    shareSubtext: {
        fontSize: 12,
        color: "#666",
    },
    documentTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
        marginBottom: 4,
    },
    documentSubtitle: {
        fontSize: 12,
        color: "#666",
    },
    shareButton: {
        backgroundColor: "#2196F3",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: "center",
    },
    shareButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});
