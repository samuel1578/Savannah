import React, { useState, useEffect } from "react";
import { SignatureCollection } from "../../services/aboutPageCmsService";
import { Save, Loader2, CheckCircle2, AlertCircle, Layers, ImageIcon } from "lucide-react";

interface SignatureCollectionsEditorProps {
    collections: SignatureCollection[];
    onSave: (collection: Partial<SignatureCollection> & { id: number }) => Promise<any>;
    saving: boolean;
    onMediaPickerOpen: (fieldKey: string, label: string) => void;
}

export const SignatureCollectionsEditor: React.FC<SignatureCollectionsEditorProps> = ({
    collections,
    onSave,
    saving,
    onMediaPickerOpen
}) => {
    console.log('Signature Collections:', collections);

    const [localCollections, setLocalCollections] = useState<SignatureCollection[]>(collections);
    const [activeTab, setActiveTab] = useState<number>(collections.length > 0 ? collections[0].id : 0);
    const [saveStatus, setSaveStatus] = useState<Record<number, "idle" | "saving" | "success" | "error">>({});

    useEffect(() => {
        setLocalCollections(prev => {
            if (prev.length === 0) return collections;
            return collections.map(incoming => {
                const existing = prev.find(p => p.id === incoming.id);
                if (existing) {
                    return {
                        ...existing,
                        main_image_id: incoming.main_image_id,
                        main_image_url: incoming.main_image_url
                    };
                }
                return incoming;
            });
        });
        if (collections.length > 0 && !collections.find(c => c.id === activeTab)) {
            setActiveTab(collections[0].id);
        }
    }, [collections]);

    const handleInputChange = (id: number, field: string, value: any) => {
        setLocalCollections(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleSaveCollection = async (id: number) => {
        const item = localCollections.find(c => c.id === id);
        if (!item) return;

        setSaveStatus(prev => ({ ...prev, [id]: "saving" }));
        try {
            await onSave({
                id: item.id,
                tab_title: item.tab_title,
                tab_content: item.tab_content,
                main_image_id: item.main_image_id,
                status: item.status
            });
            setSaveStatus(prev => ({ ...prev, [id]: "success" }));
            setTimeout(() => {
                setSaveStatus(prev => ({ ...prev, [id]: "idle" }));
            }, 3000);
        } catch (err) {
            console.error(`Error saving signature collection ${id}:`, err);
            setSaveStatus(prev => ({ ...prev, [id]: "error" }));
        }
    };

    const getFullImageUrl = (path: string) => {
        if (!path) return "";
        if (/^https?:\/\//i.test(path)) return path;
        return `https://savannahdrinks.co.uk${path.startsWith("/") ? "" : "/"}${path}`;
    };

    if (!collections || collections.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-[#0B1510]/50 border border-[#C5A880]/10 rounded-3xl">
                <AlertCircle className="w-12 h-12 text-[#C5A880]/20" />
                <h3 className="text-xl font-serif font-light text-[#F3F4F6]">No Signature Collections</h3>
                <p className="text-sm text-[#9CA3AF] max-w-xs font-light">
                    No signature collection data was found in the database.
                </p>
            </div>
        );
    }

    const activeItem = localCollections.find(c => c.id === activeTab) || localCollections[0];

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5 text-[#C5A880]" />
                    <h2 className="text-xl font-serif font-light text-[#F3F4F6]">Signature Collections</h2>
                </div>
            </div>

            {/* Media Section - Global for the whole collection module */}
            <div className="border border-[#C5A880]/10 rounded-3xl bg-[#0B1510]/50 overflow-hidden">
                <div className="p-6 border-b border-[#C5A880]/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-serif font-light text-[#F3F4F6]">Featured Collections Image</h3>
                        <p className="text-xs text-[#9CA3AF] font-light mt-1">Main image displayed at the bottom of the signature collections section.</p>
                    </div>
                    <button
                        onClick={() => onMediaPickerOpen("main_image_id", "Signature Collections Image")}
                        className="bg-[#C5A880] hover:bg-[#D5B890] text-[#070D0A] flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs tracking-widest uppercase font-bold transition-all shadow-lg shadow-[#C5A880]/10"
                    >
                        <ImageIcon className="w-4 h-4" />
                        <span>Change Image</span>
                    </button>
                </div>
                <div className="p-6">
                    <div className="h-64 w-full bg-[#050806] rounded-2xl overflow-hidden border border-[#C5A880]/10 flex items-center justify-center">
                        {activeItem.main_image_url ? (
                            <img src={getFullImageUrl(activeItem.main_image_url)} className="w-full h-full object-cover" alt="Collections" />
                        ) : (
                            <div className="text-center p-4">
                                <ImageIcon className="w-12 h-12 text-[#C5A880]/10 mx-auto mb-3" />
                                <p className="text-sm text-[#9CA3AF] uppercase tracking-widest font-light">No Featured Image Selected</p>
                            </div>
                        )}
                    </div>
                    {activeItem.main_image_id && (
                        <p className="text-[10px] text-[#C5A880] uppercase tracking-widest mt-4 text-center">Media ID: {activeItem.main_image_id} (Shared across all collection tabs)</p>
                    )}
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex p-1.5 bg-[#070D0A]/50 border border-[#C5A880]/10 rounded-2xl w-fit">
                {localCollections.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`px-6 py-2.5 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 ${activeTab === item.id
                            ? "bg-[#C5A880] text-[#070D0A] font-bold shadow-lg"
                            : "text-[#F3F4F6]/40 hover:text-[#F3F4F6] hover:bg-white/5"
                            }`}
                    >
                        {item.tab_title || `Collection ${item.id}`}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-[#0B1510]/50 border border-[#C5A880]/10 rounded-3xl p-8 lg:p-10 flex flex-col gap-8 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center justify-between border-b border-[#C5A880]/10 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-center text-[#C5A880] font-serif text-lg">
                            <Layers className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-[#F3F4F6] font-serif text-xl tracking-wide">{activeItem.tab_title || "Untitled Collection"}</h3>
                            <p className="text-[#9CA3AF] text-[10px] uppercase tracking-widest font-light mt-1">Collection Content</p>
                        </div>
                    </div>

                    <button
                        onClick={() => handleSaveCollection(activeItem.id)}
                        disabled={saving || saveStatus[activeItem.id] === "saving"}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs tracking-widest uppercase font-medium transition-all duration-300 ${saveStatus[activeItem.id] === "success"
                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                            : saveStatus[activeItem.id] === "error"
                                ? "bg-red-500/20 border border-red-500/40 text-red-400"
                                : "bg-[#C5A880] hover:bg-[#D4B996] text-[#070D0A] shadow-lg shadow-[#C5A880]/10"
                            }`}
                    >
                        {saveStatus[activeItem.id] === "saving" ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : saveStatus[activeItem.id] === "success" ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : saveStatus[activeItem.id] === "error" ? (
                            <AlertCircle className="w-3.5 h-3.5" />
                        ) : (
                            <Save className="w-3.5 h-3.5" />
                        )}
                        <span>{saveStatus[activeItem.id] === "saving" ? "Saving..." : saveStatus[activeItem.id] === "success" ? "Saved" : "Save Collection"}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">
                            Collection Title
                        </label>
                        <input
                            type="text"
                            value={activeItem.tab_title}
                            onChange={(e) => handleInputChange(activeItem.id, "tab_title", e.target.value)}
                            className="w-full bg-[#070D0A]/50 border border-[#C5A880]/20 hover:border-[#C5A880]/40 focus:border-[#C5A880] focus:ring-4 focus:ring-[#C5A880]/5 rounded-2xl px-6 py-4 text-base text-[#F3F4F6] placeholder-[#4B5563] focus:outline-none transition-all duration-300 font-light"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">
                            Description Content
                        </label>
                        <textarea
                            value={activeItem.tab_content}
                            onChange={(e) => handleInputChange(activeItem.id, "tab_content", e.target.value)}
                            rows={8}
                            className="w-full bg-[#070D0A]/50 border border-[#C5A880]/20 hover:border-[#C5A880]/40 focus:border-[#C5A880] focus:ring-4 focus:ring-[#C5A880]/5 rounded-2xl px-6 py-4 text-base text-[#F3F4F6] placeholder-[#4B5563] focus:outline-none transition-all duration-300 leading-relaxed font-light"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
