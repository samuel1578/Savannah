import { useState, useEffect, useCallback } from "react";
import {
    globalSettingsService,
    GlobalSetting
} from "../services/globalSettingsService";

export const useGlobalSettings = () => {
    const [settings, setSettings] = useState<GlobalSetting[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await globalSettingsService.getSettings();
            if (response.success) {
                setSettings(response.settings);
            } else {
                setError(response.error || "Failed to load global settings.");
            }
        } catch (err: any) {
            console.error("Hook fetch error:", err);
            setError("The CMS server is currently offline or unavailable. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    const updateSettings = async (updates: { setting_key: string; setting_value: string }[]) => {
        setSaving(true);
        try {
            const response = await globalSettingsService.updateSettings(updates);
            if (response.success) {
                await fetchSettings(); // Refresh settings after update
            } else {
                throw new Error(response.message || "Failed to update settings.");
            }
            return response;
        } catch (err: any) {
            console.error("Error updating settings:", err);
            throw err;
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return {
        settings,
        loading,
        error,
        saving,
        fetchSettings,
        updateSettings
    };
};
