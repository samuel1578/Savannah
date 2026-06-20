import { authService } from "./authService";

export interface MediaAsset {
    id: number;
    filename: string;
    file_path?: string | null;
    file_url?: string | null;
    file_type: string;
    file_size: number | string;
    alt_text?: string | null;
    created_at: string;
}

export interface MediaResponse {
    success: boolean;
    media: MediaAsset[];
    message?: string;
    error?: string;
}

export interface MediaMutationResponse {
    success: boolean;
    message?: string;
    error?: string;
}

class MediaLibraryService {
    private apiBase = "https://savannahdrinks.co.uk/api/media";

    async getMedia(): Promise<MediaResponse> {
        try {
            const response = await authService.secureFetch(`${this.apiBase}/get-media.php`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching media assets:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    async uploadMedia(file: File): Promise<MediaMutationResponse> {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await authService.secureFetch(`${this.apiBase}/upload-media.php`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error uploading media asset:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    async deleteMedia(id: number): Promise<MediaMutationResponse> {
        try {
            const response = await authService.secureFetch(`${this.apiBase}/delete-media.php`, {
                method: "POST",
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error deleting media asset ${id}:`, error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }
}

export const mediaLibraryService = new MediaLibraryService();
