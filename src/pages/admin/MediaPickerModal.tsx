import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Image as ImageIcon, Loader2, RefreshCw, Search, X } from "lucide-react";
import { MediaAsset, mediaLibraryService } from "../../services/mediaLibraryService";

export interface MediaPickerSelection {
    id: number;
    imagePath: string;
    asset: MediaAsset;
}

interface MediaPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (selection: MediaPickerSelection) => void;
    selectedMediaId?: number | null;
    title?: string;
    subtitle?: string;
}

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

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    selectedMediaId = null,
    title = "Select Media Asset",
    subtitle = "Choose one image from the live Savannah Water media library."
}) => {
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(selectedMediaId);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedAsset = useMemo(
        () => assets.find((asset) => asset.id === selectedId) || null,
        [assets, selectedId]
    );

    const fetchAssets = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await mediaLibraryService.getMedia();

            if (!response.success) {
                throw new Error(response.message || response.error || "Failed to load media assets.");
            }

            setAssets(response.media || []);
        } catch (err) {
            console.error("Failed to load media picker assets:", err);
            setError("Unable to load media assets. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setSelectedId(selectedMediaId);
            fetchAssets();
        }
    }, [isOpen, selectedMediaId]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    const handleConfirmSelection = () => {
        if (!selectedAsset) return;

        onSelect({
            id: selectedAsset.id,
            imagePath: getMediaAssetUrl(selectedAsset),
            asset: selectedAsset
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[90] bg-[#030504]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
            <div className="w-full max-w-6xl h-[calc(100dvh-1.5rem)] sm:h-[calc(100dvh-2rem)] max-h-[900px] overflow-hidden bg-[#0B1510] border border-[#C5A880]/20 rounded-3xl shadow-2xl flex flex-col">
                <div className="shrink-0 flex items-start justify-between gap-4 border-b border-[#C5A880]/10 px-5 lg:px-8 py-4 lg:py-5">
                    <div>
                        <p className="text-[10px] tracking-[0.25em] uppercase text-[#C5A880] font-bold">
                            Media Library
                        </p>
                        <h2 className="text-2xl lg:text-3xl font-serif font-light tracking-wide text-[#F3F4F6] mt-1">
                            {title}
                        </h2>
                        <p className="text-xs lg:text-sm text-[#9CA3AF] font-light leading-relaxed mt-1.5">
                            {subtitle}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-10 h-10 rounded-full border border-[#C5A880]/20 text-[#C5A880] hover:bg-[#C5A880]/10 transition-colors flex items-center justify-center shrink-0"
                        aria-label="Close media picker"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="shrink-0 flex items-center justify-between gap-4 px-5 lg:px-8 py-3 border-b border-[#C5A880]/10">
                    <div className="flex items-center gap-2 bg-[#070D0A]/50 border border-[#C5A880]/10 rounded-xl px-4 py-2.5 text-[#9CA3AF]">
                        <Search className="w-4 h-4 text-[#C5A880]/70" />
                        <span className="text-xs font-light">Live media assets</span>
                    </div>

                    <button
                        type="button"
                        onClick={fetchAssets}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 bg-[#070D0A]/50 border border-[#C5A880]/20 hover:border-[#C5A880]/50 text-[#C5A880] text-[10px] font-bold tracking-[0.15em] uppercase px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        <span>Refresh</span>
                    </button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto customScrollbar px-5 lg:px-8 py-5">
                    {loading ? (
                        <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center">
                            <Loader2 className="w-10 h-10 text-[#C5A880] animate-spin mb-4" />
                            <p className="text-xs font-light tracking-[0.2em] text-[#C5A880] uppercase">
                                Loading Media Assets...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center border border-red-500/20 bg-red-950/10 rounded-3xl p-8">
                            <AlertCircle className="w-12 h-12 text-red-300 mb-4" />
                            <h3 className="text-xl font-serif font-light text-red-100">Media Library Unavailable</h3>
                            <p className="text-sm text-red-300/80 font-light mt-2 max-w-sm">
                                {error}
                            </p>
                            <button
                                type="button"
                                onClick={fetchAssets}
                                className="mt-6 inline-flex items-center justify-center gap-2 bg-red-950/30 hover:bg-red-950/50 border border-red-500/30 text-red-200 text-[10px] font-bold tracking-[0.15em] uppercase px-5 py-3 rounded-xl transition-all"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Retry
                            </button>
                        </div>
                    ) : assets.length === 0 ? (
                        <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center border border-[#C5A880]/10 rounded-3xl bg-[#070D0A]/30 p-8">
                            <ImageIcon className="w-12 h-12 text-[#C5A880]/20 mb-4" />
                            <h3 className="text-xl font-serif font-light text-[#F3F4F6]">No Media Assets</h3>
                            <p className="text-sm text-[#9CA3AF] font-light mt-2 max-w-sm">
                                Upload images in the Media Library before selecting assets for CMS sections.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {assets.map((asset) => {
                                const isSelected = selectedId === asset.id;

                                return (
                                    <button
                                        key={asset.id}
                                        type="button"
                                        onClick={() => setSelectedId(asset.id)}
                                        className={`group bg-[#070D0A]/45 border rounded-2xl overflow-hidden text-left transition-all duration-300 shadow-xl hover:-translate-y-0.5 ${isSelected
                                            ? "border-[#C5A880] ring-4 ring-[#C5A880]/10"
                                            : "border-[#C5A880]/10 hover:border-[#C5A880]/45"
                                            }`}
                                    >
                                        <div className="aspect-[4/3] bg-[#050806] overflow-hidden relative">
                                            <img
                                                src={getMediaAssetUrl(asset)}
                                                alt={asset.alt_text || getMediaDisplayName(asset)}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                            />
                                            {isSelected && (
                                                <div className="absolute top-3 right-3 bg-[#C5A880] text-[#070D0A] rounded-full p-1.5 shadow-lg">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 flex flex-col gap-2">
                                            <h3 className="text-sm font-serif tracking-wide text-[#F3F4F6] truncate">
                                                {getMediaDisplayName(asset)}
                                            </h3>
                                            <p className="text-[10px] uppercase tracking-[0.15em] text-[#C5A880]/70 truncate">
                                                {asset.alt_text || "No alt text"}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#C5A880]/10 bg-[#0B1510]/95 px-5 lg:px-8 py-4 shadow-[0_-18px_40px_rgba(3,5,4,0.35)]">
                    <div className="flex items-center gap-3 min-w-0">
                        {selectedAsset ? (
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#C5A880]/20 bg-[#050806] shrink-0">
                                <img
                                    src={getMediaAssetUrl(selectedAsset)}
                                    alt={selectedAsset.alt_text || getMediaDisplayName(selectedAsset)}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-12 h-12 rounded-xl border border-[#C5A880]/10 bg-[#050806] flex items-center justify-center shrink-0">
                                <ImageIcon className="w-5 h-5 text-[#C5A880]/30" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#C5A880]">
                                Selected:
                            </p>
                            <p className="text-sm text-[#F3F4F6] font-light truncate max-w-[260px] sm:max-w-[360px]">
                                {selectedAsset ? getMediaDisplayName(selectedAsset) : "No image selected"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 rounded-xl border border-[#C5A880]/20 text-[#C5A880] hover:bg-[#C5A880]/10 text-[10px] font-bold tracking-[0.15em] uppercase transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmSelection}
                            disabled={!selectedAsset}
                            className="px-6 py-3 rounded-xl bg-[#C5A880] hover:bg-[#D5B890] text-[#070D0A] text-[10px] font-bold tracking-[0.15em] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Use Selected Image
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
