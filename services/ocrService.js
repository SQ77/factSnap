import * as FileSystem from "expo-file-system";

export class OCRService {
    static API_KEY = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY;
    static GOOGLE_VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${this.API_KEY}`;

    /**
     * Extract text from image using Google Vision API
     * @param {string} imageUri - Local image URI from Expo
     * @returns {Promise<string>} Extracted text
     */
    static async extractText(imageUri) {
        try {
            console.log("Starting Google Vision OCR for:", imageUri);

            // Convert image to base64
            const base64Image = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Prepare request body
            const requestBody = {
                requests: [
                    {
                        image: {
                            content: base64Image,
                        },
                        features: [
                            {
                                type: "TEXT_DETECTION",
                                maxResults: 1,
                            },
                        ],
                    },
                ],
            };

            // Make API call
            const response = await fetch(this.GOOGLE_VISION_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`Google Vision API error: ${response.status}`);
            }

            const result = await response.json();

            // Extract text from response
            if (
                result.responses &&
                result.responses[0] &&
                result.responses[0].textAnnotations
            ) {
                const extractedText =
                    result.responses[0].textAnnotations[0].description || "";
                return this.cleanExtractedText(extractedText);
            }

            return "";
        } catch (error) {
            console.error("Google Vision OCR error:", error);
            throw new Error(`OCR processing failed: ${error.message}`);
        }
    }

    /**
     * Extract text with confidence scores and bounding boxes
     * @param {string} imageUri - Local image URI
     * @returns {Promise<Object>} Object containing text, confidence, and word details
     */
    static async extractTextWithConfidence(imageUri) {
        try {
            console.log(
                "Starting Google Vision OCR with details for:",
                imageUri
            );

            const base64Image = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const requestBody = {
                requests: [
                    {
                        image: {
                            content: base64Image,
                        },
                        features: [
                            {
                                type: "DOCUMENT_TEXT_DETECTION", // More detailed than TEXT_DETECTION
                                maxResults: 1,
                            },
                        ],
                    },
                ],
            };

            const response = await fetch(this.GOOGLE_VISION_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `Google Vision API error: ${response.status} - ${errorText}`
                );
            }

            const result = await response.json();

            if (result.responses && result.responses[0]) {
                const response = result.responses[0];

                // Check for errors
                if (response.error) {
                    throw new Error(
                        `Google Vision API error: ${response.error.message}`
                    );
                }

                // Extract full text
                const fullText = response.fullTextAnnotation?.text || "";

                // Extract word-level details
                const words = [];
                if (response.fullTextAnnotation?.pages) {
                    response.fullTextAnnotation.pages.forEach((page) => {
                        page.blocks?.forEach((block) => {
                            block.paragraphs?.forEach((paragraph) => {
                                paragraph.words?.forEach((word) => {
                                    const wordText =
                                        word.symbols
                                            ?.map((s) => s.text)
                                            .join("") || "";
                                    const confidence = word.confidence || 0;
                                    const boundingBox = word.boundingBox;

                                    words.push({
                                        text: wordText,
                                        confidence: Math.round(
                                            confidence * 100
                                        ),
                                        boundingBox: boundingBox,
                                    });
                                });
                            });
                        });
                    });
                }

                // Calculate average confidence
                const avgConfidence =
                    words.length > 0
                        ? Math.round(
                              words.reduce(
                                  (sum, word) => sum + word.confidence,
                                  0
                              ) / words.length
                          )
                        : 0;

                return {
                    text: this.cleanExtractedText(fullText),
                    confidence: avgConfidence,
                    words: words,
                    rawResponse: response,
                };
            }

            return {
                text: "",
                confidence: 0,
                words: [],
                rawResponse: null,
            };
        } catch (error) {
            console.error("Google Vision OCR with confidence error:", error);
            throw new Error(`OCR processing failed: ${error.message}`);
        }
    }

    /**
     * Clean and format extracted text
     * @param {string} rawText - Raw text from OCR
     * @returns {string} Cleaned text
     */
    static cleanExtractedText(rawText) {
        if (!rawText || typeof rawText !== "string") {
            return "";
        }

        return rawText
            .replace(/\s+/g, " ")
            .replace(/\n\s*\n/g, "\n")
            .trim()
            .replace(/[^\w\s.,!?;:()\[\]{}"\'-/\\@#$%^&*+=<>|`~]/g, "")
            .replace(/\s{2,}/g, " ");
    }
}
