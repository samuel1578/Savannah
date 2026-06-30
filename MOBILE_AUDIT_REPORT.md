# MOBILE AUDIT REPORT

## Component Inventory

| Component | File Path | CMS Data Prop | DOM Structure | CSS Layout Classes |
|-----------|-----------|---------------|---------------|-------------------|
| **Header** | `src/components/Header.tsx` | None (UI State only) | Flexbox | `fixed top-0 left-0 w-full h-[85px] flex items-center justify-between px-6 sm:px-10 lg:px-14 z-50 transition-all duration-500` |
| **BrandStoryHeroSection** | `src/screens/Homepage/sections/BrandStoryHeroSection/BrandStoryHeroSection.tsx` | `data` (hero_story), `products` | Absolute/Flex/Grid | `relative w-full h-[680px] sm:h-[800px] xl:h-[1200px] overflow-hidden`, `hidden xl:block absolute inset-0`, `xl:hidden flex flex-col lg:flex-row`, `grid lg:grid-cols-[1fr_220px_1fr] gap-8` |
| **MapOriginSection** | `src/screens/Homepage/sections/MapOriginSection/MapOriginSection.tsx` | `data` (map_origin) | Grid | `relative w-full py-16 px-6 sm:px-10 lg:px-14`, `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_0.9fr] gap-12 items-center` |
| **PalmFruitBannerSection** | `src/screens/Homepage/sections/PalmFruitBannerSection/PalmFruitBannerSection.tsx` | `data` (palm_selection) | Absolute/Flex | `relative w-full h-[280px] sm:h-[350px] lg:h-[450px] overflow-hidden flex items-end`, `absolute inset-0 w-full h-full object-cover` |
| **HeritageExperienceSection** | `src/screens/Homepage/sections/HeritageExperienceSection/HeritageExperienceSection.tsx` | `stories` (heritageStories) | Grid | `relative w-full py-16 px-6 sm:px-10 lg:px-14`, `grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16` |
| **WatermakingProcessSection** | `src/screens/Homepage/sections/WatermakingProcessSection/WatermakingProcessSection.tsx` | `data` (watermaking) | Absolute/Flex | `group relative block w-full h-[280px] sm:h-[350px] lg:h-[450px] overflow-hidden flex items-end lifestyle-banner` |
| **OurFarmsSection** | `src/screens/Homepage/sections/OurFarmsSection/OurFarmsSection.tsx` | `data` (farms_banner) | Absolute/Flex | `group relative block w-full h-[280px] sm:h-[350px] lg:h-[450px] overflow-hidden flex items-end farm-banner` |
| **ReviewsSection** | `src/screens/Homepage/sections/ReviewsSection/ReviewsSection.tsx` | `data` (reviews_banner) | Absolute/Flex | `group relative block w-full h-[280px] sm:h-[350px] lg:h-[450px] overflow-hidden flex items-end community-banner` |
| **CallToActionSection** | `src/screens/Homepage/sections/CallToActionSection/CallToActionSection.tsx` | `data` (cta_section) | Flexbox | `relative w-full py-24 px-6 sm:px-10 lg:px-14 text-center`, `mx-auto flex flex-col items-center justify-center` |
| **FooterBrandInviteSection** | `src/screens/Homepage/sections/FooterBrandInviteSection/FooterBrandInviteSection.tsx` | `data` (footer_invite), `globalSettings` | Flexbox | `relative w-full py-20 px-6 sm:px-10 lg:px-14`, `mx-auto flex flex-col items-center justify-center max-w-[793px] text-center` |
| **MenuOverlay** | `src/components/MenuOverlay.tsx` | None (UI State only) | Fixed/Flex | `fixed inset-0 w-full h-screen z-[100] flex items-center justify-center p-6 sm:p-10 lg:p-16 overflow-y-auto`, `flex flex-col lg:flex-row justify-between items-center` |

## Current Responsive Coverage

| File | Line | Breakpoint | What it changes |
|------|------|------------|-----------------|
| `src/components/Header.tsx` | 21 | `sm:`, `lg:` | Padding: `px-6` -> `sm:px-10` -> `lg:px-14` |
| `src/components/Header.tsx` | 27 | `sm:`, `lg:` | Logo height: `h-14` -> `sm:h-16` -> `lg:h-[70px]` |
| `src/components/Header.tsx` | 42 | `sm:`, `lg:` | Hamburger width: `w-8` -> `sm:w-10` -> `lg:w-12` |
| `BrandStoryHeroSection.tsx` | 104 | `sm:`, `xl:` | Container height: `h-[680px]` -> `sm:h-[800px]` -> `xl:h-[1200px]` |
| `BrandStoryHeroSection.tsx` | 114 | `xl:` | Desktop layout visibility (`hidden` -> `xl:block`) |
| `BrandStoryHeroSection.tsx` | 116 | `1280px-1800px` | Media Query: Position/width adjustments for hero elements |
| `BrandStoryHeroSection.tsx` | 159 | `xl:`, `lg:` | Mobile layout visibility and flex direction |
| `BrandStoryHeroSection.tsx` | 173 | `sm:`, `lg:` | Headline text size: `text-[64px]` to `lg:text-[95px]` |
| `BrandStoryHeroSection.tsx` | 212 | `lg:` | Product grid: `grid-cols-1` -> `lg:grid-cols-[1fr_220px_1fr]` |
| `BrandStoryHeroSection.tsx` | 215 | `sm:`, `lg:`, `xl:` | Product title size: `text-[54px]` to `xl:text-[140px]` |
| `MapOriginSection.tsx` | 44 | `md:`, `lg:` | Grid layout: 1 col -> `md:2 col` -> `lg:3 col` |
| `MapOriginSection.tsx` | 79 | `sm:`, `lg:` | Headline text size: `text-[40px]` to `lg:text-[56px]` |
| `PalmFruitBannerSection.tsx` | 30 | `sm:`, `lg:` | Container height: `h-[280px]` to `lg:h-[450px]` |
| `HeritageExperienceSection.tsx` | 35 | `md:`, `lg:` | Grid layout: 1 col -> `md:2 col`, Gap: `gap-12` to `lg:gap-16` |
| `WatermakingProcessSection.tsx` | 34 | `sm:`, `lg:` | Container height: `h-[280px]` to `lg:h-[450px]` |
| `FooterBrandInviteSection.tsx` | 50 | `sm:`, `lg:` | Logo width: `w-[280px]` to `lg:w-[420px]` |
| `FooterBrandInviteSection.tsx` | 80 | `sm:`, `lg:` | Nav gap: `gap-12` -> `sm:gap-16` -> `lg:gap-24` |
| `MenuOverlay.tsx` | 42 | `sm:`, `lg:`, `xl:` | Nav font size: `text-[56px]` to `xl:text-[112px]` |
| `MenuOverlay.tsx` | 76 | `lg:` | Content alignment: `items-center` -> `lg:items-end` |
| `AboutPage.tsx` | 42 | `sm:`, `lg:` | Hero min-height and font sizes |
| `AboutPage.tsx` | 92 | `md:` | Story row direction: `flex-col` -> `md:flex-row` |
| `AboutPage.tsx` | 154 | `768`, `1024` | Swiper slides per view (1.1 -> 2.1 -> 2.08) |
| `AboutPage.tsx` | 224 | `768px` | JS Check: `isMobile` to reduce GSAP animation intensity |
| `SignatureCollectionsSection.tsx` | 89 | `768px` | Media Query: Grid template and padding adjustment |
| `SignatureCollectionsSection.tsx` | 23 | `clamp()` | Fluid typography for headline |

| `SignatureCollectionsSection.tsx` | 23 | `clamp()` | Fluid typography for headline |

| `SignatureCollectionsSection.tsx` | 23 | `clamp()` | Fluid typography for headline |

## Dependency Compatibility

The following table summarizes the core dependencies and their compatibility status for mobile optimizations (specifically for implementing carousels/sliders).

### 1. Core Stack Versions
| Dependency | Version | Status | Notes |
| :--- | :--- | :--- | :--- |
| **React** | `^18.2.0` | **Compatible** | Supports concurrent rendering and modern hook patterns. |
| **Tailwind CSS** | `3.4.16` | **Compatible** | Supports all required responsive utilities and arbitrary values. |
| **GSAP** | `^3.15.0` | **Compatible** | Used for all cinematic reveals and parallax effects. |
| **Lenis** | `^1.3.23` | **Compatible** | Handles smooth scrolling; requires careful touch event coordination. |
| **Swiper** | `^12.2.0` | **Active** | Already implemented and tested in `AboutPage.tsx`. |

### 2. Integration Research & Conflict Analysis

#### **Lenis + Swiper (Touch Coordination)**
*   **Risk:** Lenis intercepts `touchmove` events to normalize scrolling. On mobile, this can occasionally conflict with Swiper's horizontal dragging.
*   **Findings:** The current implementation in `AboutPage.tsx` uses Lenis 1.x without `preventTouch: true`. This allows Swiper to function correctly.
*   **Mitigation:** Ensure the Swiper container has the CSS property `touch-action: pan-y` (automatically added by Swiper in most cases). This explicitly tells the browser to allow vertical scrolling (Lenis) while letting the slider handle horizontal gestures.

#### **GSAP ScrollTrigger + Swiper**
*   **Risk:** `ScrollTrigger` calculates positions based on the DOM's scroll offset. If a Swiper slide contains a trigger, swiping horizontally doesn't change the vertical scroll position, but might change the element's visibility.
*   **Findings:** In `AboutPage.tsx`, GSAP reveals are triggered by the `.craft-card` entering the viewport vertically. This is safe for initial reveals.
*   **Recommendation:** Avoid using `ScrollTrigger` to track individual slides *during* a swipe unless `watchSlidesProgress` is enabled in Swiper and synced manually.

### 3. Recommended Slider Approach

Given the existing codebase and dependencies, the following hierarchy is recommended for mobile optimizations:

1.  **Primary Choice: Swiper.js (React Version)**
    *   **Why:** Already present in `package.json` and successfully integrated in `AboutPage.tsx`. It handles complex touch requirements, pagination, and breakpoints out-of-the-box.
    *   **Best For:** Product grids, Heritage stories, and any multi-card layout on mobile.
2.  **Secondary Choice: Embla Carousel**
    *   **Why:** Lighter than Swiper.
    *   **When to use:** Only if Swiper's bundle size becomes a critical issue (unlikely given the current luxury-heavy asset load).
3.  **Avoid: Custom GSAP Sliders**
    *   **Why:** High development overhead and prone to "reinventing the wheel" for basic touch/drag physics.
    *   **When to use:** Only for highly bespoke, non-linear cinematic transitions that must be frame-synced with ScrollTrigger.

### 4. Implementation Guidelines for Mobile
*   **Cleanup:** Always wrap GSAP and Lenis initialization in `gsap.context()` within a `useEffect` hook to ensure proper cleanup and prevent memory leaks/double-initialization in React.
*   **Reduced Motion:** Continue using the `prefers-reduced-motion` check and `reductionFactor` (0.5 for mobile) as seen in `AboutPage.tsx` to maintain performance on lower-end devices.
*   **Touch Action:** Explicitly set `touch-action: pan-y` on Swiper containers if vertical page scrolling feels "sticky" while swiping.

## Animation Selector Dependencies

This section documents all CSS selectors targeted by GSAP timelines and ScrollTriggers within `src/screens/Homepage/Homepage.tsx`. These dependencies are critical to maintain when restructuring the DOM for mobile optimizations (e.g., implementing Swiper.js).

### 1. Global & Structural Selectors
| Selector | Animation Driven | Referenced By | Risk Level | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `header` | Sticky background transition (`header-scrolled`) | Tag Name | Low | Standard tag; low risk unless replaced by a custom div. |
| `.relative` | Section tracking (Home) | Class Name | Medium | Root container class; risk if root layout changes. |
| `footer` | Footer reveal choreography trigger | Tag Name | Low | Standard tag; used as ScrollTrigger trigger. |
| `.reveal-section` | Global Section Reveal fallback (opacity, y, blur) | Class Name | **High** | Generic class used for unmanaged sections. |
| `.reveal-image` | Global Parallax & Reveal fallback | Class Name | **High** | Generic class used across multiple sections. |

### 2. Chapter 1: Hero & Products
| Selector | Animation Driven | Referenced By | Risk Level | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `.header-logo` | Hero reveal (opacity, y) | Class Name | Medium | Located in `Header` component. |
| `.hero-bottle` | Hero reveal (scale) & Scroll Parallax (y) | Class Name | **High** | Essential for luxury "depth" feel; fragile if container changes. |
| `.hero-headline` | Scroll Parallax (y) | Class Name | **High** | Parent of headline lines; controls vertical drift. |
| `.hero-headline-line` | Hero reveal (staggered opacity/y) | Class Name | **High** | Multiple spans; restructuring text breaks the stagger. |
| `.hero-story-card` | Hero reveal (opacity, y) | Class Name | **High** | Targets portrait, text, title, and tag elements in Hero. |
| `.product-section-reserve` | Product reveal trigger & T1 Transition | Class Name | **High** | **CRITICAL:** If products become a slider, this trigger may fail. |
| `.product-section-daily` | Product reveal trigger & T1 Transition | Class Name | **High** | **CRITICAL:** Used for both entry reveal and exit transition. |
| `.product-title` | Product reveal (opacity, y) | Class (Scoped) | **High** | Scoped to product section; breaks if moved outside. |
| `.product-description` | Product reveal (opacity, y) | Class (Scoped) | **High** | Scoped to product section. |
| `.product-bottle` | Reveal & Floating animation | Class (Scoped) | **High** | Scoped for reveal; Global for floating. Risk if wrapped in slider. |
| `.product-specs` | Staggered specs reveal | Class (Scoped) | **High** | Targets children of `.product-specs`. |

### 3. Chapter 2: Ghana Map & Heritage
| Selector | Animation Driven | Referenced By | Risk Level | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `.map-section` | Ghana Map scrubbed timeline trigger | Class Name | **High** | Main trigger for the entire map sequence. |
| `.map-image` | Map scale/opacity (Scrub) | Class (Scoped) | **High** | Fragile scrubbed animation. |
| `.map-marker` | Markers staggered reveal (Scrub) | Class (Scoped) | **High** | Targets multiple marker elements. |
| `.map-description` | Copy reveal (Scrub) | Class (Scoped) | **High** | Part of map sequence. |
| `.map-headline` | Headline staggered reveal (Scrub) | Class (Scoped) | **High** | Targets children of headline. |
| `.palm-fruit-banner` | Banner scrubbed scale trigger | Class Name | **High** | Tied to `.reveal-image` inside. |
| `.heritage-section` | Section tracking & Mask reveal trigger | Class Name | **High** | **CRITICAL:** If converted to Swiper, the mask reveal logic breaks. |
| `.heritage-story-image` | Left card mask reveal (clip-path) | Class (Scoped) | **High** | Complex clip-path animation; very fragile. |
| `.luxury-story-image` | Right card mask reveal (clip-path) | Class (Scoped) | **High** | Staggered with left image. |

### 4. Chapter 3: Process, Farms & Reviews
| Selector | Animation Driven | Referenced By | Risk Level | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `.lifestyle-banner` | Lifestyle reveal trigger | Class Name | **High** | Tied to T2 Transition (Heritage exit). |
| `.lifestyle-image` | Horizontal mask reveal (clip-path) | Class (Scoped) | **High** | Complex clip-path; fragile. |
| `.farm-banner` | Farm Parallax trigger | Class Name | **High** | Controls background/foreground parallax. |
| `.farm-image` | Background parallax (yPercent) | Class (Scoped) | **High** | Deep parallax effect. |
| `.farm-text` | Foreground parallax (y) | Class (Scoped) | **High** | Counter-movement to image. |
| `.community-banner` | Section tracking & Warm reveal trigger | Class Name | **High** | Emotional reveal timing. |
| `.community-image` | Warm reveal (scale, opacity) | Class (Scoped) | **High** | Long duration (1.8s) reveal. |
| `.cta-section` | Section tracking & Narrative conclusion trigger | Class Name | **High** | Triggers the final sequence. |
| `.cta-headline` | Headline reveal (opacity, y) | Class (Scoped) | **High** | Conclusion reveal. |
| `.cta-button` | Button reveal (opacity, y) | Class (Scoped) | **High** | Final interaction point. |

### 5. Footer & Navigation
| Selector | Animation Driven | Referenced By | Risk Level | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `.footer-logotype` | Footer reveal (opacity, y) | Class (Scoped) | **High** | Part of footer choreography. |
| `.footer-form` | Footer reveal (opacity, y) | Class (Scoped) | **High** | Part of footer choreography. |
| `.footer-nav-link` | Staggered reveal (opacity, y) | Class (Scoped) | **High** | Targets multiple links. |
| `.footer-copyright` | Fade in | Class (Scoped) | Medium | Final closure moment. |

### Summary of Risks for Mobile Restructuring
- **Class-Name Only References:** 95% of animations rely on class names. Any restructuring that removes these classes or moves elements outside of their scoped parent (e.g., `section.querySelector`) will immediately break the associated animation.
- **Swiper.js Conflict:** Converting `.heritage-section` or `.product-section-*` to a Swiper component is high-risk. GSAP's `ScrollTrigger` and Swiper's internal transforms often conflict. Mask reveals (`clip-path`) are particularly sensitive to container changes.
- **Trigger Fragility:** Many animations are triggered by the section entering the viewport. If sections are collapsed or hidden on mobile, these triggers must be updated to avoid "ghost" animations running in the background.

## CMS Data Shape

### 1. Homepage Sections (`homepageSections`)
The `useHomepageCms` hook returns a `homepageSections` object where each key corresponds to a `section_key`. Each section contains a `fields` object with key-value pairs.

| Section Key | Field Key | Type | Purpose |
| :--- | :--- | :--- | :--- |
| **hero_story** | `hero_headline_line_1` | String | Main title first line |
| | `hero_headline_line_2` | String | Main title second line |
| | `hero_image_id` | Number | Main bottle image ID (resolves to `_url`) |
| | `hero_story_card_image_id` | Number | Inspiration card image ID (resolves to `_url`) |
| **map_origin** | `map_headline` | String | Map section title |
| | `map_description` | String | Narrative text |
| | `map_image_id` | Number | Ghana map image ID (resolves to `_url`) |
| **palm_selection** | `palm_headline` | String | Banner title |
| | `palm_image_id` | Number | Background image ID (resolves to `_url`) |
| **watermaking** | `watermaking_headline` | String | Banner title |
| | `watermaking_image_id` | Number | Background image ID (resolves to `_url`) |
| **farms_banner** | `farms_headline` | String | Banner title |
| | `farms_image_id` | Number | Background image ID (resolves to `_url`) |
| **reviews_banner** | `reviews_headline` | String | Banner title |
| | `reviews_image_id` | Number | Background image ID (resolves to `_url`) |
| **cta_section** | `cta_headline` | String | Call to action title |
| | `cta_button_text` | String | Button label |
| **footer_invite** | `footer_headline` | String | Footer title |
| | `footer_logo_id` | Number | Brand logo ID (resolves to `_url`) |

### 2. Products Data
The `products` array contains objects with the following shape:
*   `product_key`: String (e.g., "daily", "reserve")
*   `title`: String
*   `description`: String
*   `specifications`: Array of strings
*   `image_id`: Number (resolves to `file_path`)

**Cardinality Constraint:** The `BrandStoryHeroSection` currently expects exactly **2 products**. It uses hardcoded rotation logic (`rotate-[-10deg]` vs `rotate-[10deg]`) and explicit indexing.

### 3. Heritage Stories Data
The `heritageStories` array contains objects with the following shape:
*   `category_tag`: String (e.g., "TRADITION")
*   `title`: String
*   `description`: String
*   `link_text`: String
*   `link_url`: String
*   `image_id`: Number (resolves to `file_path`)

**Cardinality Constraint:** The `HeritageExperienceSection` currently renders only the first **2 stories** in a side-by-side grid.

### 4. Global Settings
*   `company_name`: String
*   `copyright_text`: String
*   `contact_email`: String
*   `social_links`: JSON string (parsed into object)

## Image Asset Audit

This audit examines the image rendering strategy across the Savannah homepage sections, focusing on source management, aspect ratio stability, and mobile responsiveness.

### 1. Hero & Product Discovery (BrandStoryHeroSection)

| Image Asset | Source | Crop Behavior | Dimensions | Mobile Risk |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Bottle** | CMS (`hero_image_url`) | `object-cover` | **Desktop:** `w-[38%] h-full` (1200px)<br>**Mobile:** `w-full h-[400px]` | **High.** `object-cover` on fixed height (400px) will crop the bottle if the uploaded aspect ratio differs from the container. Off-center subjects may be cut off. |
| **Inspiration Card** | CMS (`hero_story_card_image_url`) | `bg-cover bg-top` | **Desktop:** `w-[23%] h-[480px]`<br>**Mobile:** `200px x 260px` | **High.** Fixed aspect ratio container with `bg-cover` forces cropping. Landscape uploads will lose significant side detail. |
| **Product Bottles** | CMS (`file_path`) | `object-contain` | **Fluid:** `h-[240px]` to `h-[420px]` (breakpoints), `w-auto` | **Low.** `object-contain` preserves the product bottle's integrity regardless of upload aspect ratio. |

### 2. Narrative & Background Sections

| Image Asset | Source | Crop Behavior | Dimensions | Mobile Risk |
| :--- | :--- | :--- | :--- | :--- |
| **Ghana Map** | CMS (`map_image_url`) | `object-contain` | `w-full h-auto` (max-h: 350px) | **Low.** Safe rendering for varied map silhouettes. |
| **Section Banners*** | CMS-driven URL fields | `object-cover` | **Mobile:** `h-[280px]`<br>**Desktop:** `h-[450px]` | **Low.** Used as atmospheric backgrounds (Palm Selection, Watermaking, Farms, Reviews). |
| **Heritage Stories** | **Static Asset Only** | `object-cover` | `aspect-[4/3]` container | **Medium.** Currently ignores CMS `file_path`. Rigid 4:3 ratio will force cropping if later connected to CMS. |

*\*Includes: PalmFruitBanner, WatermakingProcess, OurFarms, ReviewsSection.*

### 3. Global Brand Assets

| Image Asset | Source | Crop Behavior | Dimensions | Mobile Risk |
| :--- | :--- | :--- | :--- | :--- |
| **Header Logo** | **Static Asset** | `object-contain` | `h-14` to `h-[70px]` | **None.** |
| **Footer Logo** | CMS-driven | `object-contain` | `w-[280px]` to `w-[420px]` | **Low.** Safe for varied logo aspect ratios. |
| **Menu Logo** | **Static Asset** | `object-contain` | `w-[220px]` to `w-[380px]` | **None.** |

### Key Findings & Recommendations

1.  **Inconsistent CMS Integration:** The `HeritageExperienceSection` receives CMS story data but hardcodes the images to static assets (`heritage.jpg`, `fixeda.jpg`). This prevents the admin from updating these key visual components.
2.  **Mobile Crop Fragility:** The "Inspiration Card" and "Hero Bottle" use fixed-height containers with `cover` strategies. A "Safe Zone" guideline should be provided to admins (e.g., "Keep subjects centered within a 4:5 area") to prevent heads or bottle caps from being cropped on mobile.
3.  **Logo Inconsistency:** The Footer logo is CMS-driven while the Header/Menu logos are static. This could lead to brand misalignment if the admin updates one but not the others.
4.  **Rigid Aspect Ratios:** The `aspect-[4/3]` used in the Heritage section is safe for current static assets but will require `object-contain` or a more flexible container if varied CMS uploads are expected in the future.

## Typography & Tokens

### 1. Core Font Families
*   **Headlines**: `Cormorant Unicase`, `Helvetica`, `sans-serif`
    *   *Usage*: Cinematic titles, product names, section labels.
    *   *Characteristics*: Light weights (300-400), tight tracking (-4px to -2px), and low line-heights.
*   **Body & UI**: `Raleway`, `Helvetica`, `sans-serif`
    *   *Usage*: Descriptions, navigation, chapter markers, form fields.
    *   *Characteristics*: Regular to Semi-bold weights, generous tracking for uppercase labels.
*   **Secondary Serif**: `Bellefair`, `Helvetica`, `sans-serif`
    *   *Usage*: Specific semantic links and input titles.

### 2. Color Tokens (Tailwind & CSS Variables)
The following tokens are defined in `tailwind.config.js` and mapped to CSS variables in `tailwind.css`:

| Token Name | Hex/Value | Primary Usage |
| :--- | :--- | :--- |
| `qi124qodeinteractivecomrangoon-green` | `#242514` | Primary text, titles, dark accents |
| `qi-12-4qodeinteractivecomalabaster` | `#fafafa` | Main page background |
| `qi124qodeinteractivecomouter-space` | `#1a211f` | Footer background |
| `qi124qodeinteractivecomsilver-chalice` | `#a8a7a7` | Muted text, borders, category tags |
| `qi124qodeinteractivecomcod-gray` | `#111111` | Deep dark accents |
| `qi-12-4qodeinteractivecomwhite` | `#ffffff` | Section backgrounds, light text |
| `qi-12-4qodeinteractivecomrangitoto` | `#28291b` | Secondary dark tone |

### 3. Typography Scales & Implementation Detail

| Component / Usage | Font Family | Size Implementation | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Main Headline** | Cormorant | `clamp(80px, 7.3vw, 140px)` (Fluid) | `0.85` | `-4px` |
| **Hero Headline (Mobile)** | Cormorant | `64px` → `80px` (sm) → `95px` (lg) | `0.85` | `-4px` |
| **Product Titles** | Cormorant | `54px` (base) → `140px` (xl) | `0.82` | `-4px` |
| **Inspiration Title** | Cormorant | `clamp(40px, 3.6vw, 70px)` (Fluid) | `0.9` | `-2px` |
| **Heritage Story Titles** | Cormorant | `text-3xl` → `lg:text-[42px]` | `1.1` | `-1px` |
| **Section Banner Labels** | Cormorant | `text-xl` → `lg:text-3xl` | `Normal` | `2px` |
| **Standard Body Text** | Raleway | `text-base` (16px) | `25px` | `Normal` |
| **Small Body / Desc** | Raleway | `text-sm` (14px) | `26px` | `Normal` |
| **Chapter Markers** | Raleway | `10px` → `12px` (sm) | `Normal` | `3px` |
| **Category Tags** | Raleway | `text-xs` (12px) | `Normal` | `wider` |
| **Semantic Labels** | Raleway | `var(--font-size: 14px)` | `25px` | `0px` |

### 4. Implementation Patterns
*   **Fluid Typography**: Used exclusively for the Hero section's desktop view to maintain cinematic proportions across ultra-wide displays.
*   **Hardcoded Pixels**: Found in CSS variables for "Semantic" classes (e.g., `14px`, `23px`, `95px`) to match the original design spec precisely.
*   **Tailwind Scale**: Standard components (Heritage, Footer, Reviews) utilize Tailwind's responsive prefixes (`sm:`, `lg:`) with a mix of standard (`text-base`) and arbitrary (`text-[42px]`) values.
*   **Line-Height Strategy**: Headlines use extremely tight leading (`0.82` - `0.9`) to achieve a "stacked" luxury look, while body text uses a comfortable `25px`-`26px` for readability.
