import React, { useState, useEffect } from "react";
import { HomepageProduct, ProductSpec } from "../../services/homepageCmsService";
import { Save, Loader2, Plus, Trash2, ImageIcon, Sparkles, Settings, LayoutGrid } from "lucide-react";

interface ProductEditorProps {
    products: HomepageProduct[];
    onSave: (product: Partial<HomepageProduct> & { id: number }) => Promise<any>;
    saving: boolean;
}

export const ProductEditor: React.FC<ProductEditorProps> = ({ products, onSave, saving }) => {
    const [localProducts, setLocalProducts] = useState<HomepageProduct[]>([]);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (products && products.length > 0) {
            setLocalProducts(JSON.parse(JSON.stringify(products))); // Deep clone
        }
    }, [products]);

    const handleProductChange = (index: number, field: keyof HomepageProduct, value: string) => {
        const updated = [...localProducts];
        updated[index] = { ...updated[index], [field]: value };
        setLocalProducts(updated);
    };

    const handleSpecChange = (productIndex: number, specIndex: number, field: keyof ProductSpec, value: string) => {
        const updated = [...localProducts];
        const updatedSpecs = [...updated[productIndex].specifications];
        updatedSpecs[specIndex] = { ...updatedSpecs[specIndex], [field]: value };
        updated[productIndex] = { ...updated[productIndex], specifications: updatedSpecs };
        setLocalProducts(updated);
    };

    const addSpec = (productIndex: number) => {
        const updated = [...localProducts];
        updated[productIndex].specifications.push({ spec_label: "", spec_value: "" });
        setLocalProducts(updated);
    };

    const removeSpec = (productIndex: number, specIndex: number) => {
        const updated = [...localProducts];
        updated[productIndex].specifications.splice(specIndex, 1);
        setLocalProducts(updated);
    };

    const handleSaveProduct = async (product: HomepageProduct) => {
        await onSave({
            id: product.id,
            title: product.title,
            description: product.description,
            specifications: product.specifications
        });
    };

    if (localProducts.length === 0) return null;

    const currentProduct = localProducts[activeTab];

    return (
        <div className="flex flex-col gap-8">
            {/* Introductory Context Block */}
            <div className="bg-[#C5A880]/5 border border-[#C5A880]/10 rounded-2xl p-6 mb-2">
                <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-5 h-5 text-[#C5A880]" />
                    <h2 className="text-xl font-serif font-light text-[#F3F4F6] tracking-wide">Products Showcase</h2>
                </div>
                <p className="text-sm text-[#9CA3AF] font-light leading-relaxed">
                    This section controls the product content displayed directly beneath the homepage hero section.
                    Changes made here update the product titles, descriptions and specifications visible on the live homepage.
                </p>
            </div>

            {/* SHADCN STYLE TABS */}
            <div className="flex flex-col gap-4">
                <div className="flex bg-[#070D0A] p-1 rounded-xl border border-[#C5A880]/10 self-start">
                    {localProducts.map((p, idx) => {
                        const productLabel = p.title || `Product ${idx + 1}`;
                        return (
                            <button
                                key={p.id}
                                onClick={() => setActiveTab(idx)}
                                className={`px-6 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all ${activeTab === idx
                                    ? "bg-[#C5A880] text-[#070D0A] shadow-lg"
                                    : "text-[#9CA3AF] hover:text-[#F3F4F6]"
                                    }`}
                            >
                                Savannah {productLabel}
                            </button>
                        );
                    })}
                </div>

                {/* Active Product Context */}
                <div className="flex items-center gap-2 px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
                    <p className="text-[10px] text-[#C5A880] uppercase tracking-[0.2em] font-medium">
                        {(() => {
                            const currentLabel = currentProduct.title || `Product ${activeTab + 1}`;
                            return <>Currently Editing: Savannah {currentLabel}</>;
                        })()}
                        <span className="text-[#9CA3AF] ml-2 font-light">— This content controls the {activeTab === 0 ? "first" : "second"} featured product displayed on the homepage.</span>
                    </p>
                </div>
            </div>

            <div className="bg-[#0B1510]/40 border border-[#C5A880]/15 rounded-3xl p-8 flex flex-col gap-8 shadow-xl relative overflow-hidden">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C5A880]/10 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-center text-[#C5A880] font-serif text-lg">
                            {activeTab + 1}
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-light text-[#F3F4F6] tracking-wide uppercase">
                                {currentProduct.title || (currentProduct.product_key ? currentProduct.product_key.replace(/_/g, " ") : `Product ${activeTab + 1}`)}
                            </h3>
                        </div>
                    </div>

                    <button
                        onClick={() => handleSaveProduct(currentProduct)}
                        disabled={saving}
                        className="flex items-center justify-center gap-2 bg-[#C5A880] hover:bg-[#D5B890] text-[#070D0A] text-[10px] font-bold tracking-[0.15em] uppercase px-6 py-3 rounded-xl transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        <span>Update Product</span>
                    </button>
                </div>

                <div className="flex flex-col gap-10">
                    {/* Content Column - Now First */}
                    <div className="flex flex-col gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[9px] font-bold text-[#C5A880] tracking-wider uppercase">Product Title</label>
                                <input
                                    type="text"
                                    value={currentProduct.title}
                                    onChange={(e) => handleProductChange(activeTab, "title", e.target.value)}
                                    className="w-full bg-[#070D0A]/40 border border-[#C5A880]/20 focus:border-[#C5A880] rounded-xl px-5 py-3.5 text-base text-[#F3F4F6] outline-none transition-all placeholder-[#4B5563] font-light"
                                />
                            </div>

                            {/* Subtitle removed: not present in backend schema */}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[9px] font-bold text-[#C5A880] tracking-wider uppercase">Product Narrative</label>
                            <textarea
                                value={currentProduct.description}
                                onChange={(e) => handleProductChange(activeTab, "description", e.target.value)}
                                rows={4}
                                className="w-full bg-[#070D0A]/40 border border-[#C5A880]/20 focus:border-[#C5A880] rounded-xl px-5 py-3.5 text-sm text-[#F3F4F6] outline-none transition-all leading-relaxed font-light"
                            />
                        </div>

                        {/* Specifications Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-[#C5A880]/10 pb-3">
                                <div className="flex items-center gap-2">
                                    <Settings className="w-3.5 h-3.5 text-[#C5A880]" />
                                    <label className="block text-[9px] font-bold text-[#C5A880] tracking-wider uppercase">Technical Specifications</label>
                                </div>
                                <button
                                    onClick={() => addSpec(activeTab)}
                                    className="flex items-center gap-1.5 text-[8px] font-bold text-[#C5A880] hover:text-[#F3F4F6] bg-[#C5A880]/5 px-3 py-1.5 rounded-lg transition-all uppercase tracking-widest border border-[#C5A880]/10"
                                >
                                    <Plus className="w-3 h-3" />
                                    Add
                                </button>
                            </div>

                            <div className="flex flex-col gap-3">
                                {currentProduct.specifications.map((spec, sIndex) => (
                                    <div key={sIndex} className="flex gap-3 items-center group/spec">
                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 bg-[#070D0A]/20 p-3 rounded-xl border border-[#C5A880]/5">
                                            <input
                                                placeholder="Label"
                                                value={spec.spec_label}
                                                onChange={(e) => handleSpecChange(activeTab, sIndex, "spec_label", e.target.value)}
                                                className="bg-transparent border-b border-[#C5A880]/10 focus:border-[#C5A880] px-1 py-1 text-[11px] text-[#C5A880] outline-none transition-all uppercase tracking-widest font-bold"
                                            />
                                            <input
                                                placeholder="Value"
                                                value={spec.spec_value}
                                                onChange={(e) => handleSpecChange(activeTab, sIndex, "spec_value", e.target.value)}
                                                className="bg-transparent border-b border-[#C5A880]/10 focus:border-[#C5A880] px-1 py-1 text-[11px] text-[#F3F4F6] outline-none transition-all font-light"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeSpec(activeTab, sIndex)}
                                            className="p-2 text-red-400/20 hover:text-red-400 transition-all opacity-0 group-hover/spec:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Image Column - Now Shrunk and at bottom */}
                    <div className="flex flex-col gap-4 border-t border-[#C5A880]/10 pt-8">
                        <div className="flex items-center justify-between">
                            <label className="text-[9px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">Product Image (Phase 3)</label>
                            <span className="text-[8px] text-[#9CA3AF] uppercase tracking-widest italic">Media Library Integration Coming Soon</span>
                        </div>
                        <div className="h-32 bg-[#070D0A] border border-[#C5A880]/10 rounded-2xl flex items-center justify-center group/image relative overflow-hidden shadow-inner">
                            {currentProduct.file_path ? (
                                <img
                                    src={currentProduct.file_path}
                                    alt={currentProduct.alt_text || currentProduct.title}
                                    className="h-full object-contain p-4 opacity-50 grayscale transition-all duration-700 group-hover/image:opacity-100 group-hover/image:grayscale-0"
                                />
                            ) : (
                                <ImageIcon className="w-6 h-6 text-[#C5A880]/10" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
