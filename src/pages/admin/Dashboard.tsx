import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useHomepageCms } from "../../hooks/useHomepageCms";
import { useAboutPageCms } from "../../hooks/useAboutPageCms";
import { HomepageSection, HomepageField, HomepageProduct } from "../../services/homepageCmsService";
import { AboutHero, StoryTimelineEntry, CraftsmanshipCard, SignatureCollection } from "../../services/aboutPageCmsService";
import { mediaLibraryService, MediaAsset } from "../../services/mediaLibraryService";
import { ProductEditor } from "./ProductEditor";
import { StoryTimelineEditor } from "./StoryTimelineEditor";
import { CraftsmanshipEditor } from "./CraftsmanshipEditor";
import { SignatureCollectionsEditor } from "./SignatureCollectionsEditor";
import { AboutHeroEditor } from "./AboutHeroEditor";
import { BlogModule } from "./modules/BlogModule";
import { ContactModule } from "./modules/ContactModule";
import { GlobalSettingsModule } from "./modules/GlobalSettingsModule";
import { MediaPickerModal, MediaPickerSelection } from "./MediaPickerModal";
import logoLight from "../../assets/logo-light.png";
import styles from "./Dashboard.module.css";
import gsap from "gsap";
import {
    Home,
    Info,
    BookOpen,
    Mail,
    Image as ImageIcon,
    Settings,
    LogOut,
    User,
    Menu,
    X,
    ChevronRight,
    Save,
    Layers,
    Edit3,
    Eye,
    UploadCloud,
    Search,
    Filter,
    Maximize2,
    Calendar,
    HardDrive,
    Tag,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Sparkles
} from "lucide-react";

// Human-readable mapping for section keys
const SECTION_METADATA: Record<string, { name: string; desc: string; defaultChapter: string }> = {
    hero_story: {
        name: "Hero Story",
        desc: "Homepage hero storytelling and main product showcase section.",
        defaultChapter: "01 — Story"
    },
    map_origin: {
        name: "Map Origin",
        desc: "Ghana origin map and luxury text segment showcasing the roots.",
        defaultChapter: "02 — Origin"
    },
    palm_selection: {
        name: "Palm Fruit Selection",
        desc: "Cinematic full-bleed palm fruit banner transition segment.",
        defaultChapter: "None"
    },
    watermaking: {
        name: "Watermaking Process",
        desc: "Watermaking process banner redirect and experience link.",
        defaultChapter: "03 — Experience"
    },
    farms_banner: {
        name: "Our Farms",
        desc: "Organic farm source redirect banner pointing to local farms.",
        defaultChapter: "None"
    },
    reviews_banner: {
        name: "Reviews Banner",
        desc: "Customer reviews banner redirect and social proof segment.",
        defaultChapter: "None"
    },
    cta_section: {
        name: "Call To Action",
        desc: "Direct visitor visitation, private tasting & CEO connect section.",
        defaultChapter: "None"
    },
    footer_invite: {
        name: "Footer Brand Invite",
        desc: "Global footer brand invitation, links & newsletter subscription.",
        defaultChapter: "None"
    }
};

// Virtual sections that are not part of the generic homepage_sections table
const VIRTUAL_SECTIONS: Record<string, { name: string; desc: string; chapter_marker: string }> = {
    products_showcase: {
        name: "Products Showcase",
        desc: "Manage the Savannah Reserve and Savannah Daily product details.",
        chapter_marker: "01 — Story"
    },
    heritage_stories: {
        name: "Heritage Stories",
        desc: "Manage the luxury storytelling cards and brand experience links.",
        chapter_marker: "02 — Origin"
    }
};

// Desired visual order in the sidebar to match the live homepage
const SIDEBAR_ORDER = [
    "hero_story",
    "products_showcase",
    "map_origin",
    "palm_selection",
    "heritage_stories",
    "watermaking",
    "farms_banner",
    "reviews_banner",
    "cta_section",
    "footer_invite"
];

// About Page Metadata
const ABOUT_SECTION_METADATA: Record<string, { name: string; desc: string; chapter_marker?: string }> = {
    about_hero: {
        name: "Hero Section",
        desc: "Hero section with headline and story introduction.",
        chapter_marker: "01 — Heritage"
    },
    about_story_timeline: {
        name: "Story Timeline",
        desc: "Timeline of the Savannah journey from 2002 to present.",
        chapter_marker: "02 — Timeline"
    },
    about_craftsmanship: {
        name: "Craftsmanship",
        desc: "Artisanal process and scientific refinement details.",
        chapter_marker: "03 — Process"
    },
    about_signature_collections: {
        name: "Signature Collections",
        desc: "Savannah Reserve and Savannah Daily collection details.",
        chapter_marker: "04 — Collections"
    }
};

const ABOUT_SIDEBAR_ORDER = [
    "about_hero",
    "about_story_timeline",
    "about_craftsmanship",
    "about_signature_collections"
];

// Helper to format field keys to clean labels
const formatFieldLabel = (key: string): string => {
    return key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatMediaFileSize = (size: number | string): string => {
    const numericSize = typeof size === "number" ? size : Number(size);

    if (!Number.isFinite(numericSize)) {
        return String(size || "Unknown");
    }

    if (numericSize >= 1024 * 1024) {
        return `${(numericSize / (1024 * 1024)).toFixed(1)} MB`;
    }

    if (numericSize >= 1024) {
        return `${Math.round(numericSize / 1024)} KB`;
    }

    return `${numericSize} B`;
};

const getMediaAssetUrl = (asset: MediaAsset): string => {
    const source = asset.file_url || asset.file_path || asset.filename;

    if (!source) return "";
    if (/^https?:\/\//i.test(source)) return source;
    if (source.startsWith("/")) return `https://savannahdrinks.co.uk${source}`;
    if (source.startsWith("uploads/")) return `https://savannahdrinks.co.uk/${source}`;

    return `https://savannahdrinks.co.uk/uploads/media/${source}`;
};

const getMediaDisplayName = (asset: MediaAsset): string => {
    return asset.filename || `Media asset ${asset.id}`;
};

const isSupportedMediaFile = (file: File): boolean => {
    return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
};

const getHomepageImageUrlFieldKey = (fieldKey: string): string => {
    return fieldKey.endsWith("_id") ? fieldKey.replace(/_id$/, "_url") : `${fieldKey}_url`;
};

const getFullCmsImageUrl = (path: string): string => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    return `https://savannahdrinks.co.uk${path.startsWith("/") ? "" : "/"}${path}`;
};

interface CmsSidebarItem {
    id: string;
    label: string;
    key: string;
    type: 'homepage' | 'about' | 'media';
    isVirtual: boolean;
    chapter_marker?: string;
    data?: any;
}

type CmsPageKey = "home" | "about" | "blog" | "contact" | "media-library" | "global-settings";
type CmsPageType = "content" | "tool";

const PAGE_TYPES: Record<CmsPageKey, CmsPageType> = {
    home: "content",
    about: "content",
    blog: "tool",
    contact: "tool",
    "media-library": "tool",
    "global-settings": "tool"
};

interface HomepageImageFieldConfig {
    fieldKey: string;
    label: string;
    description: string;
}

const HOMEPAGE_IMAGE_FIELDS: Record<string, HomepageImageFieldConfig[]> = {
    hero_story: [
        {
            fieldKey: "hero_image_id",
            label: "Homepage Hero Image",
            description: "Main full-height hero image displayed beside the opening story headline."
        },
        {
            fieldKey: "hero_story_card_image_id",
            label: "Hero Story Card Image",
            description: "Supporting image displayed beside the hero inspiration story card."
        }
    ],
    map_origin: [
        {
            fieldKey: "map_image_id",
            label: "Origin Map Image",
            description: "Ghana origin map image used in the Born From Ghana section."
        }
    ],
    palm_selection: [
        {
            fieldKey: "palm_banner_image_id",
            label: "Palm Selection Banner",
            description: "Full-width palm fruit selection transition image."
        }
    ],
    watermaking: [
        {
            fieldKey: "watermaking_image_id",
            label: "Watermaking Process Banner",
            description: "Full-width image used for the watermaking process link banner."
        }
    ],
    farms_banner: [
        {
            fieldKey: "farms_image_id",
            label: "Our Farms Banner",
            description: "Full-width image used for the farms experience banner."
        }
    ],
    reviews_banner: [
        {
            fieldKey: "reviews_image_id",
            label: "Reviews Banner",
            description: "Full-width image used for the reviews and community banner."
        }
    ],
    footer_invite: [
        {
            fieldKey: "footer_logo_image_id",
            label: "Footer Logo Image",
            description: "Savannah Water logo image displayed in the footer invitation section."
        }
    ]
};

const ABOUT_PAGE_IMAGE_FIELDS: Record<string, HomepageImageFieldConfig[]> = {
    about_hero: [
        {
            fieldKey: "hero_image_id",
            label: "About Hero Image",
            description: "Main background image for the About page hero section."
        },
        {
            fieldKey: "farms_image_id",
            label: "About Farms Image",
            description: "Banner image for the Our Farms section on the About page."
        }
    ],
    about_story_timeline: [
        {
            fieldKey: "image_id",
            label: "Timeline Entry Image",
            description: "Supporting image for this specific timeline milestone."
        }
    ],
    about_craftsmanship: [
        {
            fieldKey: "image_id",
            label: "Craftsmanship Card Image",
            description: "Visual representation of this craftsmanship process card."
        }
    ],
    about_signature_collections: [
        {
            fieldKey: "main_image_id",
            label: "Signature Collections Image",
            description: "Main featured image for the Signature Collections section."
        }
    ]
};

export const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [activePage, setActivePage] = useState<CmsPageKey>("home");
    const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
    const [selectedMediaAsset, setSelectedMediaAsset] = useState<MediaAsset | null>(null);
    const [mediaLoading, setMediaLoading] = useState(false);
    const [mediaError, setMediaError] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
    const [uploadMessage, setUploadMessage] = useState<string | null>(null);
    const [deletingMediaId, setDeletingMediaId] = useState<number | null>(null);
    const [isHomepageMediaPickerOpen, setIsHomepageMediaPickerOpen] = useState(false);
    const [homepageImageIds, setHomepageImageIds] = useState<Record<string, string>>({});
    const [homepageImagePreviewPaths, setHomepageImagePreviewPaths] = useState<Record<string, string>>({});
    const [activeHomepageImagePicker, setActiveHomepageImagePicker] = useState<HomepageImageFieldConfig | null>(null);

    // About Page Media Picker State
    const [isAboutMediaPickerOpen, setIsAboutMediaPickerOpen] = useState(false);
    const [activeAboutImagePicker, setActiveAboutImagePicker] = useState<{
        sectionKey: string;
        fieldKey: string;
        label: string;
        itemId?: number; // For timeline or craftsmanship items
    } | null>(null);

    const {
        homepageSections,
        products,
        selectedSection: selectedHomeSection,
        loading: homeLoading,
        sectionLoading: homeSectionLoading,
        error: homeError,
        selectSection: selectHomeSection,
        saving: homeSaving,
        saveSection: saveHomeSection,
        saveProduct
    } = useHomepageCms();

    const {
        hero: aboutHero,
        storyTimeline,
        craftsmanshipCards,
        signatureCollections,
        loading: aboutLoading,
        error: aboutError,
        saving: aboutSaving,
        saveHero,
        saveStoryTimeline,
        saveCraftsmanshipCard,
        saveSignatureCollection,
        updateLocalHeroImage,
        updateLocalTimelineImage,
        updateLocalCraftsmanshipImage,
        updateLocalSignatureImage
    } = useAboutPageCms();

    // Derived values based on active page
    const pageType = PAGE_TYPES[activePage];
    const showStructureSidebar = pageType === "content";
    const isHome = activePage === "home";
    const isAbout = activePage === "about";
    const isMediaLibrary = activePage === "media-library";
    const loading = isHome ? homeLoading : isAbout ? aboutLoading : false;
    const error = isHome ? homeError : isAbout ? aboutError : null;
    const selectedSection = isHome ? selectedHomeSection : null; // About sections are now handled via specialized components
    const sectionLoading = isHome ? homeSectionLoading : false;
    const saving = isHome ? homeSaving : isAbout ? aboutSaving : false;
    const selectSection = isHome ? selectHomeSection : (id: number) => { }; // No-op for About page as we use keys
    const saveSection = isHome ? saveHomeSection : async () => ({ success: true });

    // Handle page switching: select the first section of the new page
    useEffect(() => {
        if (isHome) {
            if (homepageSections.length > 0 && !selectedHomeSection) {
                selectHomeSection(homepageSections[0].id);
            }
            setSelectedVirtualKey(null);
        } else if (isAbout) {
            setSelectedVirtualKey("about_hero");
        } else if (pageType === "tool") {
            setSelectedVirtualKey(null);
        }
    }, [activePage, homepageSections, pageType]);

    // Local state for sidebar toggle on mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Collapsible states for sidebars
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [isStructureCollapsed, setIsStructureCollapsed] = useState(false);

    // Track virtual section selection
    const [selectedVirtualKey, setSelectedVirtualKey] = useState<string | null>(null);

    // Local form values dictionary to allow real-time preview updates
    const [formValues, setFormValues] = useState<Record<string, string>>({});

    // Refs for GSAP animation
    const sidebarRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const cardsContainerRef = useRef<HTMLDivElement>(null);
    const editorPanelRef = useRef<HTMLDivElement>(null);
    const mediaFileInputRef = useRef<HTMLInputElement>(null);

    // Sync form values when the selected section details are loaded
    useEffect(() => {
        if (selectedSection && selectedSection.fields) {
            const initialValues: Record<string, string> = {};
            selectedSection.fields.forEach((field) => {
                initialValues[field.key] = field.value || "";
            });
            const configuredImageFields = HOMEPAGE_IMAGE_FIELDS[selectedSection.section_key] || [];
            const initialImageIds: Record<string, string> = {};
            const initialImagePreviewPaths: Record<string, string> = {};
            configuredImageFields.forEach((field) => {
                initialImageIds[field.fieldKey] = initialValues[field.fieldKey] || "";

                const urlFieldKey = getHomepageImageUrlFieldKey(field.fieldKey);
                if (initialValues[urlFieldKey]) {
                    initialImagePreviewPaths[field.fieldKey] = getFullCmsImageUrl(initialValues[urlFieldKey]);
                }
            });
            setFormValues(initialValues);
            setHomepageImageIds(initialImageIds);
            setHomepageImagePreviewPaths(initialImagePreviewPaths);

            // Reset virtual selection if a real section is chosen
            setSelectedVirtualKey(null);

            // GSAP transition when switching sections in the editor
            gsap.fromTo(
                editorPanelRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );

            // GSAP transition for the active card selection
            gsap.fromTo(
                `.cms-card-stagger.${styles.activeCard}`,
                { scale: 0.98, borderColor: "rgba(197, 168, 128, 0.2)" },
                { scale: 1, borderColor: "rgba(197, 168, 128, 0.8)", duration: 0.4, ease: "back.out(1.5)" }
            );
        }
    }, [selectedSection]);

    // Entrance GSAP animations on mount
    useEffect(() => {
        if (!loading && homepageSections.length > 0) {
            const ctx = gsap.context(() => {
                // Sidebar entrance slide-right & fade
                gsap.fromTo(
                    sidebarRef.current,
                    { x: -50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
                );

                // Main heading & layout fade-in
                gsap.fromTo(
                    mainContentRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 1.0, ease: "power2.out" }
                );

                // Section cards stagger entrance
                gsap.fromTo(
                    ".cms-card-stagger",
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        stagger: 0.08,
                        ease: "power2.out"
                    }
                );
            });
            return () => ctx.revert();
        }
    }, [loading, homepageSections]);

    const fetchMediaAssets = async () => {
        setMediaLoading(true);
        setMediaError(null);

        try {
            const response = await mediaLibraryService.getMedia();

            if (!response.success) {
                throw new Error(response.message || response.error || "Failed to load media assets.");
            }

            console.log("Media Assets:", response.media);
            setMediaAssets(response.media || []);
        } catch (err) {
            console.error("Failed to load media assets:", err);
            setMediaError("Unable to load media assets. Please try again.");
        } finally {
            setMediaLoading(false);
        }
    };

    useEffect(() => {
        if (isMediaLibrary) {
            fetchMediaAssets();
        }
    }, [isMediaLibrary]);

    useEffect(() => {
        if (selectedSection?.section_key === "hero_story") {
            console.log("Hero Image ID:", formValues.hero_image_id);
        }
    }, [formValues.hero_image_id, selectedSection]);

    const handleMediaFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!isSupportedMediaFile(file)) {
            setUploadStatus("error");
            setUploadMessage("Only JPG, PNG, and WEBP files are supported.");
            event.target.value = "";
            return;
        }

        setUploadStatus("uploading");
        setUploadMessage(`Uploading ${file.name}...`);

        try {
            const response = await mediaLibraryService.uploadMedia(file);

            if (!response.success) {
                throw new Error(response.message || response.error || "Upload failed.");
            }

            setUploadStatus("success");
            setUploadMessage(response.message || "Image uploaded successfully.");
            await fetchMediaAssets();
        } catch (err) {
            console.error("Failed to upload media asset:", err);
            setUploadStatus("error");
            setUploadMessage("Upload failed. Please try again.");
        } finally {
            event.target.value = "";
        }
    };

    const handleMediaDelete = async (asset: MediaAsset) => {
        setDeletingMediaId(asset.id);
        setMediaError(null);

        try {
            const response = await mediaLibraryService.deleteMedia(asset.id);

            if (!response.success) {
                throw new Error(response.message || response.error || "Delete failed.");
            }

            if (selectedMediaAsset?.id === asset.id) {
                setSelectedMediaAsset(null);
            }

            await fetchMediaAssets();
        } catch (err) {
            console.error("Failed to delete media asset:", err);
            setMediaError("Unable to delete media asset. Please try again.");
        } finally {
            setDeletingMediaId(null);
        }
    };

    const handleVirtualSelect = (key: string) => {
        setSelectedVirtualKey(key);
        // GSAP transition for editor
        gsap.fromTo(
            editorPanelRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
    };

    const handleInputChange = (key: string, val: string) => {
        setFormValues((prev) => ({
            ...prev,
            [key]: val
        }));
    };

    const handleHomepageImageSelect = (selectedMedia: MediaPickerSelection) => {
        console.log("Selected Media:", selectedMedia);
        if (!activeHomepageImagePicker) return;

        const fieldKey = activeHomepageImagePicker.fieldKey;
        const nextImageId = String(selectedMedia.id);
        setFormValues((prev) => ({
            ...prev,
            [fieldKey]: nextImageId
        }));
        setHomepageImageIds((prev) => ({
            ...prev,
            [fieldKey]: nextImageId
        }));
        setHomepageImagePreviewPaths((prev) => ({
            ...prev,
            [fieldKey]: selectedMedia.imagePath
        }));
    };

    const handleAboutImageSelect = (selectedMedia: MediaPickerSelection) => {
        if (!activeAboutImagePicker) return;

        const { sectionKey, fieldKey, itemId } = activeAboutImagePicker;
        const nextImageId = selectedMedia.id;
        const nextImageUrl = selectedMedia.imagePath;

        // Specialized handling based on section
        if (sectionKey === "about_hero") {
            updateLocalHeroImage(fieldKey, nextImageId, nextImageUrl);
        } else if (sectionKey === "about_story_timeline" && itemId !== undefined) {
            updateLocalTimelineImage(itemId, nextImageId, nextImageUrl);
        } else if (sectionKey === "about_craftsmanship" && itemId !== undefined) {
            updateLocalCraftsmanshipImage(itemId, nextImageId, nextImageUrl);
        } else if (sectionKey === "about_signature_collections") {
            updateLocalSignatureImage(nextImageId, nextImageUrl);
        }

        setIsAboutMediaPickerOpen(false);
        setActiveAboutImagePicker(null);
    };

    const handleSave = async () => {
        if (!selectedSection) return;

        const configuredImageFields = HOMEPAGE_IMAGE_FIELDS[selectedSection.section_key] || [];
        const imageValuesForSave = configuredImageFields.reduce<Record<string, string>>((acc, field) => {
            const value = homepageImageIds[field.fieldKey] || formValues[field.fieldKey] || "";
            acc[field.fieldKey] = value;

            return acc;
        }, {});

        const valuesForSave = {
            ...formValues,
            ...imageValuesForSave
        };

        console.log("FORM VALUES BEFORE SAVE", valuesForSave);

        const payload = Object.entries(valuesForSave).map(([key, value]) => ({
            key,
            value
        }));

        console.log("FINAL PAYLOAD", payload);

        try {
            await saveSection(selectedSection.id, payload);
            console.log("Section saved successfully");
        } catch (err) {
            console.error("Failed to save section", err);
        }
    };

    const handleProductSave = async (product: Partial<HomepageProduct> & { id: number }) => {
        try {
            await saveProduct(product);
        } catch (err) {
            console.error("Failed to save product", err);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    // Extract preview headline from currently loaded fields
    const getPreviewHeadline = (): string => {
        if (selectedVirtualKey === "products_showcase") return "SAVANNAH COLLECTIONS";
        if (selectedVirtualKey === "heritage_stories") return "HERITAGE & LEGACY";

        if (activePage === "about") {
            if (selectedVirtualKey === "about_hero") return aboutHero?.hero_title.toUpperCase() || "ABOUT HERO";
            if (selectedVirtualKey === "about_story_timeline") return "THE SAVANNAH JOURNEY";
            if (selectedVirtualKey === "about_craftsmanship") return "CRAFTSMANSHIP & PROCESS";
            if (selectedVirtualKey === "about_signature_collections") return "SIGNATURE COLLECTIONS";
            return "ABOUT US";
        }

        if (activePage === "media-library") {
            return "MEDIA LIBRARY";
        }

        if (!selectedSection) return "SAVANNAH WATER";

        // Look for a headline, title, or main label in current form values
        const headlineKeys = [
            "hero_headline_line_1",
            "map_headline_line_1",
            "palm_banner_label",
            "watermaking_label",
            "farms_label",
            "reviews_label",
            "cta_headline"
        ];

        for (const key of headlineKeys) {
            if (formValues[key]) {
                // If it's a multi-line headline, combine adjacent lines for preview if available
                if (key === "hero_headline_line_1") {
                    return `${formValues["hero_headline_line_1"]} ${formValues["hero_headline_line_2"] || ""} ${formValues["hero_headline_line_3"] || ""} ${formValues["hero_headline_line_4"] || ""}`.trim().toUpperCase();
                }
                if (key === "map_headline_line_1") {
                    return `${formValues["map_headline_line_1"]} ${formValues["map_headline_line_2"] || ""} ${formValues["map_headline_line_3"] || ""} ${formValues["map_headline_line_4"] || ""}`.trim().toUpperCase();
                }
                return formValues[key].toUpperCase();
            }
        }

        return SECTION_METADATA[selectedSection.section_key]?.name.toUpperCase() || "PREVIEW PANEL";
    };

    // Prepare the ordered list of sidebar items
    const sidebarItems: CmsSidebarItem[] = isHome
        ? SIDEBAR_ORDER.map(key => {
            const section = homepageSections.find(s => s.section_key === key);
            if (section) {
                return {
                    id: String(section.id),
                    label: SECTION_METADATA[key]?.name || formatFieldLabel(key),
                    key: section.section_key,
                    type: 'homepage',
                    isVirtual: false,
                    chapter_marker: section.chapter_marker || undefined,
                    data: section
                };
            }
            const virtual = VIRTUAL_SECTIONS[key];
            if (virtual) {
                return {
                    id: key,
                    label: virtual.name,
                    key: key,
                    type: 'homepage',
                    isVirtual: true,
                    chapter_marker: virtual.chapter_marker,
                    data: virtual
                };
            }
            return null;
        }).filter((item): item is CmsSidebarItem => item !== null)
        : isAbout
            ? ABOUT_SIDEBAR_ORDER.map(key => {
                const meta = ABOUT_SECTION_METADATA[key];
                if (meta) {
                    return {
                        id: key,
                        label: meta.name,
                        key: key,
                        type: 'about',
                        isVirtual: true,
                        chapter_marker: meta.chapter_marker,
                        data: meta
                    };
                }
                return null;
            }).filter((item): item is CmsSidebarItem => item !== null)
            : [];

    const selectedHomepageImageFields = selectedSection
        ? HOMEPAGE_IMAGE_FIELDS[selectedSection.section_key] || []
        : [];

    return (
        <div className={`h-screen bg-[#070D0A] text-[#F3F4F6] font-sans flex flex-col overflow-hidden ${styles.cmsContainer}`}>

            {/* MOBILE HEADER BAR */}
            <div className="md:hidden flex items-center justify-between px-6 py-4 bg-[#0B1510] border-b border-[#C5A880]/15 z-50">
                <div className="flex items-center gap-3">
                    <img src={logoLight} alt="Savannah Water Logo" className="h-8 w-auto object-contain" />
                    <span className="text-[10px] tracking-[0.2em] text-[#C5A880] uppercase font-light">CMS</span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-[#C5A880] focus:outline-none"
                >
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            <div className={`flex-1 flex overflow-hidden ${styles.dashboardGrid}`}>
                {/* SIDEBAR 1: CMS PAGE NAVIGATION (Collapsible to icons) */}
                <aside
                    ref={sidebarRef}
                    className={`fixed inset-y-0 left-0 z-40 bg-[#0B1510] border-r border-[#C5A880]/15 flex flex-col justify-between py-8 transition-all duration-300 md:translate-x-0 md:relative md:h-full overflow-visible ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } ${isNavCollapsed ? styles.navSidebarCollapsed : styles.navSidebar}`}
                >
                    <div className="flex flex-col gap-10 px-4 flex-grow overflow-y-auto overflow-x-hidden customScrollbar">
                        {/* Logo Branding */}
                        <div className="flex flex-col gap-2 relative">
                            <div className={`flex items-center gap-3 transition-all duration-300 ${isNavCollapsed ? "justify-center" : ""}`}>
                                <img src={logoLight} alt="Logo" className="h-10 w-auto object-contain" />
                                {!isNavCollapsed && <span className="font-serif text-lg tracking-wider text-[#F4F0E8] whitespace-nowrap">Savannah Water</span>}
                            </div>
                            <div className={`h-[1px] w-12 bg-[#C5A880]/30 mt-2 transition-all duration-300 ${isNavCollapsed ? "mx-auto" : ""}`}></div>

                            {/* Collapse Toggle Button (Floating style) */}
                            <button
                                onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                                className="absolute -right-7 top-2 bg-[#0B1510] border border-[#C5A880]/20 p-1 rounded-full text-[#C5A880] hover:bg-[#C5A880]/10 transition-all hidden md:flex z-50 shadow-xl"
                            >
                                {isNavCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex flex-col gap-1.5">
                            <button
                                onClick={() => setActivePage("home")}
                                className={`flex items-center gap-3 w-full text-left py-3 px-4 rounded-xl text-sm tracking-wider uppercase font-medium transition-all duration-300 ${isNavCollapsed ? "justify-center px-0" : ""} ${activePage === "home" ? "bg-[#C5A880]/10 border border-[#C5A880]/25 text-[#C5A880]" : "text-[#F3F4F6]/60 hover:text-[#F3F4F6] hover:bg-white/5"}`}
                            >
                                <Home className="w-4 h-4" />
                                {!isNavCollapsed && <span>Home</span>}
                            </button>

                            <button
                                onClick={() => setActivePage("about")}
                                className={`flex items-center gap-3 w-full text-left py-3 px-4 rounded-xl text-sm tracking-wider uppercase font-medium transition-all duration-300 ${isNavCollapsed ? "justify-center px-0" : ""} ${activePage === "about" ? "bg-[#C5A880]/10 border border-[#C5A880]/25 text-[#C5A880]" : "text-[#F3F4F6]/60 hover:text-[#F3F4F6] hover:bg-white/5"}`}
                            >
                                <Info className="w-4 h-4" />
                                {!isNavCollapsed && <span>About Us</span>}
                            </button>

                            <button
                                onClick={() => setActivePage("blog")}
                                className={`flex items-center gap-3 w-full text-left py-3 px-4 rounded-xl text-sm tracking-wider uppercase font-medium transition-all duration-300 ${isNavCollapsed ? "justify-center px-0" : ""} ${activePage === "blog" ? "bg-[#C5A880]/10 border border-[#C5A880]/25 text-[#C5A880]" : "text-[#F3F4F6]/60 hover:text-[#F3F4F6] hover:bg-white/5"}`}
                            >
                                <BookOpen className="w-4 h-4" />
                                {!isNavCollapsed && <span>Our Blog</span>}
                            </button>

                            <button
                                onClick={() => setActivePage("contact")}
                                className={`flex items-center gap-3 w-full text-left py-3 px-4 rounded-xl text-sm tracking-wider uppercase font-medium transition-all duration-300 ${isNavCollapsed ? "justify-center px-0" : ""} ${activePage === "contact" ? "bg-[#C5A880]/10 border border-[#C5A880]/25 text-[#C5A880]" : "text-[#F3F4F6]/60 hover:text-[#F3F4F6] hover:bg-white/5"}`}
                            >
                                <Mail className="w-4 h-4" />
                                {!isNavCollapsed && <span>Contact Us</span>}
                            </button>

                            <button
                                onClick={() => setActivePage("media-library")}
                                className={`flex items-center gap-3 w-full text-left py-3 px-4 rounded-xl text-sm tracking-wider uppercase font-medium transition-all duration-300 ${isNavCollapsed ? "justify-center px-0" : ""} ${activePage === "media-library" ? "bg-[#C5A880]/10 border border-[#C5A880]/25 text-[#C5A880]" : "text-[#F3F4F6]/60 hover:text-[#F3F4F6] hover:bg-white/5"}`}
                            >
                                <ImageIcon className="w-4 h-4" />
                                {!isNavCollapsed && <span>Media Library</span>}
                            </button>

                            <button
                                onClick={() => setActivePage("global-settings")}
                                className={`flex items-center gap-3 w-full text-left py-3 px-4 rounded-xl text-sm tracking-wider uppercase font-medium transition-all duration-300 ${isNavCollapsed ? "justify-center px-0" : ""} ${activePage === "global-settings" ? "bg-[#C5A880]/10 border border-[#C5A880]/25 text-[#C5A880]" : "text-[#F3F4F6]/60 hover:text-[#F3F4F6] hover:bg-white/5"}`}
                            >
                                <Settings className="w-4 h-4" />
                                {!isNavCollapsed && <span>Global Settings</span>}
                            </button>
                        </nav>
                    </div>

                    {/* User profile & Logout */}
                    <div className={`border-t border-[#C5A880]/10 pt-6 flex flex-col gap-4 transition-all px-4 mt-auto ${isNavCollapsed ? "items-center" : ""}`}>
                        <div className={`flex items-center gap-3 ${isNavCollapsed ? "justify-center" : ""}`}>
                            <div className="w-8 h-8 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] shrink-0">
                                <User className="w-4 h-4" />
                            </div>
                            {!isNavCollapsed && (
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-[10px] font-light text-[#9CA3AF] truncate">{user?.email || "admin@savannah.com"}</span>
                                    <span className="text-[8px] font-light tracking-widest text-[#C5A880] uppercase">Admin</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-2 text-left py-2 px-3 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-950/10 text-[10px] tracking-wider uppercase font-light transition-all duration-300 ${isNavCollapsed ? "justify-center" : ""}`}
                            title={isNavCollapsed ? "Logout" : ""}
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            {!isNavCollapsed && <span>Logout</span>}
                        </button>
                    </div>
                </aside>

                {showStructureSidebar && (
                    /* SIDEBAR 2: PAGE STRUCTURE NAVIGATION (Document Outline Style) */
                    <div className={`bg-[#070D0A] border-r border-[#C5A880]/10 flex flex-col p-6 transition-all duration-500 overflow-y-auto overflow-x-hidden customScrollbar ${isStructureCollapsed ? styles.structurePanelCollapsed : styles.structurePanel}`}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2.5">
                                <Layers className="w-3.5 h-3.5 text-[#C5A880]" />
                                <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#9CA3AF] uppercase">
                                    Page Outline
                                </h2>
                            </div>

                            {/* Collapse Toggle */}
                            <button
                                onClick={() => setIsStructureCollapsed(true)}
                                className="p-1.5 rounded-full hover:bg-white/5 text-[#C5A880]/40 hover:text-[#C5A880] transition-colors"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-1">
                            {sidebarItems.map((item) => {
                                const isSelected = item.isVirtual
                                    ? selectedVirtualKey === item.key
                                    : (selectedSection?.id === Number(item.id) && !selectedVirtualKey);

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => item.isVirtual ? handleVirtualSelect(item.key) : selectSection(Number(item.id))}
                                        className={`flex flex-col text-left ${styles.outlineItem} ${isSelected ? styles.outlineItemActive : ""}`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className={`text-sm font-serif tracking-wide transition-colors ${isSelected ? "text-[#C5A880]" : "text-[#F3F4F6]/60"}`}>
                                                {item.label}
                                            </span>
                                            {item.isVirtual && (
                                                <Sparkles className={`w-3 h-3 ${isSelected ? "text-[#C5A880]" : "text-[#C5A880]/10"}`} />
                                            )}
                                        </div>
                                        {item.chapter_marker && !isSelected && (
                                            <span className="text-[7px] font-medium tracking-[0.1em] text-[#9CA3AF]/30 uppercase mt-0.5">
                                                {item.chapter_marker}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activePage === "blog" ? (
                    <BlogModule />
                ) : activePage === "contact" ? (
                    <ContactModule />
                ) : activePage === "global-settings" ? (
                    <GlobalSettingsModule />
                ) : (
                    /* MAIN CONTENT AREA: EDITOR (Priority 60-70% width) */
                    <main
                        ref={mainContentRef}
                        className={`flex-1 overflow-y-auto overflow-x-hidden p-8 lg:p-12 flex flex-col gap-8 customScrollbar ${styles.editorArea}`}
                    >
                        {/* Top Header Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#C5A880]/10 pb-8">
                            <div className="flex items-center gap-4">
                                {showStructureSidebar && isStructureCollapsed && (
                                    <button
                                        onClick={() => setIsStructureCollapsed(false)}
                                        className="p-2.5 bg-[#C5A880]/10 border border-[#C5A880]/20 rounded-2xl text-[#C5A880] hover:bg-[#C5A880]/20 transition-all flex items-center gap-2 group shadow-lg"
                                    >
                                        <Layers className="w-4 h-4" />
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                )}
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-serif font-light text-[#F3F4F6] tracking-wide">
                                        {isMediaLibrary ? "Media Library" : "Editor"}
                                    </h1>
                                    <p className="text-[#9CA3AF] text-sm font-light leading-relaxed mt-1">
                                        {isMediaLibrary
                                            ? "Manage visual assets used throughout the Savannah Water website."
                                            : selectedVirtualKey
                                                ? (VIRTUAL_SECTIONS[selectedVirtualKey]?.name || ABOUT_SECTION_METADATA[selectedVirtualKey]?.name || "Specialized Editor")
                                                : (selectedSection
                                                    ? (SECTION_METADATA[selectedSection.section_key]?.name || formatFieldLabel(selectedSection.section_key))
                                                    : "Select a section to begin")}
                                    </p>
                                </div>
                            </div>

                            {/* Active indicator */}
                            <div className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-300 text-[10px] tracking-widest uppercase font-light">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span>{isMediaLibrary ? "MEDIA LIBRARY" : "Live Sync Active"}</span>
                            </div>
                        </div>

                        {/* LOADING SKELETON STATE */}
                        {loading ? (
                            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                                <Loader2 className="w-10 h-10 text-[#C5A880] animate-spin mb-4" />
                                <p className="text-xs font-light tracking-[0.2em] text-[#C5A880] uppercase animate-pulse">
                                    Retrieving {isHome ? "Homepage" : "About Us"} Structures...
                                </p>
                            </div>
                        ) : error ? (
                            /* BRANDED ERROR STATE */
                            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] border border-red-500/20 bg-red-950/10 rounded-2xl p-8 max-w-xl mx-auto text-center">
                                <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                                <h3 className="text-xl font-serif font-light text-red-200">System Connection Failure</h3>
                                <p className="text-sm font-light text-red-400/80 leading-relaxed mt-2">
                                    {error}
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-6 bg-red-950/30 hover:bg-red-950/50 border border-red-500/30 text-red-300 text-xs tracking-wider uppercase px-6 py-3 rounded-xl transition-all duration-300"
                                >
                                    Retry Connection
                                </button>
                            </div>
                        ) : (
                            <div className={`flex flex-col gap-8 relative ${isMediaLibrary ? "w-full max-w-none" : "max-w-5xl"}`}>
                                {sectionLoading ? (
                                    <div className="absolute inset-0 bg-[#070D0A]/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-20">
                                        <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin mb-2" />
                                        <span className="text-xs font-light tracking-widest text-[#C5A880] uppercase">
                                            Loading Section Data...
                                        </span>
                                    </div>
                                ) : null}

                                {isMediaLibrary ? (
                                    <div className="flex flex-col gap-8">
                                        {/* Upload Area */}
                                        <section className="bg-[#0B1510]/50 border border-dashed border-[#C5A880]/25 rounded-3xl p-8 lg:p-10 shadow-2xl">
                                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-8 items-center">
                                                <div className="flex flex-col gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
                                                        <UploadCloud className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-serif font-light tracking-wide text-[#F3F4F6]">
                                                            Upload Area
                                                        </h2>
                                                        <p className="text-sm text-[#9CA3AF] font-light leading-relaxed mt-2 max-w-2xl">
                                                            Add JPG, PNG, or WEBP assets to the live Savannah media library.
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-3">
                                                        <input
                                                            ref={mediaFileInputRef}
                                                            type="file"
                                                            accept="image/jpeg,image/png,image/webp"
                                                            onChange={handleMediaFileChange}
                                                            className="hidden"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => mediaFileInputRef.current?.click()}
                                                            disabled={uploadStatus === "uploading"}
                                                            className="inline-flex items-center justify-center gap-2 bg-[#C5A880] hover:bg-[#D5B890] text-[#070D0A] text-[10px] font-bold tracking-[0.15em] uppercase px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {uploadStatus === "uploading" ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <UploadCloud className="w-4 h-4" />
                                                            )}
                                                            <span>{uploadStatus === "uploading" ? "Uploading..." : "Select Image"}</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={fetchMediaAssets}
                                                            disabled={mediaLoading || uploadStatus === "uploading"}
                                                            className="inline-flex items-center justify-center gap-2 bg-[#070D0A]/50 border border-[#C5A880]/20 hover:border-[#C5A880]/50 text-[#C5A880] text-[10px] font-bold tracking-[0.15em] uppercase px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {mediaLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                                                            <span>Refresh</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="bg-[#070D0A]/50 border border-[#C5A880]/10 rounded-2xl p-5 text-center">
                                                    <div className="flex justify-center mb-3">
                                                        {uploadStatus === "uploading" ? (
                                                            <Loader2 className="w-5 h-5 text-[#C5A880] animate-spin" />
                                                        ) : uploadStatus === "success" ? (
                                                            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                                                        ) : uploadStatus === "error" ? (
                                                            <AlertCircle className="w-5 h-5 text-red-300" />
                                                        ) : (
                                                            <UploadCloud className="w-5 h-5 text-[#C5A880]" />
                                                        )}
                                                    </div>
                                                    <p className={`text-[10px] tracking-[0.2em] uppercase font-bold ${uploadStatus === "error" ? "text-red-300" : uploadStatus === "success" ? "text-emerald-300" : "text-[#C5A880]"}`}>
                                                        {uploadStatus === "uploading" ? "Uploading" : uploadStatus === "success" ? "Upload Complete" : uploadStatus === "error" ? "Upload Error" : "Ready"}
                                                    </p>
                                                    <p className="text-xs text-[#9CA3AF] font-light leading-relaxed mt-2 break-words">
                                                        {uploadMessage || "Connected to the live media API."}
                                                    </p>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Asset Grid */}
                                        <section className="bg-[#0B1510]/50 border border-[#C5A880]/10 rounded-3xl p-6 lg:p-8 shadow-2xl flex flex-col gap-6">
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#C5A880]/10 pb-6">
                                                <div>
                                                    <h2 className="text-2xl font-serif font-light tracking-wide text-[#F3F4F6]">
                                                        Asset Grid
                                                    </h2>
                                                    <p className="text-xs text-[#9CA3AF] font-light mt-1">
                                                        {mediaAssets.length} live assets available from the media library.
                                                    </p>
                                                </div>
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <div className="flex items-center gap-2 bg-[#070D0A]/50 border border-[#C5A880]/10 rounded-xl px-4 py-2.5 text-[#9CA3AF]">
                                                        <Search className="w-4 h-4 text-[#C5A880]/70" />
                                                        <span className="text-xs font-light">Search disabled</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-[#070D0A]/50 border border-[#C5A880]/10 rounded-xl px-4 py-2.5 text-[#9CA3AF]">
                                                        <Filter className="w-4 h-4 text-[#C5A880]/70" />
                                                        <span className="text-xs font-light">All assets</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {mediaError ? (
                                                <div className="flex items-center gap-3 bg-red-950/10 border border-red-500/20 rounded-2xl p-5 text-red-200">
                                                    <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />
                                                    <p className="text-sm font-light">{mediaError}</p>
                                                </div>
                                            ) : null}

                                            {mediaLoading ? (
                                                <div className="min-h-[280px] flex flex-col items-center justify-center text-center">
                                                    <Loader2 className="w-10 h-10 text-[#C5A880] animate-spin mb-4" />
                                                    <p className="text-xs font-light tracking-[0.2em] text-[#C5A880] uppercase">
                                                        Loading Media Assets...
                                                    </p>
                                                </div>
                                            ) : mediaAssets.length === 0 ? (
                                                <div className="min-h-[260px] flex flex-col items-center justify-center text-center border border-[#C5A880]/10 rounded-3xl bg-[#070D0A]/30 p-8">
                                                    <ImageIcon className="w-12 h-12 text-[#C5A880]/20 mb-4" />
                                                    <h3 className="text-xl font-serif font-light text-[#F3F4F6]">No Media Assets</h3>
                                                    <p className="text-sm text-[#9CA3AF] font-light mt-2 max-w-sm">
                                                        Upload a JPG, PNG, or WEBP image to begin building the live media library.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                                                    {mediaAssets.map((asset) => (
                                                        <div
                                                            key={asset.id}
                                                            className="group bg-[#070D0A]/45 border border-[#C5A880]/10 hover:border-[#C5A880]/45 rounded-2xl overflow-hidden text-left transition-all duration-300 shadow-xl hover:-translate-y-0.5"
                                                        >
                                                            <button
                                                                type="button"
                                                                onClick={() => setSelectedMediaAsset(asset)}
                                                                className="block w-full text-left"
                                                            >
                                                                <div className="aspect-[4/3] bg-[#050806] overflow-hidden relative">
                                                                    <img
                                                                        src={getMediaAssetUrl(asset)}
                                                                        alt={asset.alt_text || getMediaDisplayName(asset)}
                                                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                                                    />
                                                                    <div className="absolute top-3 right-3 bg-[#070D0A]/80 border border-[#C5A880]/20 rounded-full px-2.5 py-1 text-[8px] tracking-widest uppercase text-[#C5A880]">
                                                                        {asset.file_type}
                                                                    </div>
                                                                    <div className="absolute inset-0 bg-[#070D0A]/0 group-hover:bg-[#070D0A]/20 transition-colors flex items-center justify-center">
                                                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#C5A880] text-[#070D0A] rounded-full p-2">
                                                                            <Maximize2 className="w-4 h-4" />
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                            <div className="p-4 flex flex-col gap-3">
                                                                <div>
                                                                    <h3 className="text-sm font-serif tracking-wide text-[#F3F4F6] truncate">
                                                                        {getMediaDisplayName(asset)}
                                                                    </h3>
                                                                    <p className="text-[10px] uppercase tracking-[0.15em] text-[#C5A880]/70 mt-1 truncate">
                                                                        {asset.alt_text || "No alt text"}
                                                                    </p>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2 text-[10px] text-[#9CA3AF] font-light">
                                                                    <span>{formatMediaFileSize(asset.file_size)}</span>
                                                                    <span className="text-right">{asset.created_at}</span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleMediaDelete(asset)}
                                                                    disabled={deletingMediaId === asset.id}
                                                                    className="flex items-center justify-center gap-2 border border-red-500/20 hover:border-red-400/40 text-red-300/70 hover:text-red-200 rounded-xl py-2 text-[9px] tracking-[0.16em] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    {deletingMediaId === asset.id ? (
                                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                    ) : (
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    )}
                                                                    <span>{deletingMediaId === asset.id ? "Deleting" : "Delete"}</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </section>
                                    </div>
                                ) : selectedVirtualKey === "products_showcase" ? (
                                    <ProductEditor
                                        products={products}
                                        onSave={handleProductSave}
                                        saving={saving}
                                    />
                                ) : selectedVirtualKey === "about_story_timeline" ? (
                                    <StoryTimelineEditor
                                        timeline={storyTimeline}
                                        onSave={saveStoryTimeline}
                                        saving={saving}
                                        onMediaPickerOpen={(itemId, fieldKey, label) => {
                                            setActiveAboutImagePicker({
                                                sectionKey: "about_story_timeline",
                                                fieldKey,
                                                label,
                                                itemId
                                            });
                                            setIsAboutMediaPickerOpen(true);
                                        }}
                                    />
                                ) : selectedVirtualKey === "about_hero" ? (
                                    <AboutHeroEditor
                                        hero={aboutHero}
                                        onSave={saveHero}
                                        saving={saving}
                                        onMediaPickerOpen={(fieldKey, label) => {
                                            setActiveAboutImagePicker({
                                                sectionKey: "about_hero",
                                                fieldKey,
                                                label
                                            });
                                            setIsAboutMediaPickerOpen(true);
                                        }}
                                    />
                                ) : selectedVirtualKey === "about_craftsmanship" ? (
                                    <CraftsmanshipEditor
                                        cards={craftsmanshipCards}
                                        onSave={saveCraftsmanshipCard}
                                        saving={saving}
                                        onMediaPickerOpen={(itemId, fieldKey, label) => {
                                            setActiveAboutImagePicker({
                                                sectionKey: "about_craftsmanship",
                                                fieldKey,
                                                label,
                                                itemId
                                            });
                                            setIsAboutMediaPickerOpen(true);
                                        }}
                                    />
                                ) : selectedVirtualKey === "about_signature_collections" ? (
                                    <SignatureCollectionsEditor
                                        collections={signatureCollections}
                                        onSave={saveSignatureCollection}
                                        saving={saving}
                                        onMediaPickerOpen={(fieldKey, label) => {
                                            setActiveAboutImagePicker({
                                                sectionKey: "about_signature_collections",
                                                fieldKey,
                                                label
                                            });
                                            setIsAboutMediaPickerOpen(true);
                                        }}
                                    />
                                ) : selectedVirtualKey === "heritage_stories" ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-[#0B1510]/50 border border-[#C5A880]/10 rounded-3xl">
                                        <Sparkles className="w-12 h-12 text-[#C5A880]/20" />
                                        <h3 className="text-xl font-serif font-light text-[#F3F4F6]">Heritage Stories Module</h3>
                                        <p className="text-sm text-[#9CA3AF] max-w-xs font-light">
                                            This specialized module for managing luxury brand stories is scheduled for Phase 3 implementation.
                                        </p>
                                    </div>
                                ) : selectedSection ? (
                                    <div className="bg-[#0B1510]/50 border border-[#C5A880]/10 rounded-3xl p-8 lg:p-10 flex flex-col gap-10 shadow-2xl">
                                        {selectedHomepageImageFields.length > 0 && (
                                            <div className="flex flex-col gap-5">
                                                {selectedHomepageImageFields.map((imageField) => {
                                                    const selectedId = homepageImageIds[imageField.fieldKey] || formValues[imageField.fieldKey] || "";
                                                    const previewPath = homepageImagePreviewPaths[imageField.fieldKey] || null;

                                                    return (
                                                        <div key={imageField.fieldKey} className="border border-[#C5A880]/10 rounded-3xl bg-[#070D0A]/35 overflow-hidden">
                                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-6 border-b border-[#C5A880]/10">
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">
                                                                        Homepage Media
                                                                    </p>
                                                                    <h3 className="text-xl font-serif font-light text-[#F3F4F6] mt-1">
                                                                        {imageField.label}
                                                                    </h3>
                                                                    <p className="text-sm text-[#9CA3AF] font-light leading-relaxed mt-2 max-w-xl">
                                                                        {imageField.description}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setActiveHomepageImagePicker(imageField);
                                                                        setIsHomepageMediaPickerOpen(true);
                                                                    }}
                                                                    className="inline-flex items-center justify-center gap-2 bg-[#C5A880] hover:bg-[#D5B890] text-[#070D0A] text-[10px] font-bold tracking-[0.15em] uppercase px-6 py-3 rounded-xl transition-all shadow-xl shadow-[#C5A880]/5"
                                                                >
                                                                    <ImageIcon className="w-4 h-4" />
                                                                    Change Image
                                                                </button>
                                                            </div>

                                                            <div className="p-6">
                                                                {selectedId && previewPath ? (
                                                                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-center">
                                                                        <div className="aspect-[4/3] bg-[#050806] border border-[#C5A880]/10 rounded-2xl overflow-hidden">
                                                                            <img
                                                                                src={previewPath}
                                                                                alt={`Selected ${imageField.label}`}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">
                                                                                Selected Media ID
                                                                            </p>
                                                                            <p className="text-2xl font-serif font-light text-[#F3F4F6] mt-1">
                                                                                {selectedId}
                                                                            </p>
                                                                            <p className="text-xs text-[#9CA3AF] font-light mt-3">
                                                                                This value will be included in the existing Homepage section save payload as {imageField.fieldKey}.
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="min-h-40 flex flex-col items-center justify-center text-center border border-dashed border-[#C5A880]/15 rounded-2xl bg-[#050806]/40 p-8">
                                                                        <ImageIcon className="w-10 h-10 text-[#C5A880]/20 mb-3" />
                                                                        <p className="text-sm text-[#F3F4F6] font-serif tracking-wide">
                                                                            No image selected in this editing session.
                                                                        </p>
                                                                        <p className="text-xs text-[#9CA3AF] font-light mt-2">
                                                                            Current saved media ID: {selectedId || "None"}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Dynamic Fields Form */}
                                        <div className="space-y-8">
                                            {selectedSection.fields && selectedSection.fields.length > 0 ? (
                                                selectedSection.fields.map((field) => {
                                                    if (selectedHomepageImageFields.some((imageField) => imageField.fieldKey === field.key)) {
                                                        return null;
                                                    }

                                                    const label = formatFieldLabel(field.key);
                                                    const isRichText = field.type === "rich_text";
                                                    const isUrl = field.type === "url";

                                                    return (
                                                        <div key={field.key} className="space-y-3">
                                                            <label className="block text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">
                                                                {label}
                                                            </label>

                                                            {isRichText ? (
                                                                <textarea
                                                                    value={formValues[field.key] || ""}
                                                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                                                    rows={6}
                                                                    className="w-full bg-[#070D0A]/50 border border-[#C5A880]/20 hover:border-[#C5A880]/40 focus:border-[#C5A880] focus:ring-4 focus:ring-[#C5A880]/5 rounded-2xl px-6 py-4 text-base text-[#F3F4F6] placeholder-[#4B5563] focus:outline-none transition-all duration-300 leading-relaxed font-light"
                                                                />
                                                            ) : (
                                                                <input
                                                                    type={isUrl ? "url" : "text"}
                                                                    value={formValues[field.key] || ""}
                                                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                                                    className="w-full bg-[#070D0A]/50 border border-[#C5A880]/20 hover:border-[#C5A880]/40 focus:border-[#C5A880] focus:ring-4 focus:ring-[#C5A880]/5 rounded-2xl px-6 py-4 text-base text-[#F3F4F6] placeholder-[#4B5563] focus:outline-none transition-all duration-300 font-light"
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-center py-8 text-[#9CA3AF] text-sm font-light">
                                                    No editable fields found in this section.
                                                </div>
                                            )}
                                        </div>

                                        {/* SAVE BUTTON (Connected to save pipeline) */}
                                        <div className="border-t border-[#C5A880]/10 pt-8 flex flex-col gap-4">
                                            <button
                                                type="button"
                                                disabled={saving}
                                                onClick={handleSave}
                                                className={`w-full bg-[#C5A880] hover:bg-[#D5B890] text-[#070D0A] font-bold text-xs tracking-[0.2em] uppercase py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-[#C5A880]/5 ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                                            >
                                                {saving ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Saving Changes...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4" />
                                                        Commit Changes
                                                    </>
                                                )}
                                            </button>
                                            <p className="text-[10px] font-light text-[#4B5563] tracking-widest text-center uppercase">
                                                * Changes are deployed immediately to the live environment.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    /* Empty State */
                                    <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] text-[#9CA3AF]/20">
                                        <Layers className="w-20 h-20 mb-6" />
                                        <p className="text-lg font-serif font-light tracking-widest uppercase">Select an outline item</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                )}
            </div>

            <MediaPickerModal
                isOpen={isHomepageMediaPickerOpen}
                onClose={() => {
                    setIsHomepageMediaPickerOpen(false);
                    setActiveHomepageImagePicker(null);
                }}
                onSelect={handleHomepageImageSelect}
                selectedMediaId={activeHomepageImagePicker && (homepageImageIds[activeHomepageImagePicker.fieldKey] || formValues[activeHomepageImagePicker.fieldKey])
                    ? Number(homepageImageIds[activeHomepageImagePicker.fieldKey] || formValues[activeHomepageImagePicker.fieldKey])
                    : null}
                title={activeHomepageImagePicker ? `Select ${activeHomepageImagePicker.label}` : "Select Homepage Image"}
                subtitle={activeHomepageImagePicker?.description || "Choose one Media Library asset for this Homepage image location."}
            />

            <MediaPickerModal
                isOpen={isAboutMediaPickerOpen}
                onClose={() => {
                    setIsAboutMediaPickerOpen(false);
                    setActiveAboutImagePicker(null);
                }}
                onSelect={handleAboutImageSelect}
                selectedMediaId={activeAboutImagePicker?.itemId
                    ? (activeAboutImagePicker.sectionKey === "about_story_timeline"
                        ? Number(storyTimeline.find(i => i.id === activeAboutImagePicker.itemId)?.image_id)
                        : Number(craftsmanshipCards.find(i => i.id === activeAboutImagePicker.itemId)?.image_id))
                    : activeAboutImagePicker?.sectionKey === "about_hero"
                        ? Number(aboutHero?.[activeAboutImagePicker.fieldKey as keyof AboutHero])
                        : activeAboutImagePicker?.sectionKey === "about_signature_collections"
                            ? Number(signatureCollections[0]?.main_image_id)
                            : null}
                title={activeAboutImagePicker ? `Select ${activeAboutImagePicker.label}` : "Select Image"}
                subtitle="Choose one Media Library asset for this About Page section."
            />

            {selectedMediaAsset && (
                <div className="fixed inset-0 z-[80] bg-[#030504]/85 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden bg-[#0B1510] border border-[#C5A880]/20 rounded-3xl shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between gap-4 border-b border-[#C5A880]/10 px-6 py-5">
                            <div>
                                <p className="text-[10px] tracking-[0.25em] uppercase text-[#C5A880] font-bold">
                                    Asset Preview
                                </p>
                                <h2 className="text-2xl font-serif font-light tracking-wide text-[#F3F4F6] mt-1">
                                    {getMediaDisplayName(selectedMediaAsset)}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedMediaAsset(null)}
                                className="w-10 h-10 rounded-full border border-[#C5A880]/20 text-[#C5A880] hover:bg-[#C5A880]/10 transition-colors flex items-center justify-center"
                                aria-label="Close asset preview"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] min-h-0 overflow-y-auto customScrollbar">
                            <div className="bg-[#050806] flex items-center justify-center p-6 lg:p-8 min-h-[360px]">
                                <img
                                    src={getMediaAssetUrl(selectedMediaAsset)}
                                    alt={selectedMediaAsset.alt_text || getMediaDisplayName(selectedMediaAsset)}
                                    className="max-h-[58vh] w-full object-contain rounded-2xl"
                                />
                            </div>

                            <aside className="border-t lg:border-t-0 lg:border-l border-[#C5A880]/10 p-6 flex flex-col gap-6">
                                <div>
                                    <h3 className="text-sm font-serif tracking-wide text-[#F3F4F6]">
                                        Asset Details
                                    </h3>
                                    <p className="text-xs text-[#9CA3AF] font-light leading-relaxed mt-2">
                                        Live metadata from the media assets table.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {[
                                        { icon: Tag, label: "Filename", value: getMediaDisplayName(selectedMediaAsset) },
                                        { icon: ImageIcon, label: "Type", value: selectedMediaAsset.file_type || "Unknown" },
                                        { icon: HardDrive, label: "Size", value: formatMediaFileSize(selectedMediaAsset.file_size) },
                                        { icon: Maximize2, label: "Alt Text", value: selectedMediaAsset.alt_text || "Not provided" },
                                        { icon: Calendar, label: "Created", value: selectedMediaAsset.created_at || "Unknown" }
                                    ].map((detail) => (
                                        <div
                                            key={detail.label}
                                            className="flex items-center justify-between gap-4 bg-[#070D0A]/50 border border-[#C5A880]/10 rounded-xl p-3"
                                        >
                                            <div className="flex items-center gap-2 text-[#9CA3AF]">
                                                <detail.icon className="w-3.5 h-3.5 text-[#C5A880]/70" />
                                                <span className="text-[10px] uppercase tracking-[0.14em]">
                                                    {detail.label}
                                                </span>
                                            </div>
                                            <span className="text-xs text-[#F3F4F6] font-light text-right">
                                                {detail.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="border-t border-[#C5A880]/10 py-4 text-center text-[9px] tracking-[0.3em] uppercase font-light text-[#4B5563] bg-[#070D0A]/80 backdrop-blur-md z-30 shrink-0">
                Savannah Water CMS © 2026 Savannah Drinks.
            </footer>
        </div>
    );
};
