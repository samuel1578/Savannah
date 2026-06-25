import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { Header } from "../../components/Header";
import { MenuOverlay } from "../../components/MenuOverlay";
import { OurFarmsSection } from "../Homepage/sections/OurFarmsSection";
import { FooterBrandInviteSection } from "../Homepage/sections/FooterBrandInviteSection";
import { SignatureCollectionsSection } from "./SignatureCollectionsSection";
import { useAboutPageCms } from "../../hooks/useAboutPageCms";
import { useHomepageCms } from "../../hooks/useHomepageCms";
import { useGlobalSettings } from "../../hooks/useGlobalSettings";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import aboutHero from "../../assets/abouthero.jpg";
import aboutFarms from "../../assets/abtfrm.jpg";
import meshImage from "../../assets/mesh.png";
import storyWomanCooking from "../../assets/story-woman-cooking-portrait.jpg";
import storyMotherChild from "../../assets/story-mother-child-bowl.png";
import storyChildDoorway from "../../assets/story-child-doorway.jpg";
import storyGoldenSpice from "../../assets/heritage.jpg";
import storyManWorkshop from "../../assets/story-man-workshop-interior.jpeg";
import storyTeamTasting from "../../assets/story-team-tasting-labcoats.jpg";

const getFullImageUrl = (path: string) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith("/")) return `https://savannahdrinks.co.uk${path}`;
    return `https://savannahdrinks.co.uk/${path}`;
};

export const HeroSection = ({ data }: { data?: any }): JSX.Element => {
    const headline1 = data?.hero_title || "the savannah";
    const headline2 = ""; // Assuming title contains everything or we split it
    const description = data?.hero_subtitle || "Inspired by heritage, crafted with passion, and shared with the world.";

    // Resolve Hero Image from CMS
    const cmsHeroImageUrl = data?.hero_image_url || "";
    const cmsHeroImageAlt = data?.hero_image_alt || "About Savannah";
    const displayHeroImage = cmsHeroImageUrl ? getFullImageUrl(cmsHeroImageUrl) : aboutHero;

    return (
        <div className="relative w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden hero-section reveal-section">
            <img
                src={displayHeroImage}
                alt={cmsHeroImageAlt}
                className="absolute inset-0 w-full h-full object-cover reveal-image hero-bottle"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 text-center px-6">
                <h1 className="[font-family:'Cormorant_Unicase',Helvetica] text-[48px] sm:text-[72px] lg:text-[95px] font-light tracking-[-4px] text-white leading-none lowercase mb-4 hero-headline">
                    <span className="hero-headline-line block">{headline1}</span>
                    <span className="hero-headline-line block">{headline2}</span>
                </h1>
                <p className="[font-family:'Raleway',Helvetica] text-sm sm:text-base lg:text-lg text-white/90 max-w-[600px] mx-auto leading-relaxed hero-story-card">
                    {description}
                </p>
            </div>
        </div>
    );
};

export const OurStorySection = ({ timeline }: { timeline: any[] }): JSX.Element => {
    const sectionHeadingStyle: React.CSSProperties = {
        width: "100%",
        textAlign: "center",
        padding: "80px 0 60px",
        fontFamily: "'Cormorant Unicase'",
        fontSize: "clamp(48px, 5vw, 95px)",
        fontWeight: 300,
        letterSpacing: "-4px",
        lineHeight: 1,
        textTransform: "lowercase",
        color: "#242514",
    };

    const section2Style: React.CSSProperties = {
        position: "relative",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "80px 60px",
        boxSizing: "border-box",
    };

    // Map images to timeline entries based on index or key if needed
    const images = [storyWomanCooking, storyMotherChild, storyChildDoorway, storyGoldenSpice];

    return (
        <div className="relative w-full bg-white our-story-section">
            {/* Section heading "our story" */}
            <div style={sectionHeadingStyle}>
                our story
            </div>

            {/* Story section container (section2) */}
            <div className="section2" style={section2Style}>
                {timeline.map((row, index) => (
                    <div key={row.id} className={`relative flex flex-col ${index % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row"} items-center justify-between w-full mb-24 md:mb-32 story-row reveal-section`}>
                        {/* Image */}
                        <div className="w-full md:w-[45%] aspect-[4/3] md:aspect-auto md:h-[429px] overflow-hidden relative">
                            <img
                                src={row.image_url ? getFullImageUrl(row.image_url) : images[index % images.length]}
                                alt={row.image_alt || row.title}
                                className="w-full h-full object-cover reveal-image"
                            />
                        </div>

                        {/* Center: Spine Column */}
                        <div className="hidden md:flex relative flex-col items-center justify-center w-[120px] self-stretch">
                            <div className="absolute top-0 bottom-0 w-[1px] bg-[#cbcbcb]" />
                            <div
                                className="absolute w-[26.9px] h-[26.9px] bg-white border-[1.5px] border-[#cbcbcb] rotate-45 rounded-[25px]"
                                style={{ top: "50%", transform: "translateY(-50%) rotate(45deg)" }}
                            />
                            <div className="absolute h-[1px] bg-[#cbcbcb] w-[40px] left-0 top-1/2 -translate-y-1/2" />
                            <div className="absolute h-[1px] bg-[#cbcbcb] w-[40px] right-0 top-1/2 -translate-y-1/2" />
                        </div>

                        {/* Content */}
                        <div className={`w-full md:w-[45%] flex flex-col ${index % 2 !== 0 ? "items-start md:items-end text-left md:text-right" : "items-start"} mt-8 md:mt-0`}>
                            <div className="[font-family:'Cormorant_Unicase'] text-[28px] tracking-[-2px] leading-[25px] text-[#242514] mb-4">
                                {row.year_label}
                            </div>
                            <h3 className="[font-family:'Cormorant_Unicase'] text-[46px] font-light tracking-[-2px] leading-[36px] lowercase text-[#242514] mb-6">
                                {row.title}
                            </h3>
                            <p className="[font-family:'Raleway'] text-[16px] leading-[25px] text-[#242514]">
                                {row.story_content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const CraftsmanshipSection = ({ cards }: { cards: any[] }): JSX.Element => {
    const sublabel = "Craftsmanship & Process";
    const headline = "signature collections";

    // Map images to cards
    const images = [storyManWorkshop, meshImage, storyTeamTasting];

    return (
        <div className="relative w-full bg-[#fafafa] py-20 lg:py-32 craftsmanship-section reveal-section">
            <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-14">
                {/* Section Header */}
                <div className="text-center mb-16 lg:mb-24">
                    <span className="[font-family:'Raleway'] text-xs font-semibold tracking-[3px] text-[#242514]/40 uppercase block mb-3">
                        {sublabel}
                    </span>
                    <h2 className="[font-family:'Cormorant_Unicase'] text-[40px] sm:text-[56px] lg:text-[72px] font-light tracking-[-2px] leading-none text-[#242514] lowercase craftsmanship-headline">
                        {headline}
                    </h2>
                </div>

                <Swiper
                    modules={[Pagination]}
                    spaceBetween={32}
                    slidesPerView={1.1}
                    breakpoints={{
                        768: {
                            slidesPerView: 2.1,
                            spaceBetween: 40,
                        },
                        1024: {
                            slidesPerView: 2.08,
                            spaceBetween: 48,
                        },
                    }}
                    pagination={{ clickable: true }}
                    style={{ paddingBottom: "48px" }}
                >
                    {cards.map((card, i) => (
                        <SwiperSlide key={card.id}>
                            <div className="flex flex-col space-y-6 pb-2 craft-card">
                                <div className="aspect-[4/5] overflow-hidden relative">
                                    <img
                                        src={card.image_url ? getFullImageUrl(card.image_url) : images[i % images.length]}
                                        alt={card.image_alt || card.heading}
                                        className="w-full h-full object-cover reveal-image"
                                    />
                                </div>
                                <h3 className="[font-family:'Cormorant_Unicase'] text-3xl lg:text-4xl font-light tracking-[-1px] text-[#242514] lowercase">
                                    {card.heading}
                                </h3>
                                <p className="[font-family:'Raleway'] text-base lg:text-lg text-[#242514]/80 leading-relaxed">
                                    {card.body_content}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Swiper pagination dot styling */}
                <style>{`
                    .swiper-pagination-bullet {
                        background: #242514;
                        opacity: 0.25;
                        width: 6px;
                        height: 6px;
                    }
                    .swiper-pagination-bullet-active {
                        opacity: 1;
                        width: 20px;
                        border-radius: 3px;
                    }
                    .swiper-wrapper {
                        align-items: start;
                    }
                `}</style>
            </div>
        </div>
    );
};

export const AboutPage = (): JSX.Element => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("about");

    const {
        hero,
        storyTimeline,
        craftsmanshipCards,
        signatureCollections,
        loading: aboutLoading,
        error: aboutError
    } = useAboutPageCms();

    const { homepageSections, loading: homeLoading, error: homeError } = useHomepageCms();
    const { settings: globalSettings } = useGlobalSettings();

    const loading = aboutLoading || homeLoading;
    const error = aboutError || homeError;

    // Helpers to get section data
    const getHomeData = (key: string) => homepageSections.find(s => s.section_key === key);

    useEffect(() => {
        // Only initialize animations if not loading and no error
        if (loading || error) return;

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // Mobile Luxury Pass: Reduce intensity of translations and parallax by 50% on mobile
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        const reductionFactor = isMobile ? 0.5 : 1.0;

        // Initialize Lenis smooth scrolling
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            wheelMultiplier: 0.8, // subtle, premium feel
            touchMultiplier: 1.5,
        });

        // Sync Lenis scroll with GSAP ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        // GSAP ticker integration
        function update(time: number) {
            lenis.raf(time * 1000);
        }
        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);

        // Create a master context to manage cleanup cleanly
        const ctx = gsap.context(() => {
            // Header scroll transition: completely transparent at top, translucent on scroll
            const header = document.querySelector("header");
            if (header) {
                ScrollTrigger.create({
                    start: "top -15px",
                    onEnter: () => header.classList.add("header-scrolled"),
                    onLeaveBack: () => header.classList.remove("header-scrolled"),
                });
            }

            // Track active sections for the menu
            const sections = [
                { id: "about", selector: ".hero-section" },
                { id: "about", selector: ".our-story-section" },
                { id: "about", selector: ".collections-section" },
                { id: "about", selector: ".craftsmanship-section" },
            ];

            sections.forEach((sec) => {
                const el = document.querySelector(sec.selector);
                if (el) {
                    ScrollTrigger.create({
                        trigger: el,
                        start: "top 50%",
                        end: "bottom 50%",
                        onToggle: (self) => {
                            if (self.isActive) {
                                setActiveSection(sec.id);
                            }
                        }
                    });
                }
            });

            /* ==========================================
               CHAPTER 1: Every Bottle Tells A Story
               ========================================== */

            // A. About Hero: Sequential reveal (mirrors homepage heroTl)
            const aboutHeroTl = gsap.timeline({ delay: 0.3 });

            aboutHeroTl.fromTo(
                ".header-logo",
                { opacity: 0, y: -20 * reductionFactor },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            );

            aboutHeroTl.fromTo(
                ".hero-bottle",
                { opacity: 0, scale: prefersReducedMotion ? 1 : 1.08 },
                { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out", clearProps: "transform" },
                "-=0.4"
            );

            aboutHeroTl.fromTo(
                ".hero-headline-line",
                { opacity: 0, y: prefersReducedMotion ? 0 : 40 * reductionFactor },
                { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.2 },
                "-=0.8"
            );

            aboutHeroTl.fromTo(
                ".hero-story-card",
                { opacity: 0, y: prefersReducedMotion ? 0 : 30 * reductionFactor },
                { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
                "-=0.5"
            );

            // B. Hero image subtle scroll parallax
            if (!prefersReducedMotion) {
                gsap.to(".hero-bottle", {
                    y: 40 * reductionFactor,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".hero-section",
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                    },
                });
            }

            // C. Story rows: staggered mask reveal (mirrors heritage section)
            gsap.utils.toArray<HTMLElement>(".story-row").forEach((row) => {
                const img = row.querySelector("img");
                const content = row.querySelector(".flex.flex-col");

                const rowTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: row,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                });

                if (img) {
                    rowTl.fromTo(
                        img,
                        {
                            clipPath: prefersReducedMotion
                                ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
                                : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
                            scale: prefersReducedMotion ? 1 : 1.06,
                        },
                        {
                            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                            scale: 1,
                            duration: 1.4,
                            ease: "power3.inOut",
                        }
                    );
                }

                if (content) {
                    rowTl.fromTo(
                        content,
                        { opacity: 0, y: prefersReducedMotion ? 0 : 30 * reductionFactor },
                        { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
                        "-=0.9"
                    );
                }
            });

            // D. Craftsmanship headline reveal
            const craftSec = document.querySelector(".craftsmanship-section");
            if (craftSec) {
                gsap.fromTo(
                    ".craftsmanship-headline",
                    { opacity: 0, y: prefersReducedMotion ? 0 : 40 * reductionFactor },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: craftSec,
                            start: "top 80%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            }

            // E. Craft cards: staggered fade up
            gsap.utils.toArray<HTMLElement>(".craft-card").forEach((card, i) => {
                gsap.fromTo(
                    card,
                    { opacity: 0, y: prefersReducedMotion ? 0 : 50 * reductionFactor },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1.0,
                        ease: "power3.out",
                        delay: i * 0.15,
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });

            // F — OurFarmsSection parallax (mirrors homepage farm-banner)
            const aboutFarmBanner = document.querySelector(".farm-banner");
            if (aboutFarmBanner) {
                const farmImg = aboutFarmBanner.querySelector(".farm-image");
                const farmText = aboutFarmBanner.querySelector(".farm-text");

                if (farmImg) {
                    gsap.fromTo(
                        farmImg,
                        { yPercent: -8 },
                        {
                            yPercent: 8,
                            ease: "none",
                            scrollTrigger: {
                                trigger: aboutFarmBanner,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: true,
                            },
                        }
                    );
                }

                if (farmText) {
                    gsap.fromTo(
                        farmText,
                        { y: prefersReducedMotion ? 0 : 20 * reductionFactor },
                        {
                            y: prefersReducedMotion ? 0 : -20 * reductionFactor,
                            ease: "none",
                            scrollTrigger: {
                                trigger: aboutFarmBanner,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: true,
                            },
                        }
                    );
                }
            }

            // G — SignatureCollectionsSection reveal
            const collectionsSec = document.querySelector(".collections-section");
            if (collectionsSec) {
                const colLeft = collectionsSec.querySelector(".collections-left");
                const colRight = collectionsSec.querySelector(".collections-right");
                const colImage = collectionsSec.querySelector("img");

                const colTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: collectionsSec,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                });

                if (colLeft) {
                    colTl.fromTo(
                        colLeft,
                        { opacity: 0, x: prefersReducedMotion ? 0 : -40 * reductionFactor },
                        { opacity: 1, x: 0, duration: 1.1, ease: "power3.out" }
                    );
                }

                if (colRight) {
                    colTl.fromTo(
                        colRight,
                        { opacity: 0, x: prefersReducedMotion ? 0 : 40 * reductionFactor },
                        { opacity: 1, x: 0, duration: 1.1, ease: "power3.out" },
                        "-=0.9"
                    );
                }

                if (colImage) {
                    colTl.fromTo(
                        colImage,
                        {
                            clipPath: prefersReducedMotion
                                ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
                                : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
                            scale: prefersReducedMotion ? 1 : 1.04,
                        },
                        {
                            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                            scale: 1,
                            duration: 1.4,
                            ease: "power3.inOut",
                        },
                        "-=0.7"
                    );
                }
            }

            // H — Global chapter transitions (story → collections → farms → craftsmanship)
            const ourStorySec = document.querySelector(".our-story-section");
            const collSec = document.querySelector(".collections-section");
            const craftSec2 = document.querySelector(".craftsmanship-section");

            // Story exits as Collections enters
            if (ourStorySec && collSec) {
                gsap.to(ourStorySec, {
                    opacity: 0.5,
                    y: prefersReducedMotion ? 0 : -20 * reductionFactor,
                    ease: "none",
                    scrollTrigger: {
                        trigger: collSec,
                        start: "top bottom",
                        end: "top 40%",
                        scrub: true,
                    },
                });
            }

            // Collections exits as Craftsmanship enters
            if (collSec && craftSec2) {
                gsap.to(collSec, {
                    opacity: 0.5,
                    y: prefersReducedMotion ? 0 : -20 * reductionFactor,
                    ease: "none",
                    scrollTrigger: {
                        trigger: craftSec2,
                        start: "top bottom",
                        end: "top 40%",
                        scrub: true,
                    },
                });
            }

            // I — Footer choreography (identical to homepage)
            const footerSec = document.querySelector("footer");
            if (footerSec) {
                const logotype = footerSec.querySelector(".footer-logotype");
                const form = footerSec.querySelector(".footer-form");
                const navLinks = footerSec.querySelectorAll(".footer-nav-link");
                const copyright = footerSec.querySelector(".footer-copyright");

                gsap.set([logotype, form, navLinks, copyright], {
                    opacity: 0,
                    y: 15 * reductionFactor,
                });

                const footerTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: footerSec,
                        start: "top 95%",
                        toggleActions: "play none none none",
                    },
                });

                footerTl.fromTo(
                    logotype,
                    { opacity: 0, y: 20 * reductionFactor },
                    { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" }
                );
                footerTl.fromTo(
                    form,
                    { opacity: 0, y: 20 * reductionFactor },
                    { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
                    "-=0.7"
                );
                if (navLinks.length > 0) {
                    footerTl.fromTo(
                        navLinks,
                        { opacity: 0, y: 15 * reductionFactor },
                        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.15 },
                        "-=0.8"
                    );
                }
                footerTl.fromTo(
                    copyright,
                    { opacity: 0 },
                    { opacity: 1, duration: 1.0, ease: "power2.out" },
                    "-=0.5"
                );
            }

            // J — Global reveal fallback for any remaining .reveal-section elements
            gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((sec) => {
                if (
                    sec.classList.contains("hero-section") ||
                    sec.classList.contains("our-story-section") ||
                    sec.classList.contains("craftsmanship-section") ||
                    sec.classList.contains("collections-section") ||
                    sec.tagName.toLowerCase() === "footer"
                ) return;

                gsap.fromTo(
                    sec,
                    {
                        opacity: 0,
                        y: prefersReducedMotion ? 0 : 60 * reductionFactor,
                        filter: prefersReducedMotion ? "none" : "blur(6px)",
                    },
                    {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        duration: 1.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: sec,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });

            // Global image reveal fallback
            gsap.utils.toArray<HTMLElement>(".reveal-image").forEach((img) => {
                if (
                    img.classList.contains("hero-bottle") ||
                    img.classList.contains("farm-image")
                ) return;

                gsap.fromTo(
                    img,
                    { scale: prefersReducedMotion ? 1 : 1.06, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 1.2,
                        ease: "power2.out",
                        clearProps: "transform",
                        scrollTrigger: {
                            trigger: img,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });
        });

        // Cleanup
        return () => {
            ctx.revert();
            gsap.ticker.remove(update);
            lenis.destroy();
        };
    }, [loading, error]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#242514]"></div>
                    <p className="mt-4 [font-family:'Raleway',Helvetica] text-sm font-medium tracking-[2px] uppercase text-[#242514]">
                        Loading Savannah Story...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center">
                <div className="max-w-md">
                    <h2 className="[font-family:'Cormorant_Unicase',Helvetica] text-3xl text-[#242514]">
                        Something went wrong
                    </h2>
                    <p className="mt-4 [font-family:'Raleway',Helvetica] text-[#242514]/70">
                        {error}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 [font-family:'Raleway',Helvetica] text-sm font-semibold uppercase tracking-wider text-[#242514] underline"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="relative w-full bg-white flex flex-col">
            <Header onMenuOpen={() => setIsMenuOpen(true)} />

            <section className="w-full">
                <HeroSection data={hero} />
            </section>

            <section className="w-full">
                <OurStorySection timeline={storyTimeline} />
            </section>

            <section className="w-full">
                <SignatureCollectionsSection collections={signatureCollections} />
            </section>

            <section className="w-full">
                <div className="farm-banner w-full relative">
                    <OurFarmsSection
                        image={hero?.farms_image_url ? getFullImageUrl(hero.farms_image_url) : aboutFarms}
                        data={getHomeData("farms_banner")}
                    />
                </div>
            </section>

            <section className="w-full">
                <CraftsmanshipSection cards={craftsmanshipCards} />
            </section>

            <section className="w-full">
                <FooterBrandInviteSection data={getHomeData("footer_invite")} globalSettings={globalSettings} />
            </section>

            <MenuOverlay
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                activeSection={activeSection}
            />
        </main>
    );
};
