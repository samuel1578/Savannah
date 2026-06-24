import React from "react";
import { Plus, Trash2, FileText, CheckCircle, Clock, Calendar } from "lucide-react";
import { BlogPost, BlogCategory } from "../../../../services/blogCmsService";

interface BlogArticleListProps {
    articles: BlogPost[];
    selectedArticleId: number | null;
    onSelectArticle: (id: number) => void;
    onCreateArticle: () => void;
    onDeleteArticle: (id: number) => void;
    categories: BlogCategory[];
}

export const BlogArticleList: React.FC<BlogArticleListProps> = ({
    articles,
    selectedArticleId,
    onSelectArticle,
    onCreateArticle,
    onDeleteArticle,
    categories
}) => {
    const getCategoryName = (id: number) => {
        return categories.find(c => c.id === id)?.name || "Uncategorized";
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "published":
                return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "draft":
                return "bg-amber-500/10 text-amber-400 border-amber-500/20";
            case "scheduled":
                return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            default:
                return "bg-gray-500/10 text-gray-400 border-gray-500/20";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "published":
                return <CheckCircle className="w-3 h-3" />;
            case "draft":
                return <FileText className="w-3 h-3" />;
            case "scheduled":
                return <Clock className="w-3 h-3" />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                    <FileText className="w-3.5 h-3.5 text-[#C5A880]" />
                    <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#9CA3AF] uppercase">
                        Articles
                    </h2>
                </div>
                <button
                    onClick={onCreateArticle}
                    className="p-1.5 rounded-full bg-[#C5A880]/10 text-[#C5A880] hover:bg-[#C5A880]/20 transition-colors"
                    title="New Article"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto customScrollbar pr-2">
                {articles.map((article) => {
                    const isSelected = selectedArticleId === article.id;
                    return (
                        <div
                            key={article.id}
                            className={`group relative flex flex-col p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${isSelected
                                ? "bg-[#C5A880]/10 border-[#C5A880]/40 shadow-lg shadow-[#C5A880]/5"
                                : "bg-white/5 border-white/10 hover:border-white/20"
                                }`}
                            onClick={() => onSelectArticle(article.id)}
                        >
                            <div className="flex justify-between items-start gap-3">
                                <h3 className={`text-sm font-serif tracking-wide leading-snug transition-colors ${isSelected ? "text-[#C5A880]" : "text-[#F3F4F6]/80 group-hover:text-[#F3F4F6]"
                                    }`}>
                                    {article.title}
                                </h3>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm("Are you sure you want to delete this article?")) {
                                            onDeleteArticle(article.id);
                                        }
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                <span className="text-[9px] font-medium text-[#9CA3AF] uppercase tracking-wider">
                                    {getCategoryName(article.category_id)}
                                </span>
                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                <div className="flex items-center gap-1.5 text-[9px] text-[#9CA3AF]/60">
                                    <Calendar className="w-3 h-3" />
                                    <span>{article.publish_date}</span>
                                </div>
                            </div>

                            <div className={`mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[8px] font-bold tracking-widest uppercase ${getStatusStyles(article.status)}`}>
                                {getStatusIcon(article.status)}
                                <span>{article.status}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5">
                <p className="text-[9px] text-[#9CA3AF]/40 tracking-widest uppercase">
                    Total: {articles.length} Articles
                </p>
            </div>
        </div>
    );
};
