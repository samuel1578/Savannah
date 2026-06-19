import React, { useState } from "react";
import { StoryTimelineEntry } from "../../services/aboutPageCmsService";
import { Save, Loader2, CheckCircle2, AlertCircle, History } from "lucide-react";
import styles from "./Dashboard.module.css";

interface StoryTimelineEditorProps {
    timeline: StoryTimelineEntry[];
    onSave: (entry: Partial<StoryTimelineEntry> & { id: number }) => Promise<any>;
    saving: boolean;
}

export const StoryTimelineEditor: React.FC<StoryTimelineEditorProps> = ({
    timeline,
    onSave,
    saving
}) => {
    // Track which entry is being edited locally
    const [localTimeline, setLocalTimeline] = useState<StoryTimelineEntry[]>(timeline);
    const [saveStatus, setSaveStatus] = useState<Record<number, "idle" | "saving" | "success" | "error">>({});

    const handleInputChange = (id: number, field: keyof StoryTimelineEntry, value: string) => {
        setLocalTimeline(prev => prev.map(entry =>
            entry.id === id ? { ...entry, [field]: value } : entry
        ));
    };

    const handleSaveEntry = async (id: number) => {
        const entry = localTimeline.find(e => e.id === id);
        if (!entry) return;

        setSaveStatus(prev => ({ ...prev, [id]: "saving" }));
        try {
            await onSave({
                id: entry.id,
                year_label: entry.year_label,
                title: entry.title,
                story_content: entry.story_content,
                status: entry.status
            });
            setSaveStatus(prev => ({ ...prev, [id]: "success" }));
            setTimeout(() => {
                setSaveStatus(prev => ({ ...prev, [id]: "idle" }));
            }, 3000);
        } catch (err) {
            setSaveStatus(prev => ({ ...prev, [id]: "error" }));
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <History className="w-5 h-5 text-[#C5A880]" />
                    <h2 className="text-xl font-serif font-light text-[#F3F4F6]">Story Timeline</h2>
                </div>
                <div className="text-[10px] tracking-widest text-[#9CA3AF] uppercase font-light">
                    {timeline.length} Entries Total
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
                {localTimeline.map((entry, index) => {
                    const status = saveStatus[entry.id] || "idle";
                    const isEntrySaving = status === "saving";

                    return (
                        <div
                            key={entry.id}
                            className="bg-[#0B1510]/50 border border-[#C5A880]/10 rounded-3xl p-8 lg:p-10 flex flex-col gap-8 shadow-2xl relative overflow-hidden group hover:border-[#C5A880]/30 transition-all duration-500"
                        >
                            {/* Entry Header */}
                            <div className="flex items-center justify-between border-b border-[#C5A880]/10 pb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-center text-[#C5A880] font-serif text-lg">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>
                                    <div>
                                        <h3 className="text-[#F3F4F6] font-serif text-xl tracking-wide">Timeline Entry {String(index + 1).padStart(2, '0')}</h3>
                                        <p className="text-[#9CA3AF] text-[10px] uppercase tracking-widest font-light mt-1">Order: {entry.display_order}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSaveEntry(entry.id)}
                                    disabled={saving || isEntrySaving}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs tracking-widest uppercase font-medium transition-all duration-300 ${status === "success"
                                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                                            : status === "error"
                                                ? "bg-red-500/20 border border-red-500/40 text-red-400"
                                                : "bg-[#C5A880] hover:bg-[#D4B996] text-[#070D0A] shadow-lg shadow-[#C5A880]/10"
                                        }`}
                                >
                                    {isEntrySaving ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : status === "success" ? (
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                    ) : status === "error" ? (
                                        <AlertCircle className="w-3.5 h-3.5" />
                                    ) : (
                                        <Save className="w-3.5 h-3.5" />
                                    )}
                                    <span>{isEntrySaving ? "Saving..." : status === "success" ? "Saved" : "Save Entry"}</span>
                                </button>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">
                                        Year Label
                                    </label>
                                    <input
                                        type="text"
                                        value={entry.year_label}
                                        onChange={(e) => handleInputChange(entry.id, "year_label", e.target.value)}
                                        className="w-full bg-[#070D0A]/50 border border-[#C5A880]/20 hover:border-[#C5A880]/40 focus:border-[#C5A880] focus:ring-4 focus:ring-[#C5A880]/5 rounded-2xl px-6 py-4 text-base text-[#F3F4F6] placeholder-[#4B5563] focus:outline-none transition-all duration-300 font-light"
                                        placeholder="e.g. 2002"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">
                                        Entry Title
                                    </label>
                                    <input
                                        type="text"
                                        value={entry.title}
                                        onChange={(e) => handleInputChange(entry.id, "title", e.target.value)}
                                        className="w-full bg-[#070D0A]/50 border border-[#C5A880]/20 hover:border-[#C5A880]/40 focus:border-[#C5A880] focus:ring-4 focus:ring-[#C5A880]/5 rounded-2xl px-6 py-4 text-base text-[#F3F4F6] placeholder-[#4B5563] focus:outline-none transition-all duration-300 font-light"
                                        placeholder="e.g. ROOTED IN MODEST BEGINNINGS"
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-3">
                                    <label className="block text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">
                                        Story Narrative
                                    </label>
                                    <textarea
                                        value={entry.story_content}
                                        onChange={(e) => handleInputChange(entry.id, "story_content", e.target.value)}
                                        rows={5}
                                        className="w-full bg-[#070D0A]/50 border border-[#C5A880]/20 hover:border-[#C5A880]/40 focus:border-[#C5A880] focus:ring-4 focus:ring-[#C5A880]/5 rounded-2xl px-6 py-4 text-base text-[#F3F4F6] placeholder-[#4B5563] focus:outline-none transition-all duration-300 leading-relaxed font-light"
                                        placeholder="Enter the detailed story narrative..."
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
