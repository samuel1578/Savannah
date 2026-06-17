/**
 * Homepage CMS Service
 * Handles fetching homepage sections and individual section fields from the API.
 */

import { authService } from "./authService";

export interface HomepageField {
    key: string;
    type: "text" | "rich_text" | "url";
    value: string;
}

export interface HomepageSection {
    id: number;
    section_key: string;
    chapter_marker: string | null;
    status: "published" | "draft" | "hidden";
    fields: HomepageField[];
}

export interface ProductSpec {
    spec_label: string;
    spec_value: string;
}

export interface HomepageProduct {
    id: number;
    product_key: string;
    title: string;
    description: string;
    image_id: number | null;
    file_path: string | null;
    alt_text: string | null;
    display_order: number;
    status: "published" | "draft" | "hidden";
    specifications: ProductSpec[];
}

export interface HeritageStory {
    id: number;
    image_id: number | null;
    file_path: string | null;
    alt_text: string | null;
    category_tag: string;
    title: string;
    description: string;
    link_text: string;
    link_url: string;
    display_order: number;
    status: "published" | "draft" | "hidden";
}

export interface HomepageDataResponse {
    success: boolean;
    sections: HomepageSection[];
    products: HomepageProduct[];
    heritageStories: HeritageStory[];
    message?: string;
}

export interface SectionDataResponse {
    success: boolean;
    section: HomepageSection;
    message?: string;
}

export interface UpdateSectionPayload {
    section_id: number;
    fields: {
        key: string;
        value: string;
    }[];
}

export interface UpdateSectionResponse {
    success: boolean;
    message?: string;
}

class HomepageCmsService {
    private apiBase = "https://savannahdrinks.co.uk/api/homepage";

    /**
     * Fetch all homepage sections, products, and stories
     */
    async getHomepageData(): Promise<HomepageDataResponse> {
        try {
            const response = await fetch(`${this.apiBase}/get-homepage.php`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
                credentials: "include", // Essential for PHP session cookies
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching homepage data:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    /**
     * Fetch a specific section by its ID
     */
    async getSectionData(id: number): Promise<SectionDataResponse> {
        try {
            const response = await fetch(`${this.apiBase}/get-section.php?id=${id}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
                credentials: "include", // Essential for PHP session cookies
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching section ${id} data:`, error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    /**
     * Save homepage section changes
     */
    async updateSectionData(
        sectionId: number,
        fields: { key: string; value: string; }[]
    ): Promise<UpdateSectionResponse> {
        console.log("UPDATE REQUEST BODY", { section_id: sectionId, fields });
        try {
            const response = await authService.secureFetch(`${this.apiBase}/update-section.php`, {
                method: "POST",
                body: JSON.stringify({
                    section_id: sectionId,
                    fields: fields
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error updating section ${sectionId} data:`, error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }
}

export const homepageCmsService = new HomepageCmsService();
