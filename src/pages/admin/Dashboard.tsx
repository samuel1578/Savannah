import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useHomepageCms } from "../../hooks/useHomepageCms";
import { HomepageSection, HomepageField, HomepageProduct } from "../../services/homepageCmsService";
import { ProductEditor } from "./ProductEditor";
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
        products,
        selectedSection,
        loading,
        sectionLoading,
        error,
        selectSection,
        saving,
        saveSection,
        saveProduct
    } = useHomepageCms();

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

    // Sync form values when the selected section details are loaded
    useEffect(() => {
        if (selectedSection && selectedSection.fields) {
            const initialValues: Record<string, string> = {};
            selectedSection.fields.forEach((field) => {
                initialValues[field.key] = field.value || "";
            });
            setFormValues(initialValues);

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

    const handleSave = async () => {
        if (!selectedSection) return;

        const payload = Object.entries(formValues).map(([key, value]) => ({
            key,
            value
        }));

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
    const sidebarItems = SIDEBAR_ORDER.map(key => {
        const section = homepageSections.find(s => s.section_key === key);
        if (section) {
            return { type: "real", data: section, key: section.section_key };
        }
        const virtual = VIRTUAL_SECTIONS[key];
        if (virtual) {
            return { type: "virtual", data: virtual, key };
        }
        return null;
    }).filter(Boolean);

    return (
        <div className={`min-h-screen bg-[#070D0A] text-[#F3F4F6] font-sans flex flex-col overflow-hidden ${styles.cmsContainer}`}>

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
                    className={`fixed inset-y-0 left-0 z-40 bg-[#0B1510] border-r border-[#C5A880]/15 flex flex-col justify-between py-8 transition-all duration-300 md:translate-x-0 md:static ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } ${isNavCollapsed ? styles.navSidebarCollapsed : styles.navSidebar}`}
                >
                    <div className="flex flex-col gap-10 px-4">
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
                            <button className={`flex items-center gap-3 w-full text-left py-3 px-4 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/25 text-[#C5A880] text-sm tracking-wider uppercase font-medium transition-all duration-300 ${isNavCollapsed ? "justify-center px-0" : ""}`}>
                                <Home className="w-4 h-4" />
                                {!isNavCollapsed && <span>Home</span>}
                            </button>

                            {/* Disabled placeholders */}
                            {[
                                { label: "About Us", icon: Info },
                                { label: "Our Blog", icon: BookOpen },
                                { label: "Contact Us", icon: Mail },
                                { label: "Media Library", icon: ImageIcon },
                                { label: "Global Settings", icon: Settings }
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-3 w-full text-left py-3 px-4 rounded-xl text-[#F3F4F6]/25 text-sm tracking-wider uppercase font-light cursor-not-allowed select-none group transition-all ${isNavCollapsed ? "justify-center px-0" : ""}`}
                                    title={isNavCollapsed ? item.label : "Available in Phase 2 Expansion"}
                                >
                                    <item.icon className="w-4 h-4 text-[#F3F4F6]/20" />
                                    {!isNavCollapsed && <span>{item.label}</span>}
                                </div>
                            ))}
                        </nav>
                    </div>

                    {/* User profile & Logout */}
                    <div className={`border-t border-[#C5A880]/10 pt-6 flex flex-col gap-4 transition-all px-4 ${isNavCollapsed ? "items-center" : ""}`}>
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

                {/* SIDEBAR 2: PAGE STRUCTURE NAVIGATION (Document Outline Style) */}
                <div className={`bg-[#070D0A] border-r border-[#C5A880]/10 flex flex-col p-6 transition-all duration-500 overflow-y-auto customScrollbar ${isStructureCollapsed ? styles.structurePanelCollapsed : styles.structurePanel}`}>
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
                        {sidebarItems.map((item: any) => {
                            const isVirtual = item.type === "virtual";
                            const isSelected = isVirtual
                                ? selectedVirtualKey === item.key
                                : (selectedSection?.id === item.data.id && !selectedVirtualKey);

                            const meta = isVirtual
                                ? item.data
                                : (SECTION_METADATA[item.key] || {
                                    name: formatFieldLabel(item.key),
                                    desc: "",
                                    chapter_marker: item.data.chapter_marker
                                });

                            return (
                                <button
                                    key={isVirtual ? item.key : item.data.id}
                                    onClick={() => isVirtual ? handleVirtualSelect(item.key) : selectSection(item.data.id)}
                                    className={`flex flex-col text-left ${styles.outlineItem} ${isSelected ? styles.outlineItemActive : ""}`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className={`text-sm font-serif tracking-wide transition-colors ${isSelected ? "text-[#C5A880]" : "text-[#F3F4F6]/60"}`}>
                                            {meta.name}
                                        </span>
                                        {isVirtual && (
                                            <Sparkles className={`w-3 h-3 ${isSelected ? "text-[#C5A880]" : "text-[#C5A880]/10"}`} />
                                        )}
                                    </div>
                                    {meta.chapter_marker && !isSelected && (
                                        <span className="text-[7px] font-medium tracking-[0.1em] text-[#9CA3AF]/30 uppercase mt-0.5">
                                            {meta.chapter_marker}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* MAIN CONTENT AREA: EDITOR (Priority 60-70% width) */}
                <main
                    ref={mainContentRef}
                    className={`flex-1 overflow-y-auto p-8 lg:p-12 flex flex-col gap-8 customScrollbar ${styles.editorArea}`}
                >
                    {/* Top Header Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#C5A880]/10 pb-8">
                        <div className="flex items-center gap-4">
                            {isStructureCollapsed && (
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
                                    Editor
                                </h1>
                                <p className="text-[#9CA3AF] text-sm font-light leading-relaxed mt-1">
                                    {selectedVirtualKey ? VIRTUAL_SECTIONS[selectedVirtualKey].name : (selectedSection ? SECTION_METADATA[selectedSection.section_key]?.name : "Select a section to begin")}
                                </p>
                            </div>
                        </div>

                        {/* Active indicator */}
                        <div className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-300 text-[10px] tracking-widest uppercase font-light">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>Live Sync Active</span>
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
                        <div className="flex flex-col gap-8 relative max-w-5xl">
                            {sectionLoading ? (
                                <div className="absolute inset-0 bg-[#070D0A]/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-20">
                                    <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin mb-2" />
                                    <span className="text-xs font-light tracking-widest text-[#C5A880] uppercase">
                                        Loading Section Data...
                                    </span>
                                </div>
                            ) : null}

                            {selectedVirtualKey === "products_showcase" ? (
                                <ProductEditor
                                    products={products}
                                    onSave={handleProductSave}
                                    saving={saving}
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
                                    {/* Dynamic Fields Form */}
                                    <div className="space-y-8">
                                        {selectedSection.fields && selectedSection.fields.length > 0 ? (
                                            selectedSection.fields.map((field) => {
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
            </div>

            {/* Footer */}
            <footer className="border-t border-[#C5A880]/10 py-4 text-center text-[9px] tracking-[0.3em] uppercase font-light text-[#4B5563] bg-[#070D0A]/80 backdrop-blur-md z-30 shrink-0">
                Savannah Water CMS © 2026 Savannah Drinks.
            </footer>
        </div>
    );
};
