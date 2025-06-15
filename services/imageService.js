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
}
