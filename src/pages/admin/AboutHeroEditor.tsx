import React, { useState, useEffect } from "react";
import { AboutHero } from "../../services/aboutPageCmsService";
import { Save, Loader2, CheckCircle2, AlertCircle, Info, ImageIcon, Maximize2 } from "lucide-react";

interface AboutHeroEditorProps {
    hero: AboutHero | null;
    onSave: (hero: Partial<AboutHero> & { id: number }) => Promise<any>;
    saving: boolean;
    onMediaPickerOpen: (fieldKey: string, label: string) => void;
}

export const AboutHeroEditor: React.FC<AboutHeroEditorProps> = ({
    hero,
    onSave,
    saving,
    onMediaPickerOpen
}) => {
    const [formData, setFormData] = useState({
        hero_title: hero?.hero_title || "",
        hero_subtitle: hero?.hero_subtitle || "",
        hero_image_id: hero?.hero_image_id || null,
        farms_image_id: hero?.farms_image_id || null,
        hero_image_url: hero?.hero_image_url || "",
        farms_image_url: hero?.farms_image_url || ""
    });
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

    useEffect(() => {
        if (hero) {
            setFormData(prev => ({
                ...prev,
                hero_title: prev.hero_title || hero.hero_title,
                hero_subtitle: prev.hero_subtitle || hero.hero_subtitle,
                hero_image_id: hero.hero_image_id,
                farms_image_id: hero.farms_image_id,
                hero_image_url: hero.hero_image_url || "",
                farms_image_url: hero.farms_image_url || ""
            }));
        }
    }, [hero]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!hero) return;

        setSaveStatus("saving");
        try {
            await onSave({
                id: hero.id,
                hero_title: formData.hero_title,
                hero_subtitle: formData.hero_subtitle,
                hero_image_id: formData.hero_image_id,
                farms_image_id: formData.farms_image_id
            });
            setSaveStatus("success");
            setTimeout(() => {
                setSaveStatus("idle");
            }, 3000);
        } catch (err) {
            console.error("Error saving about hero:", err);
            setSaveStatus("error");
        }
    };

    if (!hero) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-[#0B1510]/50 border border-[#C5A880]/10 rounded-3xl">
                <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin" />
                <p className="text-sm text-[#9CA3AF] font-light">Loading Hero Data...</p>
            </div>
        );
    }

    const getFullImageUrl = (path: string) => {
        if (!path) return "";
        if (/^https?:\/\//i.test(path)) return path;
        return `https://savannahdrinks.co.uk${path.startsWith("/") ? "" : "/"}${path}`;
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-[#C5A880]" />
                    <h2 className="text-xl font-serif font-light text-[#F3F4F6]">About Hero Section</h2>
                </div>
            </div>

            <div className="bg-[#0B1510]/50 border border-[#C5A880]/10 rounded-3xl p-8 lg:p-10 flex flex-col gap-10 shadow-2xl relative overflow-hidden group hover:border-[#C5A880]/30 transition-all duration-500">
                <div className="space-y-8">
                    {/* Media Management - Replicating Homepage Architecture */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Hero Image */}
                        <div className="border border-[#C5A880]/10 rounded-3xl bg-[#070D0A]/35 overflow-hidden flex flex-col">
                            <div className="p-5 border-b border-[#C5A880]/10 flex items-center justify-between bg-[#C5A880]/5">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">Hero Image</label>
                                    <p className="text-[8px] text-[#9CA3AF] uppercase tracking-widest mt-0.5">Main Hero Background</p>
                                </div>
                                <button
                                    onClick={() => onMediaPickerOpen("hero_image_id", "About Hero Image")}
                                    className="bg-[#C5A880] hover:bg-[#D5B890] text-[#070D0A] px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-[#C5A880]/10"
                                >
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    <span>Change</span>
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="aspect-video bg-[#050806] rounded-2xl overflow-hidden border border-[#C5A880]/10 flex items-center justify-center relative group/img">
                                    {formData.hero_image_url ? (
                                        <>
                                            <img src={getFullImageUrl(formData.hero_image_url)} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" alt="Hero" />
                                            <div className="absolute inset-0 bg-[#070D0A]/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    onClick={() => onMediaPickerOpen("hero_image_id", "About Hero Image")}
                                                    className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-full hover:bg-white/20 transition-all"
                                                >
                                                    <Maximize2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-8 flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-[#C5A880]/5 border border-[#C5A880]/10 flex items-center justify-center">
                                                <ImageIcon className="w-6 h-6 text-[#C5A880]/20" />
                                            </div>
                                            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-[0.2em] font-light">No Image Selected</p>
                                        </div>
                                    )}
                                </div>
                                {formData.hero_image_id && (
                                    <div className="mt-4 flex items-center justify-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-[#C5A880]"></span>
                                        <p className="text-[9px] text-[#C5A880]/60 uppercase tracking-[0.2em] font-medium">Asset ID: {formData.hero_image_id}</p>
                                        <span className="w-1 h-1 rounded-full bg-[#C5A880]"></span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Farms Image */}
                        <div className="border border-[#C5A880]/10 rounded-3xl bg-[#070D0A]/35 overflow-hidden flex flex-col">
                            <div className="p-5 border-b border-[#C5A880]/10 flex items-center justify-between bg-[#C5A880]/5">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">Farms Image</label>
                                    <p className="text-[8px] text-[#9CA3AF] uppercase tracking-widest mt-0.5">Section Transition Banner</p>
                                </div>
                                <button
                                    onClick={() => onMediaPickerOpen("farms_image_id", "About Farms Image")}
                                    className="bg-[#C5A880] hover:bg-[#D5B890] text-[#070D0A] px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-[#C5A880]/10"
                                >
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    <span>Change</span>
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="aspect-video bg-[#050806] rounded-2xl overflow-hidden border border-[#C5A880]/10 flex items-center justify-center relative group/img">
                                    {formData.farms_image_url ? (
                                        <>
                                            <img src={getFullImageUrl(formData.farms_image_url)} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" alt="Farms" />
                                            <div className="absolute inset-0 bg-[#070D0A]/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    onClick={() => onMediaPickerOpen("farms_image_id", "About Farms Image")}
                                                    className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-full hover:bg-white/20 transition-all"
                                                >
                                                    <Maximize2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-8 flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-[#C5A880]/5 border border-[#C5A880]/10 flex items-center justify-center">
                                                <ImageIcon className="w-6 h-6 text-[#C5A880]/20" />
                                            </div>
                                            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-[0.2em] font-light">No Image Selected</p>
                                        </div>
                                    )}
                                </div>
                                {formData.farms_image_id && (
                                    <div className="mt-4 flex items-center justify-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-[#C5A880]"></span>
                                        <p className="text-[9px] text-[#C5A880]/60 uppercase tracking-[0.2em] font-medium">Asset ID: {formData.farms_image_id}</p>
                                        <span className="w-1 h-1 rounded-full bg-[#C5A880]"></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">
                            Hero Title
                        </label>
                        <input
                            type="text"
                            value={formData.hero_title}
                            onChange={(e) => handleInputChange("hero_title", e.target.value)}
                            className="w-full bg-[#070D0A]/50 border border-[#C5A880]/20 hover:border-[#C5A880]/40 focus:border-[#C5A880] focus:ring-4 focus:ring-[#C5A880]/5 rounded-2xl px-6 py-4 text-base text-[#F3F4F6] placeholder-[#4B5563] focus:outline-none transition-all duration-300 font-light"
                            placeholder="e.g. THE SAVANNAH STORY"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">
                            Hero Subtitle
                        </label>
                        <textarea
                            value={formData.hero_subtitle}
                            onChange={(e) => handleInputChange("hero_subtitle", e.target.value)}
                            rows={4}
                            className="w-full bg-[#070D0A]/50 border border-[#C5A880]/20 hover:border-[#C5A880]/40 focus:border-[#C5A880] focus:ring-4 focus:ring-[#C5A880]/5 rounded-2xl px-6 py-4 text-base text-[#F3F4F6] placeholder-[#4B5563] focus:outline-none transition-all duration-300 leading-relaxed font-light"
                            placeholder="Enter the hero introduction text..."
                        />
                    </div>
                </div>

                <div className="border-t border-[#C5A880]/10 pt-8">
                    <button
                        onClick={handleSave}
                        disabled={saving || saveStatus === "saving"}
                        className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-xl shadow-[#C5A880]/5 ${saveStatus === "success"
                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                            : saveStatus === "error"
                                ? "bg-red-500/20 border border-red-500/40 text-red-400"
                                : "bg-[#C5A880] hover:bg-[#D5B890] text-[#070D0A]"
                            }`}
                    >
                        {saveStatus === "saving" ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : saveStatus === "success" ? (
                            <CheckCircle2 className="w-4 h-4" />
                        ) : saveStatus === "error" ? (
                            <AlertCircle className="w-4 h-4" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        <span>
                            {saveStatus === "saving" ? "Saving Changes..." : saveStatus === "success" ? "Changes Saved" : "Commit Hero Changes"}
                        </span>
                    </button>
                    <p className="text-[10px] font-light text-[#4B5563] tracking-widest text-center uppercase mt-4">
                        * Changes are deployed immediately to the live environment.
                    </p>
                </div>
            </div>
        </div>
    );
};
