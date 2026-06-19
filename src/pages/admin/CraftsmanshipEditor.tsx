import React, { useState, useEffect } from "react";
import { CraftsmanshipCard } from "../../services/aboutPageCmsService";
import { Save, Loader2, CheckCircle2, AlertCircle, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface CraftsmanshipEditorProps {
    cards: CraftsmanshipCard[];
    onSave: (card: Partial<CraftsmanshipCard> & { id: number }) => Promise<any>;
    saving: boolean;
}

export const CraftsmanshipEditor: React.FC<CraftsmanshipEditorProps> = ({
    cards,
    onSave,
    saving
}) => {
    console.log('Craftsmanship Data:', cards);

    const [localCards, setLocalCards] = useState<CraftsmanshipCard[]>(cards);
    const [saveStatus, setSaveStatus] = useState<Record<number, "idle" | "saving" | "success" | "error">>({});
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        setLocalCards(cards);
    }, [cards]);

    const handleInputChange = (id: number, field: keyof CraftsmanshipCard, value: string) => {
        setLocalCards(prev => prev.map(card =>
            card.id === id ? { ...card, [field]: value } : card
        ));
    };

    const handleSaveCard = async (id: number) => {
        const card = localCards.find(c => c.id === id);
        if (!card) return;

        setSaveStatus(prev => ({ ...prev, [id]: "saving" }));
        try {
            await onSave({
                id: card.id,
                heading: card.heading,
                body_content: card.body_content,
                status: card.status
            });
            setSaveStatus(prev => ({ ...prev, [id]: "success" }));
            setTimeout(() => {
                setSaveStatus(prev => ({ ...prev, [id]: "idle" }));
            }, 3000);
        } catch (err) {
            console.error(`Error saving craftsmanship card ${id}:`, err);
            setSaveStatus(prev => ({ ...prev, [id]: "error" }));
        }
    };

    if (!cards || cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-[#0B1510]/50 border border-[#C5A880]/10 rounded-3xl">
                <AlertCircle className="w-12 h-12 text-[#C5A880]/20" />
                <h3 className="text-xl font-serif font-light text-[#F3F4F6]">No Craftsmanship Cards</h3>
                <p className="text-sm text-[#9CA3AF] max-w-xs font-light">
                    No craftsmanship data was found in the database.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-[#C5A880]" />
                    <h2 className="text-xl font-serif font-light text-[#F3F4F6]">Craftsmanship & Process</h2>
                </div>
                <div className="text-[10px] tracking-widest text-[#9CA3AF] uppercase font-light">
                    Card {activeIndex + 1} of {cards.length}
                </div>
            </div>

            <div className="relative group">
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation={{
                        prevEl: '.swiper-button-prev-custom',
                        nextEl: '.swiper-button-next-custom',
                    }}
                    pagination={{
                        clickable: true,
                        el: '.swiper-pagination-custom',
                    }}
                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                    className="rounded-3xl overflow-hidden"
                >
                    {localCards.map((card, index) => {
                        const status = saveStatus[card.id] || "idle";
                        const isCardSaving = status === "saving";

                        return (
                            <SwiperSlide key={card.id}>
                                <div className="bg-[#0B1510]/50 border border-[#C5A880]/10 p-8 lg:p-10 flex flex-col gap-8 shadow-2xl relative overflow-hidden transition-all duration-500 min-h-[500px]">
                                    <div className="flex items-center justify-between border-b border-[#C5A880]/10 pb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-center text-[#C5A880] font-serif text-lg">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                            <div>
                                                <h3 className="text-[#F3F4F6] font-serif text-xl tracking-wide">{card.heading || "Untitled Card"}</h3>
                                                <p className="text-[#9CA3AF] text-[10px] uppercase tracking-widest font-light mt-1">Process Step {index + 1}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleSaveCard(card.id)}
                                            disabled={saving || isCardSaving}
                                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs tracking-widest uppercase font-medium transition-all duration-300 ${status === "success"
                                                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                                                : status === "error"
                                                    ? "bg-red-500/20 border border-red-500/40 text-red-400"
                                                    : "bg-[#C5A880] hover:bg-[#D4B996] text-[#070D0A] shadow-lg shadow-[#C5A880]/10"
                                                }`}
                                        >
                                            {isCardSaving ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : status === "success" ? (
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            ) : status === "error" ? (
                                                <AlertCircle className="w-3.5 h-3.5" />
                                            ) : (
                                                <Save className="w-3.5 h-3.5" />
                                            )}
                                            <span>{isCardSaving ? "Saving..." : status === "success" ? "Saved" : "Save Card"}</span>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8">
                                        <div className="space-y-3">
                                            <label className="block text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">
                                                Card Heading
                                            </label>
                                            <input
                                                type="text"
                                                value={card.heading}
                                                onChange={(e) => handleInputChange(card.id, "heading", e.target.value)}
                                                className="w-full bg-[#070D0A]/50 border border-[#C5A880]/20 hover:border-[#C5A880]/40 focus:border-[#C5A880] focus:ring-4 focus:ring-[#C5A880]/5 rounded-2xl px-6 py-4 text-base text-[#F3F4F6] placeholder-[#4B5563] focus:outline-none transition-all duration-300 font-light"
                                                placeholder="e.g. THE ART OF SMOKING"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">
                                                Body Narrative
                                            </label>
                                            <textarea
                                                value={card.body_content}
                                                onChange={(e) => handleInputChange(card.id, "body_content", e.target.value)}
                                                rows={8}
                                                className="w-full bg-[#070D0A]/50 border border-[#C5A880]/20 hover:border-[#C5A880]/40 focus:border-[#C5A880] focus:ring-4 focus:ring-[#C5A880]/5 rounded-2xl px-6 py-4 text-base text-[#F3F4F6] placeholder-[#4B5563] focus:outline-none transition-all duration-300 leading-relaxed font-light"
                                                placeholder="Enter the detailed craftsmanship narrative..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                {/* Custom Navigation */}
                <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#070D0A]/80 border border-[#C5A880]/20 flex items-center justify-center text-[#C5A880] hover:bg-[#C5A880] hover:text-[#070D0A] transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none group-hover:translate-x-0 -translate-x-4 opacity-0 group-hover:opacity-100">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#070D0A]/80 border border-[#C5A880]/20 flex items-center justify-center text-[#C5A880] hover:bg-[#C5A880] hover:text-[#070D0A] transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none group-hover:translate-x-0 translate-x-4 opacity-0 group-hover:opacity-100">
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Custom Pagination */}
                <div className="swiper-pagination-custom flex justify-center gap-2 mt-6"></div>
            </div>

            <style>{`
                .swiper-pagination-custom .swiper-pagination-bullet {
                    background: #C5A880;
                    opacity: 0.2;
                    width: 8px;
                    height: 8px;
                    margin: 0 4px;
                    transition: all 0.3s ease;
                }
                .swiper-pagination-custom .swiper-pagination-bullet-active {
                    opacity: 1;
                    width: 24px;
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
};
