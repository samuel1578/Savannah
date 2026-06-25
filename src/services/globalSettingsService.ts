/**
 * Global Settings CMS Service
 * Handles fetching and updating site-wide settings.
 */

import { authService } from "./authService";

export interface GlobalSetting {
    id: number;
    setting_key: string;
    setting_value: string;
    group_name: string;
}

export interface GlobalSettingsResponse {
    success: boolean;
    settings: GlobalSetting[];
    message?: string;
    error?: string;
}

export interface UpdateResponse {
    success: boolean;
    message?: string;
}

class GlobalSettingsService {
    private apiBase = "https://savannahdrinks.co.uk/api/global-settings";

    /**
     * Fetch all global settings
     */
    async getSettings(): Promise<GlobalSettingsResponse> {
        try {
            const response = await fetch(`${this.apiBase}/get-settings.php`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching global settings:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    /**
     * Update multiple global settings at once
     */
    async updateSettings(settings: { setting_key: string; setting_value: string }[]): Promise<UpdateResponse> {
        try {
            const response = await authService.secureFetch(`${this.apiBase}/update-settings.php`, {
                method: "POST",
                body: JSON.stringify({ settings }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error updating global settings:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }
}

export const globalSettingsService = new GlobalSettingsService();
