import * as FileSystem from "expo-file-system";
import { supabase } from "../lib/supabase";

export class ImageService {
    /**
     * Upload image to Supabase storage
     * @param {string} imageUri - Local image URI
     * @param {string} fileName - Name for the uploaded file
     * @returns {Promise<Object>} Upload result data
     */
    static async uploadImage(imageUri, fileName) {
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

            // Upload to Supabase storage
            const { data, error } = await supabase.storage
                .from("images")
                .upload(`${user.id}/${fileName}`, byteArray, {
                    contentType: "image/jpeg",
                    upsert: false,
                });

            if (error) {
                throw new Error(`Upload error: ${error.message}`);
            }

            return data;
        } catch (error) {
            console.error("ImageService.uploadImage error:", error);
            throw error;
        }
    }

    /**
     * Get public URL for an uploaded image
     * @param {string} fileName - Name of the file in storage
     * @returns {Promise<string>} Public URL of the image
     */
    static async getImageUrl(fileName) {
        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                throw new Error("User not authenticated");
            }

            const { data } = supabase.storage
                .from("images")
                .getPublicUrl(`${user.id}/${fileName}`);

            return data.publicUrl;
        } catch (error) {
            console.error("ImageService.getImageUrl error:", error);
            throw error;
        }
    }

    /**
     * Delete image from Supabase storage
     * @param {string} fileName - Name of the file to delete
     * @returns {Promise<Object>} Delete result
     */
    static async deleteImage(fileName) {
        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                throw new Error("User not authenticated");
            }

            const { data, error } = await supabase.storage
                .from("images")
                .remove([`${user.id}/${fileName}`]);

            if (error) {
                throw new Error(`Delete error: ${error.message}`);
            }

            return data;
        } catch (error) {
            console.error("ImageService.deleteImage error:", error);
            throw error;
        }
    }
}
