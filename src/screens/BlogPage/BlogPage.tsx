import { useState } from "react";
import { Link } from "react-router-dom";

import { Header } from "../../components/Header";
import { MenuOverlay } from "../../components/MenuOverlay";
import { FooterBrandInviteSection } from "../Homepage/sections/FooterBrandInviteSection";
import heritageImage from "../../assets/heritagee.png";
import memoryImage from "../../assets/memory.jpg";

const posts = [
  {
    title: ["FROM PALM FRUIT", "TO LUXURY", "HYDRATION"],
    category: "Heritage Process",
    excerpt:
      "Discover how a deeply rooted Ghanaian palm fruit tradition inspired the creation of Savannah Water - transforming memory, culture, and craftsmanship into a refined modern hydration experience.",
    image: heritageImage,
    imageAlt: "Palm fruit heritage process for Savannah Water",
    href: "#palm-fruit-to-luxury-hydration",
  },
  {
    title: ["THE MEMORY", "BEHIND", "SAVANNAH", "WATER"],
    category: "Founder Story",
    excerpt:
      "From childhood journeys for water in Madina to building a globally inspired premium brand, discover the emotional story that shaped Savannah Water.",
    image: memoryImage,
    imageAlt: "Savannah Water founder story inspiration",
    href: "#the-memory-behind-savannah-water",
  },
];

export const BlogPage = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <div className="mx-auto grid max-w-[1320px] gap-16 lg:grid-cols-2 lg:gap-20">
          {posts.map((post, index) => (
            <article
              key={post.href}
              className={index === 1 ? "lg:pt-0" : ""}
            >
              <a href={post.href} className="group block">
                <div className="relative mb-9 aspect-[1.85/1] overflow-hidden bg-[#e5e3df]">
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                  />
                </div>

                <div className="max-w-[430px]">
                  <p className="mb-5 [font-family:'Raleway',Helvetica] text-sm font-medium leading-[16px] text-[#111]">
                    {post.category}
                  </p>

                  <h1 className="[font-family:'Cormorant_Unicase',Helvetica] text-[46px] font-light lowercase leading-[0.86] tracking-[-3px] text-[#242514] sm:text-[56px] lg:text-[64px]">
                    {post.title.map((line) => (
                      <span key={line} className="block">
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
              </a>
            </article>
          ))}
        </div>
      </section>

      <FooterBrandInviteSection />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} activeSection="blog" />
    </main>
  );
};
