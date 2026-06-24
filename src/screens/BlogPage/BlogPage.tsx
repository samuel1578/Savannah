import { useState } from "react";
import { Link } from "react-router-dom";

import { Header } from "../../components/Header";
import { MenuOverlay } from "../../components/MenuOverlay";
import { FooterBrandInviteSection } from "../Homepage/sections/FooterBrandInviteSection";
import { useBlogCms } from "../../hooks/useBlogCms";
import { getFullImageUrl } from "../../utils/urlHelpers";
import heritageImage from "../../assets/heritagee.png";
import memoryImage from "../../assets/memory.jpg";

export const BlogPage = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { posts, loading, error } = useBlogCms();

  // Filter only published posts for the public page
  const publishedPosts = posts.filter(post => post.status === "published");

  return (
    <main className="min-h-screen bg-white text-[#242514]">
      <Header onMenuOpen={() => setIsMenuOpen(true)} />

      <section className="bg-[#fafafa] px-6 pb-4 pt-[120px] sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1540px] items-center gap-3 [font-family:'Bellefair',Helvetica] text-xl leading-[26px] text-[#242514]">
          <Link to="/" className="hover:text-[#242514]/65">
            Home
          </Link>
          <span>/</span>
          <span>Blog</span>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#242514] border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-[1320px] text-center py-20">
            <p className="text-lg text-[#242514]/60">{error}</p>
          </div>
        ) : publishedPosts.length === 0 ? (
          <div className="mx-auto max-w-[1320px] text-center py-20">
            <p className="text-lg text-[#242514]/60">No stories published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="mx-auto grid max-w-[1320px] gap-16 lg:grid-cols-2 lg:gap-20">
            {publishedPosts.map((post, index) => {
              const displayImage = post.featured_image_url ? getFullImageUrl(post.featured_image_url) : (post.file_path ? getFullImageUrl(post.file_path) : (index === 0 ? heritageImage : memoryImage));
              const titleLines = post.title.split(" ");

              return (
                <article
                  key={post.id}
                  className={index % 2 === 1 ? "lg:pt-0" : ""}
                >
                  <Link to={`/blog/${post.slug}`} className="group block">
                    <div className="relative mb-9 aspect-[1.85/1] overflow-hidden bg-[#e5e3df]">
                      <img
                        src={displayImage}
                        alt={post.featured_image_alt || post.alt_text || post.title}
                        className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                      />
                    </div>

                    <div className="max-w-[430px]">
                      <p className="mb-5 [font-family:'Raleway',Helvetica] text-sm font-medium leading-[16px] text-[#111]">
                        {post.category_name || "Heritage"}
                      </p>

                      <h1 className="[font-family:'Cormorant_Unicase',Helvetica] text-[46px] font-light lowercase leading-[0.86] tracking-[-3px] text-[#242514] sm:text-[56px] lg:text-[64px]">
                        {titleLines.map((line, idx) => (
                          <span key={`${post.id}-line-${idx}`} className="block">
                            {line}
                          </span>
                        ))}
                      </h1>

                      <p className="mt-7 [font-family:'Raleway',Helvetica] text-sm leading-[25px] text-[#242514]/80 sm:text-base">
                        {post.excerpt}
                      </p>

                      <span className="luxury-link mt-6 inline-flex [font-family:'Bellefair',Helvetica] text-[23px] leading-[46px] text-[#242514]">
                        Read More
                        <span className="text-[#a8a7a7] arrow-line">--</span>
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <FooterBrandInviteSection />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} activeSection="blog" />
    </main>
  );
};
