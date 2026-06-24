import React, { useState, useEffect, useCallback } from "react";
import { Save, Eye, ChevronDown, ChevronUp, ImageIcon, Loader2, Globe, User, Calendar, Link2, Trash2, Bold, Italic, List, ListOrdered, Heading1, Heading2, Underline as UnderlineIcon, Link as LinkIcon } from "lucide-react";
import { BlogPost, BlogCategory } from "../../../../services/blogCmsService";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

interface BlogArticleEditorProps {
    article: BlogPost | null;
    categories: BlogCategory[];
    onSave: (article: BlogPost) => Promise<void>;
    onMediaPickerOpen: () => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2 p-2 border-b border-white/10 bg-white/5">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-1.5 rounded hover:bg-white/10 transition-colors ${editor.isActive('bold') ? 'text-[#C5A880] bg-white/10' : 'text-[#9CA3AF]'}`}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded hover:bg-white/10 transition-colors ${editor.isActive('italic') ? 'text-[#C5A880] bg-white/10' : 'text-[#9CA3AF]'}`}
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-1.5 rounded hover:bg-white/10 transition-colors ${editor.isActive('underline') ? 'text-[#C5A880] bg-white/10' : 'text-[#9CA3AF]'}`}
                title="Underline"
            >
                <UnderlineIcon className="w-4 h-4" />
            </button>
            <button
                onClick={setLink}
                className={`p-1.5 rounded hover:bg-white/10 transition-colors ${editor.isActive('link') ? 'text-[#C5A880] bg-white/10' : 'text-[#9CA3AF]'}`}
                title="Link"
            >
                <LinkIcon className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-white/10 self-center mx-1" />
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-1.5 rounded hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'text-[#C5A880] bg-white/10' : 'text-[#9CA3AF]'}`}
                title="Heading 1"
            >
                <Heading1 className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-1.5 rounded hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'text-[#C5A880] bg-white/10' : 'text-[#9CA3AF]'}`}
                title="Heading 2"
            >
                <Heading2 className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-white/10 self-center mx-1" />
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded hover:bg-white/10 transition-colors ${editor.isActive('bulletList') ? 'text-[#C5A880] bg-white/10' : 'text-[#9CA3AF]'}`}
                title="Bullet List"
            >
                <List className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-1.5 rounded hover:bg-white/10 transition-colors ${editor.isActive('orderedList') ? 'text-[#C5A880] bg-white/10' : 'text-[#9CA3AF]'}`}
                title="Ordered List"
            >
                <ListOrdered className="w-4 h-4" />
            </button>
        </div>
    );
};

export const BlogArticleEditor: React.FC<BlogArticleEditorProps> = ({
    article,
    categories,
    onSave,
    onMediaPickerOpen
}) => {
    const [formData, setFormData] = useState<BlogPost | null>(null);
    const [isSeoOpen, setIsSeoOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content: '',
        onUpdate: ({ editor }) => {
            setFormData(prev => {
                if (!prev) return null;
                return { ...prev, body_content: editor.getHTML() };
            });
        },
    });

    useEffect(() => {
        setFormData(article);
        if (editor && article) {
            if (editor.getHTML() !== article.body_content) {
                editor.commands.setContent(article.body_content || '');
            }
        }
    }, [article, editor]);

    if (!formData) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-[#9CA3AF]/20">
                <Globe className="w-20 h-20 mb-6" />
                <p className="text-lg font-serif font-light tracking-widest uppercase">Select an article to edit</p>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            if (!prev) return null;
            const updated = { ...prev, [name]: value };

            // Auto-generate slug from title
            if (name === "title") {
                updated.slug = value
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/\s+/g, "-");
            }

            return updated;
        });
    };

    const handleSave = async () => {
        if (!formData) return;
        setIsSaving(true);
        try {
            await onSave(formData);
        } finally {
            setIsSaving(false);
        }
    };

    const getPreviewUrl = () => {
        if (!formData) return "";
        const baseUrl = window.location.origin;
        return `${baseUrl}/blog/${formData.slug}`;
    };

    const getFullImageUrl = (path: string | null | undefined) => {
        if (!path) return "";
        if (/^https?:\/\//i.test(path)) return path;
        if (path.startsWith("/")) return `https://savannahdrinks.co.uk${path}`;
        if (path.startsWith("uploads/")) return `https://savannahdrinks.co.uk/${path}`;
        return `https://savannahdrinks.co.uk/uploads/media/${path}`;
    };

    const handleClearImage = () => {
        setFormData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                featured_image_id: null,
                file_path: null,
                alt_text: null
            };
        });
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-white/10">
                <div>
                    <h2 className="text-3xl font-serif font-light text-[#F3F4F6]">
                        {article?.id ? "Edit Article" : "New Article"}
                    </h2>
                    <p className="text-sm text-[#9CA3AF] font-light mt-1">
                        Configure your blog post content and metadata.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.open(getPreviewUrl(), "_blank")}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#F3F4F6]/80 hover:text-[#F3F4F6] hover:bg-white/10 transition-all text-xs font-medium uppercase tracking-wider"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#D5B890] text-[#070D0A] transition-all text-xs font-bold uppercase tracking-wider disabled:opacity-50 shadow-lg shadow-[#C5A880]/10"
                    >
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        <span>Save Article</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Primary Info */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] rounded-xl px-4 py-3 text-sm text-[#F3F4F6] outline-none transition-all"
                            placeholder="Enter article title..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">Slug</label>
                        <div className="relative">
                            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] rounded-xl pl-10 pr-4 py-3 text-sm text-[#F3F4F6] outline-none transition-all"
                                placeholder="url-friendly-slug"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">Category</label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] rounded-xl px-4 py-3 text-sm text-[#F3F4F6] outline-none transition-all appearance-none"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id} className="bg-[#0B1510]">{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] rounded-xl px-4 py-3 text-sm text-[#F3F4F6] outline-none transition-all appearance-none"
                            >
                                <option value="draft" className="bg-[#0B1510]">Draft</option>
                                <option value="published" className="bg-[#0B1510]">Published</option>
                                <option value="scheduled" className="bg-[#0B1510]">Scheduled</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">Author</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] rounded-xl pl-10 pr-4 py-3 text-sm text-[#F3F4F6] outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">Publish Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
                                <input
                                    type="date"
                                    name="publish_date"
                                    value={formData.publish_date}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] rounded-xl pl-10 pr-4 py-3 text-sm text-[#F3F4F6] outline-none transition-all [color-scheme:dark]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Media & Excerpt */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">Featured Image</label>
                        <div className="relative group">
                            <div
                                onClick={onMediaPickerOpen}
                                className="aspect-video bg-white/5 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-3 group-hover:border-[#C5A880]/40 transition-all cursor-pointer overflow-hidden"
                            >
                                {formData.file_path ? (
                                    <img
                                        src={getFullImageUrl(formData.file_path)}
                                        alt={formData.alt_text || "Featured"}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                ) : (
                                    <>
                                        <div className="w-10 h-10 rounded-full bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880]">
                                            <ImageIcon className="w-5 h-5" />
                                        </div>
                                        <p className="text-xs text-[#9CA3AF] font-light uppercase tracking-widest">Select Featured Image</p>
                                    </>
                                )}
                            </div>
                            {formData.file_path && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClearImage();
                                    }}
                                    className="absolute top-3 right-3 p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-xl border border-red-500/20 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                                    title="Remove Image"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">Excerpt</label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] rounded-xl px-4 py-3 text-sm text-[#F3F4F6] outline-none transition-all resize-none leading-relaxed"
                            placeholder="Brief summary of the article..."
                        />
                    </div>
                </div>
            </div>

            {/* Full Width: Body Content (Rich Text Editor) */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">Body Content</label>
                <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden focus-within:border-[#C5A880] transition-all">
                    <MenuBar editor={editor} />
                    <EditorContent
                        editor={editor}
                        className="prose prose-invert max-w-none min-h-[400px] px-6 py-4 text-[#F3F4F6] outline-none font-light"
                    />
                </div>
                <style>{`
                    .ProseMirror {
                        outline: none;
                        min-height: 400px;
                    }
                    .ProseMirror p {
                        margin-bottom: 1.5rem;
                        line-height: 1.8;
                    }
                    .ProseMirror h1 {
                        font-size: 2rem;
                        font-family: serif;
                        margin-bottom: 1.5rem;
                        color: #F3F4F6;
                    }
                    .ProseMirror h2 {
                        font-size: 1.5rem;
                        font-family: serif;
                        margin-bottom: 1.25rem;
                        color: #F3F4F6;
                    }
                    .ProseMirror ul {
                        list-style-type: disc;
                        padding-left: 1.5rem;
                        margin-bottom: 1.5rem;
                    }
                    .ProseMirror ol {
                        list-style-type: decimal;
                        padding-left: 1.5rem;
                        margin-bottom: 1.5rem;
                    }
                    .ProseMirror a {
                        color: #C5A880;
                        text-decoration: underline;
                        cursor: pointer;
                    }
                `}</style>
            </div>

            {/* SEO Section (Collapsible) */}
            <div className="border border-white/10 rounded-2xl overflow-hidden">
                <button
                    onClick={() => setIsSeoOpen(!isSeoOpen)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-white/10 transition-all"
                >
                    <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-[#C5A880]" />
                        <span className="text-xs font-bold tracking-widest uppercase text-[#F3F4F6]">Search Engine Optimization</span>
                    </div>
                    {isSeoOpen ? <ChevronUp className="w-4 h-4 text-[#9CA3AF]" /> : <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />}
                </button>
                {isSeoOpen && (
                    <div className="p-6 space-y-6 bg-[#0B1510]/30 border-t border-white/10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#9CA3AF] tracking-[0.2em] uppercase">SEO Title</label>
                            <input
                                type="text"
                                name="seo_title"
                                value={formData.seo_title || ""}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] rounded-xl px-4 py-3 text-sm text-[#F3F4F6] outline-none transition-all"
                                placeholder="Custom meta title..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#9CA3AF] tracking-[0.2em] uppercase">SEO Description</label>
                            <textarea
                                name="seo_description"
                                value={formData.seo_description || ""}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] rounded-xl px-4 py-3 text-sm text-[#F3F4F6] outline-none transition-all resize-none"
                                placeholder="Custom meta description..."
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
