import { ScrollView, View, StyleSheet } from "react-native";
import {
    Modal,
    Portal,
    Card,
    Text,
    Button,
    Divider,
    IconButton,
    ActivityIndicator,
} from "react-native-paper";

const ResultsModal = ({
    visible,
    onDismiss,
    results,
    loading = false,
    title = "Analysis Results",
}) => {
    const renderResultContent = () => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" />
                    <Text style={styles.loadingText}>
                        Processing your image...
                    </Text>
                </View>
            );
        }

        if (!results) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No results available</Text>
                </View>
            );
        }

        return (
            <ScrollView
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Credibility Score */}
                {results.credibility !== undefined && (
                    <Card style={styles.resultCard}>
                        <Card.Content>
                            <Text
                                variant="titleMedium"
                                style={styles.sectionTitle}
                            >
                                Credibility Score
                            </Text>
                            <Text
                                variant="bodyMedium"
                                style={styles.analysisText}
                            >
                                {results.credibility}/100
                            </Text>
                        </Card.Content>
                    </Card>
                )}

                {/* Extracted Text */}
                {results.image_text && (
                    <Card style={styles.resultCard}>
                        <Card.Content>
                            <Text
                                variant="titleMedium"
                                style={styles.sectionTitle}
                            >
                                Extracted Text
                            </Text>
                            <Text
                                variant="bodyMedium"
                                style={styles.analysisText}
                            >
                                {results.image_text}
                            </Text>
                        </Card.Content>
                    </Card>
                )}

                {/* Explanation */}
                {results.explanation && (
                    <Card style={styles.resultCard}>
                        <Card.Content>
                            <Text
                                variant="titleMedium"
                                style={styles.sectionTitle}
                            >
                                Analysis Details
                            </Text>
                            <Text
                                variant="bodyMedium"
                                style={styles.analysisText}
                            >
                                {results.explanation}
                            </Text>
                        </Card.Content>
                    </Card>
                )}

                {/* Timestamp */}
                {results.created_at && (
                    <Text variant="bodySmall" style={styles.timestamp}>
                        Processed:{" "}
                        {new Date(results.created_at).toLocaleString()}
                    </Text>
                )}
            </ScrollView>
        );
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={styles.modalContainer}
            >
                <Card style={styles.modalCard}>
                    {/* Header - Fixed height */}
                    <Card.Title
                        title={title}
                        titleVariant="headlineSmall"
                        right={() => (
                            <IconButton icon="close" onPress={onDismiss} />
                        )}
                    />

                    <Divider />

                    {/* Content - Flexible height */}
                    <View style={styles.contentContainer}>
                        {renderResultContent()}
                    </View>

                    {/* Footer - Fixed height */}
                    {!loading && (
                        <Card.Actions style={styles.actions}>
                            <Button onPress={onDismiss}>Close</Button>
                        </Card.Actions>
                    )}
                </Card>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalCard: {
        width: "100%",
        maxWidth: 500,
        maxHeight: "90%",
        borderRadius: 12,
        backgroundColor: "white",
        overflow: "hidden",
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    scrollContent: {
        paddingBottom: 8,
    },
    loadingContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    loadingText: {
        marginTop: 16,
        textAlign: "center",
    },
    emptyContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    emptyText: {
        textAlign: "center",
        opacity: 0.6,
    },
    resultCard: {
        marginBottom: 12,
        elevation: 2,
    },
    sectionTitle: {
        marginBottom: 8,
        fontWeight: "bold",
    },
    analysisText: {
        lineHeight: 22,
    },
    timestamp: {
        textAlign: "center",
        opacity: 0.6,
        marginTop: 16,
        marginBottom: 8,
    },
    actions: {
        justifyContent: "flex-end",
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
});

export default ResultsModal;
