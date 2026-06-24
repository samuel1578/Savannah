import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { MenuOverlay } from "../../components/MenuOverlay";
import { FooterBrandInviteSection } from "../Homepage/sections/FooterBrandInviteSection";
import { blogCmsService, BlogPost } from "../../services/blogCmsService";
import { getFullImageUrl } from "../../utils/urlHelpers";

export const BlogPostPage = (): JSX.Element => {
    const { slug } = useParams<{ slug: string }>();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                const response = await blogCmsService.getPost(slug);
                if (response.success) {
                    setPost(response.post);
                    // Set SEO metadata
                    if (response.post.seo_title) {
                        document.title = `${response.post.seo_title} | Savannah Water`;
                    } else {
                        document.title = `${response.post.title} | Savannah Water`;
                    }

                    const metaDesc = document.querySelector('meta[name="description"]');
                    if (metaDesc && response.post.seo_description) {
                        metaDesc.setAttribute("content", response.post.seo_description);
                    }
                } else {
                    setError(response.message || "Post not found.");
                }
            } catch (err) {
                console.error("Error fetching post:", err);
                setError("Failed to load the story. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <main className="min-h-screen bg-white text-[#242514]">
                <Header onMenuOpen={() => setIsMenuOpen(true)} />
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#242514] border-t-transparent"></div>
                </div>
                <FooterBrandInviteSection />
                <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} activeSection="blog" />
            </main>
        );
    }

    if (error || !post) {
        return (
            <main className="min-h-screen bg-white text-[#242514]">
                <Header onMenuOpen={() => setIsMenuOpen(true)} />
                <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
                    <h1 className="[font-family:'Cormorant_Unicase',Helvetica] text-4xl mb-4">Story Not Found</h1>
                    <p className="mb-8 text-[#242514]/60">{error || "The story you're looking for doesn't exist."}</p>
                    <Link to="/blog" className="luxury-link [font-family:'Bellefair',Helvetica] text-xl">
                        Back to Journal <span className="text-[#a8a7a7] arrow-line">--</span>
                    </Link>
                </div>
                <FooterBrandInviteSection />
                <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} activeSection="blog" />
            </main>
        );
    }

    const displayImage = post.featured_image_url ? getFullImageUrl(post.featured_image_url) : (post.file_path ? getFullImageUrl(post.file_path) : "");

    // Format the date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <main className="min-h-screen bg-white text-[#242514]">
            <Header onMenuOpen={() => setIsMenuOpen(true)} />

            {/* Hero Section with Featured Image */}
            <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden pt-[80px]">
                {displayImage ? (
                    <>
                        <img
                            src={displayImage}
                            alt={post.featured_image_alt || post.alt_text || post.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Dark overlay for text readability */}
                        <div className="absolute inset-0 bg-black/40" />
                    </>
                ) : (
                    // Fallback gradient if no image
                    <div className="w-full h-full bg-gradient-to-b from-[#242514] to-[#3a3b2a]" />
                )}

                {/* Hero Content Overlay */}
                <div className="absolute inset-0 flex items-end pb-16 px-6 sm:px-10 lg:px-16">
                    <div className="mx-auto w-full max-w-[1540px]">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-3 mb-4 [font-family:'Raleway',Helvetica] text-sm font-medium uppercase tracking-widest text-white/80">
                                <span>{post.category_name || "Journal"}</span>
                                <span className="text-white/30">—</span>
                                <span>{formatDate(post.publish_date)}</span>
                            </div>
                            <h1 className="[font-family:'Cormorant_Unicase',Helvetica] text-[40px] font-light leading-[1.1] text-white sm:text-[56px] lg:text-[72px] tracking-tight">
                                {post.title}
                            </h1>
                            {post.author && (
                                <p className="[font-family:'Raleway',Helvetica] text-white/60 text-sm mt-6 uppercase tracking-widest">
                                    By {post.author}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Breadcrumbs - Now below hero or integrated? Let's keep them but maybe styled differently */}
            <section className="bg-[#fafafa] px-6 py-4 sm:px-10 lg:px-16">
                <div className="mx-auto flex max-w-[1540px] items-center gap-3 [font-family:'Bellefair',Helvetica] text-base leading-[26px] text-[#242514]/60">
                    <Link to="/" className="hover:text-[#242514]">Home</Link>
                    <span>/</span>
                    <Link to="/blog" className="hover:text-[#242514]">Blog</Link>
                    <span>/</span>
                    <span className="truncate max-w-[200px] sm:max-w-none opacity-40">{post.title}</span>
                </div>
            </section>

            {/* Article Content */}
            <article className="px-6 py-16 sm:px-10 lg:px-16">
                <div className="mx-auto max-w-[900px]">
                    {/* Excerpt */}
                    {post.excerpt && (
                        <div className="mb-12 pb-12 border-b border-[#242514]/10">
                            <p className="[font-family:'Raleway',Helvetica] text-xl italic text-[#242514]/70 sm:text-2xl leading-relaxed">
                                {post.excerpt}
                            </p>
                        </div>
                    )}

                    {/* Article Body */}
                    <div
                        className="prose prose-lg mx-auto [font-family:'Raleway',Helvetica] leading-relaxed text-[#242514]/90 
            prose-headings:font-['Cormorant_Unicase'] prose-headings:font-light prose-headings:text-[#242514]
            prose-p:mb-8 prose-img:rounded-lg"
                        dangerouslySetInnerHTML={{ __html: post.body_content }}
                    />

                    <div className="mt-20 border-t border-[#242514]/10 pt-10 text-center">
                        <Link to="/blog" className="luxury-link [font-family:'Bellefair',Helvetica] text-2xl text-[#242514]">
                            Back to Journal <span className="text-[#a8a7a7] arrow-line">--</span>
                        </Link>
                    </div>
                </div>
            </article>

            <FooterBrandInviteSection />
            <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} activeSection="blog" />
        </main>
    );
};
