import { useState, useEffect, useCallback } from "react";
import { homepageCmsService, HomepageSection, HomepageProduct, HeritageStory } from "../services/homepageCmsService";

export const useHomepageCms = () => {
    const [homepageSections, setHomepageSections] = useState<HomepageSection[]>([]);
    const [products, setProducts] = useState<HomepageProduct[]>([]);
    const [heritageStories, setHeritageStories] = useState<HeritageStory[]>([]);
    const [selectedSection, setSelectedSection] = useState<HomepageSection | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [sectionLoading, setSectionLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);

    // Fetch all homepage sections
    const fetchHomepageData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await homepageCmsService.getHomepageData();
            if (response.success) {
                setHomepageSections(response.sections);
                setProducts(response.products);
                setHeritageStories(response.heritageStories);

                // Auto-select the first section if none is selected
                if (response.sections.length > 0 && !selectedSection) {
                    fetchSectionDetails(response.sections[0].id);
                }
            } else {
                setError(response.message || "Failed to load homepage sections.");
            }
        } catch (err: any) {
            console.error("Hook fetch error:", err);
            setError("The CMS server is currently offline or unavailable. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [selectedSection]);

    // Fetch specific section details (fields)
    const fetchSectionDetails = async (id: number) => {
        setSectionLoading(true);
        try {
            const response = await homepageCmsService.getSectionData(id);
            if (response.success) {
                setSelectedSection(response.section);
            } else {
                console.error(`Failed to load details for section ${id}:`, response.message);
            }
        } catch (err) {
            console.error(`Error loading section details for ${id}:`, err);
        } finally {
            setSectionLoading(false);
        }
    };

    useEffect(() => {
        fetchHomepageData();
    }, []);

    const selectSection = async (id: number) => {
        // Find the basic section from the list to show immediate active state
        const section = homepageSections.find((s) => s.id === id);
        if (section) {
            setSelectedSection(section); // Set immediate state
            await fetchSectionDetails(id); // Fetch fresh fields
        }
    };

    // Save homepage section changes
    const saveSection = async (
        sectionId: number,
        fields: { key: string; value: string; }[]
    ) => {
        setSaving(true);
        try {
            const response = await homepageCmsService.updateSectionData(sectionId, fields);
            if (response.success) {
                await fetchSectionDetails(sectionId);
            }
            return response;
        } catch (err) {
            console.error(`Error saving section ${sectionId}:`, err);
            throw err;
        } finally {
            setSaving(false);
        }
    };

    return {
        homepageSections,
        products,
        heritageStories,
        selectedSection,
        loading,
        sectionLoading,
        error,
        selectSection,
        refreshHomepageData: fetchHomepageData,
        saving,
        saveSection,
    };
};
