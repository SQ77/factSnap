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
                {/* Main Analysis Text */}
                {results.analysis && (
                    <Card style={styles.resultCard}>
                        <Card.Content>
                            <Text
                                variant="titleMedium"
                                style={styles.sectionTitle}
                            >
                                Analysis
                            </Text>
                            <Text
                                variant="bodyMedium"
                                style={styles.analysisText}
                            >
                                {results.credibility}
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
                                Details
                            </Text>
                            {results.explanation}
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
                    {/* Header */}
                    <Card.Title
                        title={title}
                        titleVariant="headlineSmall"
                        right={(props) => (
                            <IconButton
                                {...props}
                                icon="close"
                                onPress={onDismiss}
                            />
                        )}
                    />

                    <Divider />

                    {/* Content */}
                    <View style={styles.contentContainer}>
                        {renderResultContent()}
                    </View>

                    {/* Footer Actions */}
                    {!loading && (
                        <>
                            <Divider />
                            <Card.Actions style={styles.actions}>
                                <Button onPress={onDismiss}>Close</Button>
                                {results && (
                                    <Button
                                        mode="contained"
                                        onPress={() => {
                                            // Handle save/share functionality
                                            console.log(
                                                "Save results:",
                                                results
                                            );
                                        }}
                                    >
                                        Save Results
                                    </Button>
                                )}
                            </Card.Actions>
                        </>
                    )}
                </Card>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        margin: 20,
    },
    modalCard: {
        maxHeight: "90%",
        elevation: 8,
    },
    contentContainer: {
        flex: 1,
        minHeight: 200,
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    loadingText: {
        marginTop: 16,
        textAlign: "center",
    },
    emptyContainer: {
        flex: 1,
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
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
        flexWrap: "wrap",
    },
    detailKey: {
        fontWeight: "500",
        flex: 1,
    },
    detailValue: {
        flex: 1,
        textAlign: "right",
    },
    timestamp: {
        textAlign: "center",
        opacity: 0.6,
        marginTop: 16,
        marginBottom: 8,
    },
    actions: {
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
});

export default ResultsModal;
