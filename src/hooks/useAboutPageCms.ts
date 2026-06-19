import { useState, useEffect, useCallback } from "react";
import {
    aboutPageCmsService,
    AboutHero,
    StoryTimelineEntry,
    CraftsmanshipCard,
    SignatureCollection
} from "../services/aboutPageCmsService";

export const useAboutPageCms = () => {
    const [hero, setHero] = useState<AboutHero | null>(null);
    const [storyTimeline, setStoryTimeline] = useState<StoryTimelineEntry[]>([]);
    const [craftsmanshipCards, setCraftsmanshipCards] = useState<CraftsmanshipCard[]>([]);
    const [signatureCollections, setSignatureCollections] = useState<SignatureCollection[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);

    // Fetch all about page data
    const fetchAboutData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await aboutPageCmsService.getAboutData();
            if (response.success) {
                setHero(response.hero);
                setStoryTimeline(response.storyTimeline);
                setCraftsmanshipCards(response.craftsmanshipCards);
                setSignatureCollections(response.signatureCollections);
            } else {
                setError(response.error || "Failed to load about page data.");
            }
        } catch (err: any) {
            console.error("Hook fetch error:", err);
            setError("The CMS server is currently offline or unavailable. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAboutData();
    }, [fetchAboutData]);

    // Save Hero
    const saveHero = async (payload: Partial<AboutHero> & { id: number }) => {
        setSaving(true);
        try {
            const response = await aboutPageCmsService.updateAboutHero(payload);
            if (response.success) {
                await fetchAboutData();
            }
            return response;
        } finally {
            setSaving(false);
        }
    };

    // Save Story Timeline Entry
    const saveStoryTimeline = async (payload: Partial<StoryTimelineEntry> & { id: number }) => {
        setSaving(true);
        try {
            const response = await aboutPageCmsService.updateStoryTimeline(payload);
            if (response.success) {
                // Optimistic update or just refresh
                await fetchAboutData();
            }
            return response;
        } finally {
            setSaving(false);
        }
    };

    // Save Craftsmanship Card
    const saveCraftsmanshipCard = async (payload: Partial<CraftsmanshipCard> & { id: number }) => {
        setSaving(true);
        try {
            const response = await aboutPageCmsService.updateCraftsmanshipCard(payload);
            if (response.success) {
                await fetchAboutData();
            }
            return response;
        } finally {
            setSaving(false);
        }
    };

    // Save Signature Collection
    const saveSignatureCollection = async (payload: Partial<SignatureCollection> & { id: number }) => {
        setSaving(true);
        try {
            const response = await aboutPageCmsService.updateSignatureCollection(payload);
            if (response.success) {
                await fetchAboutData();
            }
            return response;
        } finally {
            setSaving(false);
        }
    };

    return {
        hero,
        storyTimeline,
        craftsmanshipCards,
        signatureCollections,
        loading,
        error,
        saving,
        refreshAboutData: fetchAboutData,
        saveHero,
        saveStoryTimeline,
        saveCraftsmanshipCard,
        saveSignatureCollection,
    };
};
