import { supabase } from "../lib/supabase";

export class DatabaseService {
    /**
     * Save image data and extracted text to user_images table
     * @param {string} filename - Name of the uploaded file
     * @param {string} extractedText - Text extracted from OCR
     * @param {number|null} credibility - Optional credibility score
     * @param {string|null} explanation - Optional explanation text
     * @returns {Promise<Object>} Insert result data
     */
    static async saveImageData(
        filename,
        extractedText,
        credibility = null,
        explanation = null
    ) {
        try {
            // Get current user
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError) {
                throw new Error(`Authentication error: ${userError.message}`);
            }

            if (!user) {
                throw new Error("User not authenticated");
            }

            // Insert data into user_images table
            const { data, error } = await supabase
                .from("user_images")
                .insert({
                    user_id: user.id,
                    filename: filename,
                    image_text: extractedText,
                    credibility: credibility,
                    explanation: explanation,
                    created_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) {
                throw new Error(`Database insert error: ${error.message}`);
            }

            console.log("Image data saved successfully:", data.id);
            return data;
        } catch (error) {
            console.error("DatabaseService.saveImageData error:", error);
            throw error;
        }
    }

    /**
     * Get all user images with their data
     * @returns {Promise<Array>} Array of user image records
     */
    static async getUserImages() {
        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                throw new Error("User not authenticated");
            }

            const { data, error } = await supabase
                .from("user_images")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                throw new Error(`Database query error: ${error.message}`);
            }

            return data || [];
        } catch (error) {
            console.error("DatabaseService.getUserImages error:", error);
            throw error;
        }
    }

    /**
     * Get a specific user image by ID
     * @param {string} imageId - UUID of the image record
     * @returns {Promise<Object>} Image record data
     */
    static async getUserImageById(imageId) {
        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                throw new Error("User not authenticated");
            }

            const { data, error } = await supabase
                .from("user_images")
                .select("*")
                .eq("id", imageId)
                .eq("user_id", user.id)
                .single();

            if (error) {
                throw new Error(`Database query error: ${error.message}`);
            }

            return data;
        } catch (error) {
            console.error("DatabaseService.getUserImageById error:", error);
            throw error;
        }
    }

    /**
     * Update credibility and explanation for an image
     * @param {string} imageId - UUID of the image record
     * @param {number} credibility - Credibility score
     * @param {string} explanation - Explanation text
     * @returns {Promise<Object>} Updated record data
     */
    static async updateImageAnalysis(imageId, credibility, explanation) {
        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                throw new Error("User not authenticated");
            }

            const { data, error } = await supabase
                .from("user_images")
                .update({
                    credibility: credibility,
                    explanation: explanation,
                })
                .eq("id", imageId)
                .eq("user_id", user.id)
                .select()
                .single();

            if (error) {
                throw new Error(`Database update error: ${error.message}`);
            }

            return data;
        } catch (error) {
            console.error("DatabaseService.updateImageAnalysis error:", error);
            throw error;
        }
    }

    /**
     * Delete a user image record
     * @param {string} imageId - UUID of the image record
     * @returns {Promise<boolean>} Success status
     */
    static async deleteUserImage(imageId) {
        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                throw new Error("User not authenticated");
            }

            const { error } = await supabase
                .from("user_images")
                .delete()
                .eq("id", imageId)
                .eq("user_id", user.id);

            if (error) {
                throw new Error(`Database delete error: ${error.message}`);
            }

            return true;
        } catch (error) {
            console.error("DatabaseService.deleteUserImage error:", error);
            throw error;
        }
    }

    /**
     * Search user images by text content
     * @param {string} searchTerm - Text to search for in image_text field
     * @returns {Promise<Array>} Array of matching image records
     */
    static async searchUserImages(searchTerm) {
        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                throw new Error("User not authenticated");
            }

            const { data, error } = await supabase
                .from("user_images")
                .select("*")
                .eq("user_id", user.id)
                .ilike("image_text", `%${searchTerm}%`)
                .order("created_at", { ascending: false });

            if (error) {
                throw new Error(`Database search error: ${error.message}`);
            }

            return data || [];
        } catch (error) {
            console.error("DatabaseService.searchUserImages error:", error);
            throw error;
        }
    }
}
