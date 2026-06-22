/**
 * About Page CMS Service
 * Handles fetching and updating specialized About page modules.
 */

import { authService } from "./authService";

export interface AboutHero {
    id: number;
    section_key: string;
    hero_title: string;
    hero_subtitle: string;
    hero_image_id: number | null;
    farms_image_id: number | null;
    hero_image_url?: string;
    farms_image_url?: string;
    status: string;
}

export interface StoryTimelineEntry {
    id: number;
    year_label: string;
    title: string;
    story_content: string;
    image_id: number | null;
    image_url?: string;
    display_order: number;
    status: string;
}

export interface CraftsmanshipCard {
    id: number;
    heading: string;
    body_content: string;
    image_id: number | null;
    image_url?: string;
    image_path: string | null;
    display_order: number;
    status: string;
}

export interface SignatureCollection {
    id: number;
    tab_title: string;
    tab_content: string;
    main_image_id: number | null;
    main_image_url?: string;
    image_path: string | null;
    display_order: number;
    status: string;
}

export interface AboutDataResponse {
    success: boolean;
    hero: AboutHero;
    storyTimeline: StoryTimelineEntry[];
    craftsmanshipCards: CraftsmanshipCard[];
    signatureCollections: SignatureCollection[];
    message?: string;
    error?: string;
}

export interface UpdateResponse {
    success: boolean;
    message?: string;
}

class AboutPageCmsService {
    private apiBase = "https://savannahdrinks.co.uk/api/about";

    /**
     * Fetch all about page data (Hero, Timeline, Craftsmanship, Collections)
     */
    async getAboutData(): Promise<AboutDataResponse> {
        try {
            const response = await fetch(`${this.apiBase}/get-about.php`, {
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
            console.error("Error fetching about page data:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    /**
     * Update About Hero section
     */
    async updateAboutHero(payload: Partial<AboutHero> & { id: number }): Promise<UpdateResponse> {
        try {
            const response = await authService.secureFetch(`${this.apiBase}/update-about.php`, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error updating about hero:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    /**
     * Update Story Timeline entry
     */
    async updateStoryTimeline(payload: Partial<StoryTimelineEntry> & { id: number }): Promise<UpdateResponse> {
        try {
            const response = await authService.secureFetch(`${this.apiBase}/update-story-timeline.php`, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error updating story timeline:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    /**
     * Update Craftsmanship Card
     */
    async updateCraftsmanshipCard(payload: Partial<CraftsmanshipCard> & { id: number }): Promise<UpdateResponse> {
        try {
            const response = await authService.secureFetch(`${this.apiBase}/updateCraftsmanshipSection.php`, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error updating craftsmanship card:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    /**
     * Update Signature Collection
     */
    async updateSignatureCollection(payload: Partial<SignatureCollection> & { id: number }): Promise<UpdateResponse> {
        try {
            const response = await authService.secureFetch(`${this.apiBase}/update-signature-collection.php`, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error updating signature collection:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }
}

export const aboutPageCmsService = new AboutPageCmsService();
