/**
 * Contact Page CMS Service
 * Handles fetching and updating Contact page settings.
 */

import { authService } from "./authService";

export interface ContactSettings {
    hero_image_id: number | null;
    hero_image_url?: string | null;
    hero_image_alt?: string | null;
}

export interface ContactSubmission {
    id: number;
    name: string;
    email: string;
    experience_type: string;
    preferred_date: string;
    message: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    admin_notes?: string;
    created_at: string;
}

export interface ContactSettingsResponse {
    success: boolean;
    settings: ContactSettings;
    message?: string;
    error?: string;
}

export interface ContactSubmissionsResponse {
    success: boolean;
    submissions: ContactSubmission[];
    message?: string;
    error?: string;
}

export interface UpdateResponse {
    success: boolean;
    message?: string;
}

class ContactCmsService {
    private apiBase = "https://savannahdrinks.co.uk/api/contact";

    /**
     * Fetch contact page settings
     */
    async getSettings(): Promise<ContactSettingsResponse> {
        try {
            const response = await fetch(`${this.apiBase}/get-contact-settings.php`, {
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
            console.error("Error fetching contact settings:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    /**
     * Update contact settings
     */
    async updateSettings(payload: { hero_image_id: number | null }): Promise<UpdateResponse> {
        try {
            const response = await authService.secureFetch(`${this.apiBase}/update-contact-settings.php`, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error updating contact settings:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    /**
     * Submit contact form
     */
    async submitForm(data: {
        name: string;
        email: string;
        experience_type?: string;
        preferred_date?: string;
        message: string;
    }): Promise<{ success: boolean; message: string }> {
        try {
            const response = await fetch(`${this.apiBase}/submit-contact-form.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include",
            });

            if (!response.ok) {
                // Try to extract error message from response
                let errorMessage = "Submission failed";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.message || errorMessage;
                } catch (e) {
                    // Response not JSON
                }
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error: any) {
            console.error("Error submitting contact form:", error);
            return {
                success: false,
                message: error.message || "Failed to submit form. Please try again later."
            };
        }
    }

    /**
     * Fetch contact submissions (Admin only)
     */
    async getSubmissions(): Promise<ContactSubmissionsResponse> {
        try {
            const response = await authService.secureFetch(`${this.apiBase}/get-submissions.php`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching contact submissions:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    /**
     * Fetch a single submission (Admin only)
     */
    async getSubmission(id: number): Promise<{ success: boolean; submission: ContactSubmission; error?: string }> {
        try {
            const response = await authService.secureFetch(`${this.apiBase}/get-submission.php?id=${id}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching submission details:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    /**
     * Update submission status
     */
    async updateSubmissionStatus(id: number, status: string): Promise<UpdateResponse> {
        try {
            const response = await authService.secureFetch(`${this.apiBase}/update-submission-status.php`, {
                method: "POST",
                body: JSON.stringify({ id, status }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error updating submission status:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    /**
     * Update submission notes
     */
    async updateSubmissionNotes(id: number, notes: string): Promise<UpdateResponse> {
        try {
            const response = await authService.secureFetch(`${this.apiBase}/update-submission-notes.php`, {
                method: "POST",
                body: JSON.stringify({ id, admin_notes: notes }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error updating submission notes:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    /**
     * Send follow-up email
     */
    async sendFollowUp(id: number, subject: string, message: string): Promise<UpdateResponse> {
        try {
            const response = await authService.secureFetch(`${this.apiBase}/send-follow-up.php`, {
                method: "POST",
                body: JSON.stringify({ id, subject, message }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error sending follow-up email:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }
}

export const contactCmsService = new ContactCmsService();
