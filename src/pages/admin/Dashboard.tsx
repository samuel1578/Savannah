import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useHomepageCms } from "../../hooks/useHomepageCms";
import { HomepageSection, HomepageField } from "../../services/homepageCmsService";
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
    AlertCircle,
    Loader2
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

// Helper to format field keys to clean labels
const formatFieldLabel = (key: string): string => {
    return key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const {
        homepageSections,
        selectedSection,
        loading,
        sectionLoading,
        error,
        selectSection,
        saving,
        saveSection
    } = useHomepageCms();

    // Local state for sidebar toggle on mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Local form values dictionary to allow real-time preview updates
    const [formValues, setFormValues] = useState<Record<string, string>>({});

    // Refs for GSAP animation
    const sidebarRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const cardsContainerRef = useRef<HTMLDivElement>(null);
    const editorPanelRef = useRef<HTMLDivElement>(null);

    // Sync form values when the selected section details are loaded
    useEffect(() => {
        if (selectedSection && selectedSection.fields) {
            const initialValues: Record<string, string> = {};
            selectedSection.fields.forEach((field) => {
                initialValues[field.key] = field.value || "";
            });
            setFormValues(initialValues);

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
    }, [loading]);

    const handleInputChange = (key: string, val: string) => {
        setFormValues((prev) => ({
            ...prev,
            [key]: val
        }));
    };

    const handleSave = async () => {
        if (!selectedSection) return;

        const payload = Object.entries(formValues).map(([key, value]) => ({
            key,
            value
        }));

        console.log("FORM VALUES", formValues);
        console.log("SELECTED SECTION", selectedSection);
        console.log("PAYLOAD", payload);

        try {
            await saveSection(selectedSection.id, payload);
            console.log("Section saved successfully");
        } catch (err) {
            console.error("Failed to save section", err);
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

        // Fallback search
        const firstFieldKey = Object.keys(formValues)[0];
        if (firstFieldKey && formValues[firstFieldKey]) {
            return formValues[firstFieldKey].substring(0, 40).toUpperCase();
        }

        return SECTION_METADATA[selectedSection.section_key]?.name.toUpperCase() || "PREVIEW PANEL";
    };

    return (
        <div className={`min-h-screen bg-[#070D0A] text-[#F3F4F6] font-sans flex flex-col md:flex-row overflow-hidden ${styles.cmsContainer}`}>

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

            {/* LEFT SIDEBAR PANEL */}
            <aside
                ref={sidebarRef}
                className={`fixed inset-y-0 left-0 z-40 w-[280px] bg-[#0B1510] border-r border-[#C5A880]/15 flex flex-col justify-between p-8 transition-transform duration-300 md:translate-x-0 md:static ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col gap-10">
                    {/* Logo Branding */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <img src={logoLight} alt="Savannah Water Logo" className="h-10 w-auto object-contain" />
                            <span className="font-serif text-lg tracking-wider text-[#F4F0E8]">Savannah Water</span>
                        </div>
                        <div className="h-[1px] w-12 bg-[#C5A880]/30 mt-2"></div>
                        <span className="text-[10px] font-light tracking-[0.3em] text-[#C5A880]/60 uppercase mt-1">
                            Content Management
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-1.5">
                        <button className="flex items-center justify-between w-full text-left py-3 px-4 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/25 text-[#C5A880] text-sm tracking-wider uppercase font-medium transition-all duration-300">
                            <span className="flex items-center gap-3">
                                <Home className="w-4 h-4" />
                                Home
                            </span>
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        {/* Disabled placeholders styled elegantly in low opacity */}
                        {[
                            { label: "About Us", icon: Info },
                            { label: "Our Blog", icon: BookOpen },
                            { label: "Contact Us", icon: Mail },
                            { label: "Media Library", icon: ImageIcon },
                            { label: "Global Settings", icon: Settings }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 w-full text-left py-3 px-4 rounded-xl text-[#F3F4F6]/25 text-sm tracking-wider uppercase font-light cursor-not-allowed select-none group"
                                title="Available in Phase 2 Expansion"
                            >
                                <item.icon className="w-4 h-4 text-[#F3F4F6]/20" />
                                <span>{item.label}</span>
                                <span className="ml-auto text-[8px] tracking-widest text-[#C5A880]/20 font-mono uppercase scale-90 border border-[#C5A880]/10 px-1.5 py-0.5 rounded">
                                    Locked
                                </span>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* User profile & Logout */}
                <div className="border-t border-[#C5A880]/10 pt-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880]">
                            <User className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-light text-[#9CA3AF] truncate">{user?.email || "admin@savannah.com"}</span>
                            <span className="text-[9px] font-light tracking-widest text-[#C5A880] uppercase">Administrator</span>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-left py-2 px-3 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-950/10 text-xs tracking-wider uppercase font-light transition-all duration-300"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout Session</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main
                ref={mainContentRef}
                className="flex-1 overflow-y-auto p-6 sm:p-10 lg:p-12 flex flex-col gap-8 customScrollbar"
            >
                {/* Top Header Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#C5A880]/10 pb-6">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-serif font-light text-[#F3F4F6] tracking-wide">
                            Home Page CMS
                        </h1>
                        <p className="text-[#9CA3AF] text-sm font-light leading-relaxed mt-1">
                            Curate and configure the live editorial components of the Savannah Water homepage.
                        </p>
                    </div>

                    {/* Active indicator */}
                    <div className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-300 text-xs tracking-wider uppercase font-light">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Database Connected</span>
                    </div>
                </div>

                {/* LOADING SKELETON STATE */}
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                        <Loader2 className="w-10 h-10 text-[#C5A880] animate-spin mb-4" />
                        <p className="text-xs font-light tracking-[0.2em] text-[#C5A880] uppercase animate-pulse">
                            Retrieving Homepage Structures...
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
                    /* TWO-COLUMN CMS LAYOUT */
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-8 items-start">

                        {/* LEFT PANEL: Homepage Structure */}
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-2.5">
                                <Layers className="w-4.5 h-4.5 text-[#C5A880]" />
                                <h2 className="text-xl font-serif font-light text-[#F3F4F6] tracking-wide">
                                    Homepage Structure
                                </h2>
                            </div>

                            {/* Cards Container */}
                            <div
                                ref={cardsContainerRef}
                                className="flex flex-col gap-4 overflow-y-auto max-h-[70vh] pr-2 customScrollbar"
                            >
                                {homepageSections.map((section) => {
                                    const meta = SECTION_METADATA[section.section_key] || {
                                        name: formatFieldLabel(section.section_key),
                                        desc: "Custom homepage section.",
                                        defaultChapter: "None"
                                    };
                                    const isSelected = selectedSection?.id === section.id;

                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => selectSection(section.id)}
                                            className={`cms-card-stagger text-left p-5 rounded-2xl transition-all duration-300 relative overflow-hidden flex flex-col gap-3 group ${isSelected
                                                ? `${styles.activeCard} border-[#C5A880] bg-[#0B1510]`
                                                : `${styles.cardBorderGlow} bg-[#0B1510]/40 hover:bg-[#0B1510]/70`
                                                }`}
                                        >
                                            <div className="flex flex-col gap-1.5">
                                                <h3 className={`text-base font-serif font-light tracking-wide transition-colors ${isSelected ? "text-[#C5A880]" : "text-[#F3F4F6] group-hover:text-[#C5A880]"
                                                    }`}>
                                                    {meta.name}
                                                </h3>

                                                {/* Chapter Badge */}
                                                {section.chapter_marker && (
                                                    <span className={`text-[9px] font-semibold tracking-widest uppercase self-start px-2 py-0.5 rounded border ${isSelected
                                                        ? "bg-[#C5A880]/15 border-[#C5A880]/30 text-[#C5A880]"
                                                        : "bg-white/5 border-white/10 text-white/40 group-hover:text-white/60 transition-colors"
                                                        }`}>
                                                        {section.chapter_marker}
                                                    </span>
                                                )}

                                                <p className="text-xs font-light text-[#9CA3AF] leading-relaxed mt-1">
                                                    {meta.desc}
                                                </p>
                                            </div>

                                            {/* Status indicator */}
                                            <span className="text-[9px] font-light tracking-widest uppercase text-[#9CA3AF]/40 self-end mt-1">
                                                Status: {section.status}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* RIGHT PANEL: Section Editor */}
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <Edit3 className="w-4.5 h-4.5 text-[#C5A880]" />
                                    <h2 className="text-xl font-serif font-light text-[#F3F4F6] tracking-wide">
                                        Section Editor
                                    </h2>
                                </div>

                                {/* Active Section Indicator */}
                                {selectedSection && (
                                    <span className="text-xs font-light text-[#C5A880] tracking-wider uppercase border border-[#C5A880]/20 bg-[#C5A880]/5 px-3 py-1 rounded-full">
                                        Editing: {SECTION_METADATA[selectedSection.section_key]?.name || selectedSection.section_key}
                                    </span>
                                )}
                            </div>

                            {/* EDITOR PANEL FORM CONTAINER */}
                            <div
                                ref={editorPanelRef}
                                className="bg-[#0B1510]/50 border border-[#C5A880]/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-8 shadow-2xl relative"
                            >
                                {sectionLoading ? (
                                    <div className="absolute inset-0 bg-[#070D0A]/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-20">
                                        <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin mb-2" />
                                        <span className="text-xs font-light tracking-widest text-[#C5A880] uppercase">
                                            Loading Section Data...
                                        </span>
                                    </div>
                                ) : null}

                                {selectedSection ? (
                                    <>
                                        {/* Dynamic Fields Form */}
                                        <div className="space-y-6 max-h-[45vh] overflow-y-auto pr-2 customScrollbar">
                                            {selectedSection.fields && selectedSection.fields.length > 0 ? (
                                                selectedSection.fields.map((field) => {
                                                    const label = formatFieldLabel(field.key);
                                                    const isRichText = field.type === "rich_text";
                                                    const isUrl = field.type === "url";

                                                    return (
                                                        <div key={field.key} className="space-y-2">
                                                            <label className="block text-xs font-light text-[#C5A880] tracking-wider uppercase">
                                                                {label}
                                                            </label>

                                                            {isRichText ? (
                                                                <textarea
                                                                    value={formValues[field.key] || ""}
                                                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                                                    rows={4}
                                                                    className="w-full bg-[#070D0A]/50 border border-[#C5A880]/20 hover:border-[#C5A880]/40 focus:border-[#C5A880] focus:ring-4 focus:ring-[#C5A880]/10 rounded-xl px-4 py-3 text-sm text-[#F3F4F6] placeholder-[#4B5563] focus:outline-none transition-all duration-300 leading-relaxed font-light"
                                                                />
                                                            ) : (
                                                                <input
                                                                    type={isUrl ? "url" : "text"}
                                                                    value={formValues[field.key] || ""}
                                                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                                                    className="w-full bg-[#070D0A]/50 border border-[#C5A880]/20 hover:border-[#C5A880]/40 focus:border-[#C5A880] focus:ring-4 focus:ring-[#C5A880]/10 rounded-xl px-4 py-3.5 text-sm text-[#F3F4F6] placeholder-[#4B5563] focus:outline-none transition-all duration-300 font-light"
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

                                        {/* FIGMA PREVIEW CARD PANEL */}
                                        <div className="border-t border-[#C5A880]/10 pt-6 space-y-3">
                                            <div className="flex items-center gap-2 text-xs font-light text-[#C5A880] tracking-wider uppercase">
                                                <Eye className="w-4 h-4" />
                                                <span>Live Headline Preview</span>
                                            </div>

                                            <div className="bg-[#070D0A]/80 border border-[#C5A880]/15 rounded-xl p-5 shadow-inner flex flex-col gap-2 relative overflow-hidden group">
                                                {/* Luxury Pulse Dot */}
                                                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#C5A880]/40 animate-ping" />

                                                <span className="text-[9px] font-semibold tracking-widest text-[#C5A880]/40 uppercase">
                                                    Savannah Editorial Preview
                                                </span>

                                                <p className="text-lg font-serif font-light text-[#F3F4F6] tracking-wide leading-snug uppercase mt-1">
                                                    {getPreviewHeadline()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* SAVE BUTTON (Connected to save pipeline) */}
                                        <div className="border-t border-[#C5A880]/10 pt-6">
                                            <button
                                                type="button"
                                                disabled={saving}
                                                onClick={handleSave}
                                                className={`w-full bg-[#C5A880]/20 border border-[#C5A880]/30 font-medium text-xs tracking-widest uppercase py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${saving
                                                    ? "text-[#C5A880]/40 cursor-not-allowed select-none"
                                                    : "text-[#C5A880] hover:bg-[#C5A880]/30 cursor-pointer"
                                                    }`}
                                                title={saving ? "Saving changes..." : "Save all changes to the database"}
                                            >
                                                {saving ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Saving Changes...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4" />
                                                        Save Homepage Changes
                                                    </>
                                                )}
                                            </button>
                                            <p className="text-[10px] font-light text-[#4B5563] tracking-wide text-center mt-2.5">
                                                * Save changes securely to update the live website content.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-12 text-[#9CA3AF] text-sm font-light">
                                        Select a homepage section from the left panel to begin editing.
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
};
