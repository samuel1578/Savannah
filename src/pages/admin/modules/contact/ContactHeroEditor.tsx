import React, { useState, useEffect } from "react";
import { MediaPickerModal, MediaPickerSelection } from "../../MediaPickerModal";
import { ContactSettings } from "../../../services/contactCmsService";
import { Save, Loader2, CheckCircle2, AlertCircle, ImageIcon, Maximize2, Trash2, Sparkles } from "lucide-react";

interface ContactHeroEditorProps {
    settings: ContactSettings | null;
    onSave: (data: { hero_image_id: number | null }) => Promise<any>;
    saving: boolean;
}

export const ContactHeroEditor: React.FC<ContactHeroEditorProps> = ({
    settings,
    onSave,
    saving
}) => {
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [localHeroImageId, setLocalHeroImageId] = useState<number | null>(null);
    const [localHeroImageUrl, setLocalHeroImageUrl] = useState<string | null>(null);
    const [localHeroImageAlt, setLocalHeroImageAlt] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

    useEffect(() => {
        if (settings) {
            setLocalHeroImageId(settings.hero_image_id);
            setLocalHeroImageUrl(settings.hero_image_url || null);
            setLocalHeroImageAlt(settings.hero_image_alt || null);
        }
    }, [settings]);

    const getFullImageUrl = (path: string | null) => {
        if (!path) return "";
        if (/^https?:\/\//i.test(path)) return path;
        return `https://savannahdrinks.co.uk${path.startsWith("/") ? "" : "/"}${path}`;
    };

    const handleMediaSelect = (selection: MediaPickerSelection) => {
        setLocalHeroImageId(selection.id);
        setLocalHeroImageUrl(selection.imagePath);
        setLocalHeroImageAlt(selection.asset.alt_text || null);
        setShowMediaPicker(false);
    };

    const handleClearImage = () => {
        setLocalHeroImageId(null);
        setLocalHeroImageUrl(null);
        setLocalHeroImageAlt(null);
    };

    const handleSave = async () => {
        setSaveStatus("saving");
        try {
            await onSave({ hero_image_id: localHeroImageId });
            setSaveStatus("success");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch (err) {
            console.error("Error saving contact hero:", err);
            setSaveStatus("error");
            setTimeout(() => setSaveStatus("idle"), 3000);
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-[#C5A880]" />
                    <h2 className="text-xl font-serif font-light text-[#F3F4F6]">Hero Image Configuration</h2>
                </div>
            </div>

            <div className="bg-[#0B1510]/50 border border-[#C5A880]/10 rounded-3xl p-8 lg:p-10 flex flex-col gap-10 shadow-2xl relative overflow-hidden group hover:border-[#C5A880]/30 transition-all duration-500">
                <div className="space-y-8">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col">
                            <label className="text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">Contact Hero Image</label>
                            <p className="text-[8px] text-[#9CA3AF] uppercase tracking-widest mt-0.5">This image will be displayed at the top of the contact page.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            {/* Image Preview */}
                            <div className="aspect-video bg-[#050806] rounded-2xl overflow-hidden border border-[#C5A880]/10 flex items-center justify-center relative group/img shadow-inner">
                                {localHeroImageUrl ? (
                                    <>
                                        <img
                                            src={getFullImageUrl(localHeroImageUrl)}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                                            alt={localHeroImageAlt || "Contact Hero"}
                                        />
                                        <div className="absolute inset-0 bg-[#070D0A]/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => setShowMediaPicker(true)}
                                                className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-full hover:bg-white/20 transition-all"
                                                title="Change Image"
                                            >
                                                <Maximize2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={handleClearImage}
                                                className="bg-red-500/20 backdrop-blur-md border border-red-500/40 text-red-400 p-3 rounded-full hover:bg-red-500/30 transition-all"
                                                title="Clear Image"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-8 flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-[#C5A880]/5 border border-[#C5A880]/10 flex items-center justify-center">
                                            <ImageIcon className="w-8 h-8 text-[#C5A880]/20" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-[0.2em] font-light">No Image Selected</p>
                                            <p className="text-[8px] text-[#4B5563] uppercase tracking-widest">Recommended: 1920x1080px</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => setShowMediaPicker(true)}
                                    className="w-full bg-[#C5A880] hover:bg-[#D5B890] text-[#070D0A] px-6 py-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#C5A880]/10"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    <span>{localHeroImageUrl ? "Change Image" : "Select Image"}</span>
                                </button>

                                {localHeroImageUrl && (
                                    <button
                                        onClick={handleClearImage}
                                        className="w-full bg-[#070D0A]/50 border border-red-500/20 hover:border-red-500/40 text-red-400/80 hover:text-red-400 px-6 py-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Clear Image</span>
                                    </button>
                                )}

                                {localHeroImageId && (
                                    <div className="mt-2 flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-[#C5A880]/5 border border-[#C5A880]/10 w-fit mx-auto">
                                        <span className="w-1 h-1 rounded-full bg-[#C5A880]"></span>
                                        <p className="text-[9px] text-[#C5A880]/60 uppercase tracking-[0.2em] font-medium">Asset ID: {localHeroImageId}</p>
                                        <span className="w-1 h-1 rounded-full bg-[#C5A880]"></span>
                                    </div>
                                )}
                            </div>
                        </div>
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
                            {saveStatus === "saving" ? "Saving Changes..." : saveStatus === "success" ? "Changes Saved" : "Save Changes"}
                        </span>
                    </button>
                    <p className="text-[10px] font-light text-[#4B5563] tracking-widest text-center uppercase mt-4">
                        * Changes are deployed immediately to the live environment.
                    </p>
                </div>
            </div>

            <MediaPickerModal
                isOpen={showMediaPicker}
                onClose={() => setShowMediaPicker(false)}
                onSelect={handleMediaSelect}
                selectedMediaId={localHeroImageId || undefined}
                title="Select Contact Hero Image"
                subtitle="Choose a high-resolution image for the contact page hero section."
            />
        </div>
    );
};
