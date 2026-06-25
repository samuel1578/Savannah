import { useEffect, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { Header } from "../../components/Header";
import { MenuOverlay } from "../../components/MenuOverlay";
import { BrandStoryHeroSection } from "./sections/BrandStoryHeroSection";
import { MapOriginSection } from "./sections/MapOriginSection";
import { PalmFruitBannerSection } from "./sections/PalmFruitBannerSection";
import { HeritageExperienceSection } from "./sections/HeritageExperienceSection";
import { WatermakingProcessSection } from "./sections/WatermakingProcessSection";
import { OurFarmsSection } from "./sections/OurFarmsSection";
import { ReviewsSection } from "./sections/ReviewsSection";
import { CallToActionSection } from "./sections/CallToActionSection";
import { FooterBrandInviteSection } from "./sections/FooterBrandInviteSection";
import { useHomepageCms } from "../../hooks/useHomepageCms";
import { useGlobalSettings } from "../../hooks/useGlobalSettings";

export const Homepage = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { homepageSections, products, heritageStories, loading, error } = useHomepageCms();
  const { settings: globalSettings } = useGlobalSettings();

  // Helper to get section data by key
  const getSectionData = useMemo(() => (key: string) => {
    return homepageSections.find(s => s.section_key === key);
  }, [homepageSections]);

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
        { id: "home", selector: ".relative" },
        { id: "about", selector: ".heritage-section" },
        { id: "blog", selector: ".community-banner" },
        { id: "contact", selector: ".cta-section" },
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

      // 1.1 Hero Story: Sequential Reveal
      const heroTl = gsap.timeline({ delay: 0.2 });

      // Logo
      heroTl.fromTo(
        ".header-logo",
        { opacity: 0, y: -20 * reductionFactor },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      // Bottle (large hero image)
      heroTl.fromTo(
        ".hero-bottle",
        { opacity: 0, scale: prefersReducedMotion ? 1 : 1.08 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out", clearProps: "transform" },
        "-=0.4"
      );

      // Headline
      heroTl.fromTo(
        ".hero-headline-line",
        { opacity: 0, y: prefersReducedMotion ? 0 : 30 * reductionFactor },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.15 },
        "-=0.6"
      );

      // Story Card
      heroTl.fromTo(
        ".hero-story-card",
        { opacity: 0, y: prefersReducedMotion ? 0 : 40 * reductionFactor },
        { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
        "-=0.5"
      );

      // 1.2 Hero Story: Subtle Scroll-linked Depth
      if (!prefersReducedMotion) {
        gsap.to(".hero-bottle", {
          y: 35 * reductionFactor,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-bottle",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(".hero-headline", {
          y: -35 * reductionFactor,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-headline",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // 1.3 Product Storytelling: Reserve & Daily Subtle Rotation Reveals
      gsap.utils.toArray<HTMLElement>(".product-section-reserve, .product-section-daily").forEach((section) => {
        const title = section.querySelector(".product-title");
        const desc = section.querySelector(".product-description");
        const bottle = section.querySelector(".product-bottle");
        const specs = section.querySelector(".product-specs");

        const productTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        // Title
        productTl.fromTo(
          title,
          { opacity: 0, y: prefersReducedMotion ? 0 : 40 * reductionFactor },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
        );

        // Description
        productTl.fromTo(
          desc,
          { opacity: 0, y: prefersReducedMotion ? 0 : 30 * reductionFactor },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          "-=0.7"
        );

        // Subtle rotation depending on product type
        const isReserve = section.classList.contains("product-section-reserve");
        const startRotation = isReserve ? -11 : 9;
        const endRotation = isReserve ? -14 : 12;

        // Bottle settling into place with rotation
        productTl.fromTo(
          bottle,
          {
            scale: prefersReducedMotion ? 1 : 1.12,
            opacity: 0,
            y: prefersReducedMotion ? 0 : 40 * reductionFactor,
            rotation: prefersReducedMotion ? endRotation : startRotation
          },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            rotation: endRotation,
            duration: 1.2,
            ease: "power2.out",
            clearProps: "transform"
          },
          "-=0.7"
        );

        // Specs
        if (specs) {
          productTl.fromTo(
            specs.children,
            { opacity: 0, y: prefersReducedMotion ? 0 : 20 * reductionFactor },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.15 },
            "-=0.9"
          );
        }
      });

      // 1.4 Product Image Presence: Gentle floating depth
      if (!prefersReducedMotion) {
        gsap.utils.toArray<HTMLElement>(".product-bottle").forEach((bottle, i) => {
          gsap.to(bottle, {
            y: i % 2 === 0 ? -6 * reductionFactor : 6 * reductionFactor,
            duration: 4.5 + i * 0.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });
      }


      /* ==========================================
         CHAPTER 2: Born From Ghana
         ========================================== */

      // 2.1 Ghana Map Section: Scrubbed Timeline (Discovery Feel)
      const mapSec = document.querySelector(".map-section");
      if (mapSec) {
        const mapImg = mapSec.querySelector(".map-image");
        const mapMarkers = mapSec.querySelectorAll(".map-marker");
        const mapDesc = mapSec.querySelector(".map-description");
        const mapHeadline = mapSec.querySelector(".map-headline");

        const mapTl = gsap.timeline({
          scrollTrigger: {
            trigger: mapSec,
            start: "top 95%",
            end: "bottom 5%",
            scrub: true,
          },
        });

        // Map scales slightly upward
        mapTl.fromTo(
          mapImg,
          { scale: prefersReducedMotion ? 1 : 0.95, opacity: 0 },
          { scale: 1.05, opacity: 1, duration: 1 }
        );

        // Gold markers fade in sequentially
        if (mapMarkers.length > 0) {
          mapTl.fromTo(
            mapMarkers,
            { opacity: 0, scale: 0.5 },
            { opacity: 1, scale: 1, duration: 0.8, stagger: 0.3 },
            "-=0.5"
          );
        }

        // Supporting copy reveals
        mapTl.fromTo(
          mapDesc,
          { y: prefersReducedMotion ? 0 : 30 * reductionFactor, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=0.4"
        );

        // Luxury Hydration headline reveals last
        if (mapHeadline) {
          mapTl.fromTo(
            mapHeadline.children,
            { y: prefersReducedMotion ? 0 : 40 * reductionFactor, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.25 },
            "-=0.6"
          );
        }
      }

      // 2.2 Palm Fruit Banner Section: Scrubbed Scale (Cinematic Movement)
      const palmBanner = document.querySelector(".palm-fruit-banner");
      if (palmBanner) {
        const palmImg = palmBanner.querySelector(".reveal-image");
        gsap.fromTo(
          palmImg,
          { scale: prefersReducedMotion ? 1 : 1.15 },
          {
            scale: 1.0,
            ease: "none",
            scrollTrigger: {
              trigger: palmBanner,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // 2.3 Story Cards (HeritageExperienceSection): Mask Reveals
      const heritageSec = document.querySelector(".heritage-section");
      if (heritageSec) {
        const leftImg = heritageSec.querySelector(".heritage-story-image");
        const rightImg = heritageSec.querySelector(".luxury-story-image");

        const heritageTl = gsap.timeline({
          scrollTrigger: {
            trigger: heritageSec,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        // Left card mask reveal (clip-path horizontal)
        heritageTl.fromTo(
          leftImg,
          {
            clipPath: prefersReducedMotion ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
            opacity: prefersReducedMotion ? 0 : 1,
            scale: prefersReducedMotion ? 1 : 1.1
          },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: "power3.inOut"
          }
        );

        // Right card mask reveal staggered
        heritageTl.fromTo(
          rightImg,
          {
            clipPath: prefersReducedMotion ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
            opacity: prefersReducedMotion ? 0 : 1,
            scale: prefersReducedMotion ? 1 : 1.1
          },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: "power3.inOut"
          },
          "-=0.9" // elegant overlap
        );
      }


      /* ==========================================
         CHAPTER 3: Shared With The World
         ========================================== */

      // 3.1 Lifestyle Banner (WatermakingProcessSection): Horizontal Mask Reveal
      const lifestyleBanner = document.querySelector(".lifestyle-banner");
      if (lifestyleBanner) {
        const lifestyleImg = lifestyleBanner.querySelector(".lifestyle-image");

        gsap.fromTo(
          lifestyleImg,
          {
            clipPath: prefersReducedMotion ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
            opacity: prefersReducedMotion ? 0 : 1,
            scale: prefersReducedMotion ? 1 : 1.1
          },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            opacity: 1,
            scale: 1,
            duration: 1.6,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: lifestyleBanner,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 3.2 Farm Experience (OurFarmsSection): Subtle Layered Parallax
      const farmBanner = document.querySelector(".farm-banner");
      if (farmBanner) {
        const farmImg = farmBanner.querySelector(".farm-image");
        const farmText = farmBanner.querySelector(".farm-text");

        // Background movement: 70%
        gsap.fromTo(
          farmImg,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: farmBanner,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        // Foreground movement: 100%
        gsap.fromTo(
          farmText,
          { y: prefersReducedMotion ? 0 : 20 * reductionFactor },
          {
            y: prefersReducedMotion ? 0 : -20 * reductionFactor,
            ease: "none",
            scrollTrigger: {
              trigger: farmBanner,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // 3.3 Community Experience (ReviewsSection): Warm Reveal
      const communityBanner = document.querySelector(".community-banner");
      if (communityBanner) {
        const communityImg = communityBanner.querySelector(".community-image");

        gsap.fromTo(
          communityImg,
          { scale: prefersReducedMotion ? 1 : 1.04, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.8, // slow, emotional timing
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: communityBanner,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 3.4 CTA Section: Dedicated Narrative Conclusion Timeline
      const ctaSec = document.querySelector(".cta-section");
      if (ctaSec) {
        const ctaHeadline = ctaSec.querySelector(".cta-headline");
        const ctaButton = ctaSec.querySelector(".cta-button");

        const ctaTl = gsap.timeline({
          scrollTrigger: {
            trigger: ctaSec,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        // Headline reveals line by line / smoothly
        ctaTl.fromTo(
          ctaHeadline,
          { opacity: 0, y: prefersReducedMotion ? 0 : 40 * reductionFactor },
          { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
          "-=0.5"
        );

        // Button reveals last
        ctaTl.fromTo(
          ctaButton,
          { opacity: 0, y: prefersReducedMotion ? 0 : 20 * reductionFactor },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        );
      }

      // 3.5 Image Depth System (Subconscious Parallax)
      if (!prefersReducedMotion) {
        gsap.utils.toArray<HTMLElement>(".reveal-image").forEach((img) => {
          // Exclude elements that have specialized scroll timelines to prevent conflicts
          if (
            img.classList.contains("hero-bottle") ||
            img.classList.contains("farm-image") ||
            img.classList.contains("map-image") ||
            img.classList.contains("lifestyle-image") ||
            img.classList.contains("community-image") ||
            img.classList.contains("heritage-story-image") ||
            img.classList.contains("luxury-story-image")
          ) {
            return;
          }
          gsap.to(img, {
            yPercent: 4 * reductionFactor,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      }


      /* ==========================================
         GLOBAL CHAPTER TRANSITIONS (Visual Continuity)
         ========================================== */

      // T1: Products -> Ghana Map (Daily product exits elegantly as Map enters)
      const dailySec = document.querySelector(".product-section-daily");
      if (dailySec && mapSec) {
        gsap.to(dailySec, {
          opacity: 0.4,
          y: prefersReducedMotion ? 0 : -30 * reductionFactor,
          ease: "none",
          scrollTrigger: {
            trigger: mapSec,
            start: "top bottom",
            end: "top 30%",
            scrub: true,
          },
        });
      }

      // T2: Culture -> Lifestyle (Heritage section exits elegantly as Lifestyle enters)
      const lifestyleSec = document.querySelector(".lifestyle-banner");
      if (heritageSec && lifestyleSec) {
        gsap.to(heritageSec, {
          opacity: 0.4,
          y: prefersReducedMotion ? 0 : -30 * reductionFactor,
          ease: "none",
          scrollTrigger: {
            trigger: lifestyleSec,
            start: "top bottom",
            end: "top 30%",
            scrub: true,
          },
        });
      }


      /* ==========================================
         FOOTER CHOREOGRAPHY (Closure Moment)
         ========================================== */
      const footerSec = document.querySelector("footer");
      if (footerSec) {
        const logotype = footerSec.querySelector(".footer-logotype");
        const form = footerSec.querySelector(".footer-form");
        const navLinks = footerSec.querySelectorAll(".footer-nav-link");
        const copyright = footerSec.querySelector(".footer-copyright");

        // Dynamically set initial states in GSAP so that if JS fails, the footer is still visible!
        gsap.set([logotype, form, navLinks, copyright], { opacity: 0, y: 15 * reductionFactor });

        const footerTl = gsap.timeline({
          scrollTrigger: {
            trigger: footerSec,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        });

        // 1. Logotype follows
        footerTl.fromTo(
          logotype,
          { opacity: 0, y: 20 * reductionFactor },
          { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" }
        );

        // 2. Email form reveals
        footerTl.fromTo(
          form,
          { opacity: 0, y: 20 * reductionFactor },
          { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
          "-=0.7"
        );

        // 3. Navigation links stagger in
        if (navLinks.length > 0) {
          footerTl.fromTo(
            navLinks,
            { opacity: 0, y: 15 * reductionFactor },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.15 },
            "-=0.8"
          );
        }

        // 4. Copyright / Supporting info appears last
        footerTl.fromTo(
          copyright,
          { opacity: 0 },
          { opacity: 1, duration: 1.0, ease: "power2.out" },
          "-=0.5"
        );
      }


      /* ==========================================
         GLOBAL FALLBACKS (For Unmanaged Sections)
         ========================================== */

      // Global Section Reveal fallback
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((sec) => {
        // Skip sections that have specialized timelines
        if (
          sec.classList.contains("map-section") ||
          sec.classList.contains("palm-fruit-banner") ||
          sec.classList.contains("heritage-section") ||
          sec.classList.contains("lifestyle-banner") ||
          sec.classList.contains("farm-banner") ||
          sec.classList.contains("community-banner") ||
          sec.classList.contains("cta-section") ||
          sec.classList.contains("product-section-reserve") ||
          sec.classList.contains("product-section-daily") ||
          sec.tagName.toLowerCase() === "footer"
        ) {
          return;
        }

        gsap.fromTo(
          sec,
          {
            opacity: 0,
            y: prefersReducedMotion ? 0 : 80 * reductionFactor,
            filter: prefersReducedMotion ? "none" : "blur(8px)",
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

      // Global Image Reveal fallback
      gsap.utils.toArray<HTMLElement>(".reveal-image").forEach((img) => {
        // Skip images that have specialized timelines
        if (
          img.classList.contains("hero-bottle") ||
          img.classList.contains("product-bottle") ||
          img.classList.contains("map-image") ||
          img.classList.contains("heritage-story-image") ||
          img.classList.contains("luxury-story-image") ||
          img.classList.contains("lifestyle-image") ||
          img.classList.contains("farm-image") ||
          img.classList.contains("community-image")
        ) {
          return;
        }

        gsap.fromTo(
          img,
          { scale: prefersReducedMotion ? 1 : 1.08, opacity: 0 },
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
  }, [loading, error]); // Re-run when loading or error state changes

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-qi124qodeinteractivecomrangoon-green"></div>
          <p className="mt-4 [font-family:'Raleway',Helvetica] text-sm font-medium tracking-[2px] uppercase text-qi124qodeinteractivecomrangoon-green">
            Loading Savannah Experience...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center">
        <div className="max-w-md">
          <h2 className="[font-family:'Cormorant_Unicase',Helvetica] text-3xl text-qi124qodeinteractivecomrangoon-green">
            Something went wrong
          </h2>
          <p className="mt-4 [font-family:'Raleway',Helvetica] text-qi124qodeinteractivecomrangoon-green/70">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 [font-family:'Raleway',Helvetica] text-sm font-semibold uppercase tracking-wider text-qi124qodeinteractivecomrangoon-green underline"
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
        <BrandStoryHeroSection data={getSectionData("hero_story")} products={products} />
      </section>
      <section className="w-full">
        <MapOriginSection data={getSectionData("map_origin")} />
      </section>
      <section className="w-full">
        <PalmFruitBannerSection data={getSectionData("palm_selection")} />
      </section>
      <section className="w-full">
        <HeritageExperienceSection stories={heritageStories} />
      </section>
      <section className="w-full">
        <WatermakingProcessSection data={getSectionData("watermaking")} />
      </section>
      <section className="w-full">
        <OurFarmsSection data={getSectionData("farms_banner")} />
      </section>
      <section className="w-full">
        <ReviewsSection data={getSectionData("reviews_banner")} />
      </section>
      <section className="w-full">
        <CallToActionSection data={getSectionData("cta_section")} />
      </section>
      <section className="w-full">
        <FooterBrandInviteSection data={getSectionData("footer_invite")} globalSettings={globalSettings} />
      </section>
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} activeSection={activeSection} />
    </main>
  );
};
