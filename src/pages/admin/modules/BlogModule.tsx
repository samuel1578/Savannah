import React, { useState, useEffect } from "react";
import { BlogArticleList } from "./blog/BlogArticleList";
import { BlogArticleEditor } from "./blog/BlogArticleEditor";
import { useBlogCms } from "../../../hooks/useBlogCms";
import { BlogPost } from "../../../services/blogCmsService";
import { MediaPickerModal, MediaPickerSelection } from "../MediaPickerModal";
import { Loader2, AlertCircle } from "lucide-react";
import styles from "../Dashboard.module.css";

export const BlogModule: React.FC = () => {
    const {
        posts,
        categories,
        loading,
        error,
        createPost,
        updatePost,
        deletePost,
        refresh
    } = useBlogCms();

    const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

    // Auto-select first article when posts load
    useEffect(() => {
        if (posts.length > 0 && selectedArticleId === null) {
            setSelectedArticleId(posts[0].id);
        }
    }, [posts, selectedArticleId]);

    const selectedArticle = posts.find(a => a.id === selectedArticleId) || null;

    const handleSelectArticle = (id: number) => {
        setSelectedArticleId(id);
    };

    const handleCreateArticle = async () => {
        const newArticleData: Partial<BlogPost> = {
            slug: `new-article-${Date.now()}`,
            title: "New Article",
            category_id: categories.length > 0 ? categories[0].id : 1,
            excerpt: "",
            body_content: "",
            author: "Savannah Team",
            publish_date: new Date().toISOString().split('T')[0],
            status: "draft",
            seo_title: "",
            seo_description: ""
        };

        try {
            const response = await createPost(newArticleData);
            if (response.success && response.post) {
                setSelectedArticleId(response.post.id);
            }
        } catch (err) {
            console.error("Failed to create article:", err);
            alert("Failed to create new article. Please try again.");
        }
    };

    const handleDeleteArticle = async (id: number) => {
        try {
            const response = await deletePost(id);
            if (response.success) {
                if (selectedArticleId === id) {
                    const remainingPosts = posts.filter(p => p.id !== id);
                    setSelectedArticleId(remainingPosts.length > 0 ? remainingPosts[0].id : null);
                }
            }
        } catch (err) {
            console.error("Failed to delete article:", err);
            alert("Failed to delete article.");
        }
    };

    const handleSaveArticle = async (updatedArticle: BlogPost) => {
        try {
            await updatePost(updatedArticle.id, updatedArticle);
        } catch (err) {
            console.error("Failed to save article:", err);
            throw err;
        }
    };

    const handleMediaSelect = (selection: MediaPickerSelection) => {
        if (selectedArticle) {
            handleSaveArticle({
                ...selectedArticle,
                featured_image_id: selection.id,
                file_path: selection.asset.file_path, // For immediate preview
                alt_text: selection.asset.alt_text
            });
        }
    };

    if (loading && posts.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#070D0A]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin" />
                    <p className="text-[#C5A880] font-serif tracking-widest uppercase text-xs">Loading Blog Module...</p>
                </div>
            </div>
        );
    }

    if (error && posts.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#070D0A] p-6">
                <div className="max-w-md w-full bg-red-500/5 border border-red-500/20 rounded-3xl p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-serif text-red-400 mb-2">Connection Error</h3>
                    <p className="text-sm text-red-400/60 mb-6">{error}</p>
                    <button
                        onClick={() => refresh()}
                        className="px-6 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all text-xs font-bold uppercase tracking-wider border border-red-500/20"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex overflow-hidden">
            {/* Panel 2: Article List */}
            <div className={`bg-[#070D0A] border-r border-[#C5A880]/10 flex flex-col p-6 transition-all duration-500 overflow-y-auto customScrollbar ${styles.structurePanel}`}>
                <BlogArticleList
                    articles={posts}
                    selectedArticleId={selectedArticleId}
                    onSelectArticle={handleSelectArticle}
                    onCreateArticle={handleCreateArticle}
                    onDeleteArticle={handleDeleteArticle}
                    categories={categories}
                />
            </div>

            {/* Panel 3: Article Editor */}
            <main className={`flex-1 overflow-y-auto p-8 lg:p-12 flex flex-col gap-8 customScrollbar ${styles.editorArea}`}>
                <BlogArticleEditor
                    article={selectedArticle}
                    categories={categories}
                    onSave={handleSaveArticle}
                    onMediaPickerOpen={() => setIsMediaPickerOpen(true)}
                />
            </main>

            <MediaPickerModal
                isOpen={isMediaPickerOpen}
                onClose={() => setIsMediaPickerOpen(false)}
                onSelect={handleMediaSelect}
                selectedMediaId={selectedArticle?.featured_image_id}
                title="Select Featured Image"
                subtitle="Choose a featured image for your blog post."
            />
        </div>
    );
};
