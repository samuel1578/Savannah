import React, { useState, useEffect } from "react";
import { AboutHero } from "../../services/aboutPageCmsService";
import { Save, Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react";

interface AboutHeroEditorProps {
    hero: AboutHero | null;
    onSave: (hero: Partial<AboutHero> & { id: number }) => Promise<any>;
    saving: boolean;
}

export const AboutHeroEditor: React.FC<AboutHeroEditorProps> = ({
    hero,
    onSave,
    saving
}) => {
    const [formData, setFormData] = useState({
        hero_title: hero?.hero_title || "",
        hero_subtitle: hero?.hero_subtitle || ""
    });
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

    useEffect(() => {
        if (hero) {
            setFormData({
                hero_title: hero.hero_title || "",
                hero_subtitle: hero.hero_subtitle || ""
            });
        }
    }, [hero]);

    const handleInputChange = (field: "hero_title" | "hero_subtitle", value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!hero) return;

        setSaveStatus("saving");
        try {
            await onSave({
                id: hero.id,
                hero_title: formData.hero_title,
                hero_subtitle: formData.hero_subtitle
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
