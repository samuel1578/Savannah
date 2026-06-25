import { useState, useEffect, useCallback } from "react";
import {
    contactCmsService,
    ContactSettings,
    ContactSubmission
} from "../services/contactCmsService";

export const useContactCms = () => {
    const [settings, setSettings] = useState<ContactSettings | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);

    // Submissions state
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
    const [submissionsLoading, setSubmissionsLoading] = useState<boolean>(false);
    const [submissionsError, setSubmissionsError] = useState<string | null>(null);

    // Single submission state
    const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
    const [submissionLoading, setSubmissionLoading] = useState<boolean>(false);

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await contactCmsService.getSettings();
            if (response.success) {
                setSettings(response.settings);
            } else {
                setError(response.error || "Failed to load contact settings.");
            }
        } catch (err: any) {
            console.error("Hook fetch error:", err);
            setError("The CMS server is currently offline or unavailable. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSubmissions = useCallback(async () => {
        setSubmissionsLoading(true);
        setSubmissionsError(null);
        try {
            const response = await contactCmsService.getSubmissions();
            if (response.success) {
                setSubmissions(response.submissions);
            } else {
                setSubmissionsError(response.error || "Failed to load submissions.");
            }
        } catch (err: any) {
            console.error("Hook fetch submissions error:", err);
            setSubmissionsError("Failed to fetch contact submissions.");
        } finally {
            setSubmissionsLoading(false);
        }
    }, []);

    const fetchSubmission = useCallback(async (id: number) => {
        setSubmissionLoading(true);
        try {
            const response = await contactCmsService.getSubmission(id);
            if (response.success) {
                setSelectedSubmission(response.submission);
            }
            return response;
        } finally {
            setSubmissionLoading(false);
        }
    }, []);

    const updateStatus = async (id: number, status: string) => {
        try {
            const response = await contactCmsService.updateSubmissionStatus(id, status);
            if (response.success) {
                if (selectedSubmission && selectedSubmission.id === id) {
                    setSelectedSubmission({ ...selectedSubmission, status: status as any });
                }
                setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: status as any } : s));
            }
            return response;
        } catch (err) {
            console.error("Error updating status:", err);
            throw err;
        }
    };

    const updateNotes = async (id: number, notes: string) => {
        try {
            const response = await contactCmsService.updateSubmissionNotes(id, notes);
            if (response.success) {
                if (selectedSubmission && selectedSubmission.id === id) {
                    setSelectedSubmission({ ...selectedSubmission, admin_notes: notes } as any);
                }
            }
            return response;
        } catch (err) {
            console.error("Error updating notes:", err);
            throw err;
        }
    };

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const updateSettings = async (data: { hero_image_id: number | null }) => {
        setSaving(true);
        try {
            const response = await contactCmsService.updateSettings(data);
            if (response.success) {
                await fetchSettings();
            }
            return response;
        } finally {
            setSaving(false);
        }
    };

    return {
        settings,
        loading,
        error,
        saving,
        submissions,
        submissionsLoading,
        submissionsError,
        selectedSubmission,
        submissionLoading,
        fetchSettings,
        fetchSubmissions,
        fetchSubmission,
        updateSettings,
        updateStatus,
        updateNotes,
        setSelectedSubmission
    };
};
