import heroImage from "../../../../assets/hero.jpeg";
import sImage from "../../../../assets/s.jpg";
import reserveImage from "../../../../assets/reserve.png";
import dailyImage from "../../../../assets/daily.png";
import { HomepageSection, HomepageProduct } from "../../../../services/homepageCmsService";

interface BrandStoryHeroSectionProps {
  data?: HomepageSection;
  products?: HomepageProduct[];
}

export const BrandStoryHeroSection = ({ data, products = [] }: BrandStoryHeroSectionProps): JSX.Element => {
  // Helper to get field value
  const getField = (key: string, fallback: string) => {
    return data?.fields.find(f => f.key === key)?.value ?? fallback;
  };

  const chapterMarker = data?.chapter_marker ?? "01 — Story";
  const storyTitleLines = [
    getField("hero_headline_line_1", "every"),
    getField("hero_headline_line_2", "bottle"),
    getField("hero_headline_line_3", "tells a"),
    getField("hero_headline_line_4", "story"),
  ];

  const inspirationTitle = getField("hero_inspiration_title", "mama anita");
  const inspirationTag = getField("hero_inspiration_tag", "Inspiration");
  const inspirationBody = getField("hero_inspiration_body", "Savannah Water was inspired by the strength, warmth, and resilience of Mama Annita — a woman whose spirit reflected the richness of tradition and the beauty of authenticity. Her legacy lives on through every bottle, reminding us that true refinement begins at the source.");

  // Resolve Hero Image from CMS
  const cmsHeroImageUrl = getField("hero_image_url", "");
  const cmsHeroImageAlt = getField("hero_image_alt", "Savannah Water bottle");

  const cmsInspirationImageUrl = getField("hero_story_card_image_url", "");
  const cmsInspirationImageAlt = getField("hero_story_card_image_alt", "Mama Annita");

  const getFullImageUrl = (path: string) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith("/")) return `https://savannahdrinks.co.uk${path}`;
    return `https://savannahdrinks.co.uk/${path}`;
  };

  const displayHeroImage = cmsHeroImageUrl ? getFullImageUrl(cmsHeroImageUrl) : heroImage;
  const displayInspirationImage = cmsInspirationImageUrl ? getFullImageUrl(cmsInspirationImageUrl) : sImage;

  // Map products to local structure while keeping images hardcoded
  const displayProducts = products.map(p => {
    const isReserve = p.product_key.includes("reserve");
    const cmsImage = p.file_path ? getFullImageUrl(p.file_path) : (isReserve ? reserveImage : dailyImage);
    return {
      title: p.title,
      description: p.description,
      image: cmsImage,
      imageClassName: isReserve
        ? "h-[260px] w-auto rotate-[-14deg] object-contain sm:h-[320px] lg:h-[420px]"
        : "h-[240px] w-auto rotate-[12deg] object-contain sm:h-[300px] lg:h-[380px]",
      specs: p.specifications.map(s => ({
        label: s.spec_label,
        value: s.spec_value
      }))
    };
  });

  // Fallback if no products from CMS
  const productSections = displayProducts.length > 0 ? displayProducts : [
    {
      title: "savannah reserve",
      description: "Crafted for luxury lounges, fine dining spaces, boutique hotels, and elevated experiences. Savannah Reserve delivers smoked palm fruit–infused hydration in a refined glass bottle designed to complement premium environments with elegance and distinction",
      image: reserveImage,
      imageClassName: "h-[260px] w-auto rotate-[-14deg] object-contain sm:h-[320px] lg:h-[420px]",
      specs: [
        { label: "Audience:", value: "luxury hotels & fine dining" },
        { label: "Experience:", value: "refined, smoky, sophisticated hydration." },
        { label: "Notes:", value: "Crafted for premium hospitality, executive lounges, curated dining experiences, and luxury lifestyle environments." },
      ],
    },
    {
      title: "savannah daily",
      description: "Made for everyday movement, convenience, and refreshment on the go. Savannah Daily brings the same signature smoked palm fruit essence in a lightweight, practical bottle perfect for work, travel, fitness, and daily hydration.",
      image: dailyImage,
      imageClassName: "h-[240px] w-auto rotate-[12deg] object-contain sm:h-[300px] lg:h-[380px]",
      specs: [
        { label: "Audience:", value: "modern everyday consumers" },
        { label: "Lifestytle:", value: "active, convenient, refreshing hydration." },
        { label: "Notes:", value: "Designed for workdays, fitness, travel, commuting, and health-conscious consumers seeking flavorful hydration daily." },
      ],
    },
  ];

  return (
    <section className="relative w-full bg-qi-12-4qodeinteractivecomalabaster">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col">

        {/* Restructured Hero Section */}
        <div className="relative w-full h-[680px] sm:h-[800px] xl:h-[1200px] bg-[#fafafa] overflow-hidden">
          {/* Understated discovered Chapter Marker */}
          <div className="absolute top-24 right-6 sm:right-10 lg:right-14 [font-family:'Raleway',Helvetica] text-[10px] sm:text-xs font-semibold uppercase tracking-[3px] text-[#242514]/30 select-none pointer-events-none z-20">
            {chapterMarker}
          </div>

          {/* Luxury Ambient Light Overlay */}
          <div className="ambient-light-overlay" />

          {/* Desktop/Laptop Layout (xl and up) */}
          <div className="hidden xl:block absolute inset-0 max-w-[1920px] h-[1200px] left-1/2 -translate-x-1/2 w-full">
            <style>{`
              @media (min-width: 1280px) and (max-width: 1800px) {
                .xl\\:block .hero-headline {
                  left: 40% !important;
                  max-width: 28% !important;
                }
                .xl\\:block .hero-portrait {
                  right: 2% !important;
                }
                .xl\\:block .hero-story-text {
                  right: 8% !important;
                }
                .xl\\:block .hero-inspiration-title {
                  right: 4% !important;
                }
                .xl\\:block .hero-inspiration-tag {
                  right: 16% !important;
                }
              }
            `}</style>
            {/* Left side background - Full Bleed */}
            <div className="absolute left-0 top-0 h-full w-[38%] min-w-[500px] max-w-[730px] overflow-hidden">
              <img
                className="w-full h-full object-cover hero-bottle"
                alt={cmsHeroImageAlt}
                src={displayHeroImage}
              />
            </div>

            {/* Heading: every bottle tells a story */}
            <h1 className="absolute left-[45%] top-[270px] max-w-[28%] font-qi124-qodeinteractive-com-semantic-heading-1-lower text-[clamp(80px,7.3vw,140px)] font-light leading-[0.85] tracking-[-4px] text-[#242514] hero-headline">
              {storyTitleLines.map((line, idx) => (
                <span key={`desktop-line-${idx}`} className="block hero-headline-line">{line}</span>
              ))}
            </h1>

            {/* s.jpg image - Increased Height & Top Alignment */}
            <div
              className="absolute right-[40px] top-[291px] w-[23%] max-w-[445px] h-[480px] bg-cover bg-top hero-story-card hero-portrait"
              style={{ backgroundImage: `url(${displayInspirationImage})` }}
              aria-label={cmsInspirationImageAlt}
            />

            {/* Text wrapper */}
            <p className="absolute right-[186px] top-[804px] w-[299px] [font-family:'Raleway',Helvetica] text-base font-normal leading-[25px] text-[#242514] hero-story-card hero-story-text">
              {inspirationBody}
            </p>

            {/* heading-luigi */}
            <div className="absolute right-[108px] top-[856px] w-[377px] [font-family:'Cormorant_Unicase',Helvetica] text-[clamp(40px,3.6vw,70px)] font-medium leading-[0.9] tracking-[-2px] text-[#242514] hero-story-card hero-inspiration-title">
              {inspirationTitle}
            </div>

            {/* Inspiration */}
            <div className="absolute right-[335px] top-[1009px] w-[150px] font-qi124-qodeinteractive-com-raleway-regular text-[length:var(--qi124-qodeinteractive-com-raleway-regular-font-size)] font-[number:var(--qi124-qodeinteractive-com-raleway-regular-font-weight)] leading-[var(--qi124-qodeinteractive-com-raleway-regular-line-height)] tracking-[var(--qi124-qodeinteractive-com-raleway-regular-letter-spacing)] text-[#242514] flex items-center whitespace-nowrap hero-story-card hero-inspiration-tag">
              {inspirationTag}
            </div>
          </div>

          {/* Responsive Layout (large screens, tablets, and mobile) */}
          <div className="xl:hidden flex flex-col lg:flex-row w-full h-full">
            {/* Left side background - Full Bleed */}
            <div className="relative w-full lg:w-[40%] h-[400px] lg:h-full overflow-hidden">
              <img
                className="w-full h-full object-cover hero-bottle"
                alt={cmsHeroImageAlt}
                src={displayHeroImage}
              />
            </div>

            {/* Content area */}
            <div className="flex-1 flex flex-col lg:flex-row px-6 py-10 sm:px-10 lg:px-14 lg:py-16 justify-between gap-10 overflow-y-auto">
              <div className="flex-1 max-w-[450px]">
                <h1 className="font-qi124-qodeinteractive-com-semantic-heading-1-lower text-[64px] sm:text-[80px] lg:text-[95px] font-light leading-[0.85] tracking-[-4px] text-[#242514] hero-headline">
                  {storyTitleLines.map((line, idx) => (
                    <span key={`mobile-line-${idx}`} className="block hero-headline-line">
                      {line}
                    </span>
                  ))}
                </h1>
              </div>

              <div className="flex-1 flex flex-col items-start max-w-[450px] hero-story-card">
                <div
                  className="mb-6 h-[260px] w-[200px] bg-cover bg-top"
                  style={{ backgroundImage: `url(${displayInspirationImage})` }}
                  aria-label={cmsInspirationImageAlt}
                />
                <div className="space-y-4">
                  <p className="[font-family:'Raleway',Helvetica] text-sm leading-[25px] text-[#242514] sm:text-base">
                    {inspirationBody}
                  </p>
                  <div className="[font-family:'Cormorant_Unicase',Helvetica] text-[42px] font-medium leading-[0.9] tracking-[-2px] text-[#242514] sm:text-[54px]">
                    {inspirationTitle}
                  </div>
                  <p className="font-qi124-qodeinteractive-com-raleway-regular text-[length:var(--qi124-qodeinteractive-com-raleway-regular-font-size)] font-[number:var(--qi124-qodeinteractive-com-raleway-regular-font-weight)] leading-[var(--qi124-qodeinteractive-com-raleway-regular-line-height)] tracking-[var(--qi124-qodeinteractive-com-raleway-regular-letter-spacing)] text-[#242514]">
                    {inspirationTag}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Product Sections (Savannah Reserve, Savannah Daily) */}
        <div className="flex flex-col gap-12 px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          {productSections.map((section) => {
            const isReserve = section.title.toLowerCase().includes("reserve");
            const sectionClass = isReserve ? "product-section-reserve" : "product-section-daily";
            return (
              <article
                key={section.title}
                className={`grid items-start gap-8 lg:grid-cols-[1fr_220px_1fr] lg:gap-10 ${sectionClass}`}
              >
                <div className="max-w-[360px]">
                  <h2 className="[font-family:'Cormorant_Unicase',Helvetica] text-[54px] font-light leading-[0.82] tracking-[-4px] text-qi124qodeinteractivecomrangoon-green sm:text-[74px] lg:text-[110px] xl:text-[140px] product-title">
                    {section.title.split(" ").map((word, index) => (
                      <span
                        key={`${section.title}-${word}-${index}`}
                        className="block"
                      >
                        {word}
                      </span>
                    ))}
                  </h2>
                  <p className="mt-5 [font-family:'Raleway',Helvetica] text-sm leading-[25px] text-qi124qodeinteractivecomrangoon-green sm:text-base product-description">
                    {section.description}
                  </p>
                </div>
                <div className="flex items-center justify-center py-2 lg:py-0">
                  <img
                    src={section.image}
                    alt={section.title}
                    className={`${section.imageClassName} product-bottle`}
                  />
                </div>
                <dl className="grid gap-4 pt-1 product-specs">
                  {section.specs.map((spec) => (
                    <div
                      key={`${section.title}-${spec.label}`}
                      className="grid gap-1 sm:grid-cols-[110px_1fr] sm:gap-4"
                    >
                      <dt className="font-qi124-qodeinteractive-com-raleway-regular text-[length:var(--qi124-qodeinteractive-com-raleway-regular-font-size)] font-[number:var(--qi124-qodeinteractive-com-raleway-regular-font-weight)] leading-[var(--qi124-qodeinteractive-com-raleway-regular-line-height)] tracking-[var(--qi124-qodeinteractive-com-raleway-regular-letter-spacing)] text-qi124qodeinteractivecomrangoon-green [font-style:var(--qi124-qodeinteractive-com-raleway-regular-font-style)]">
                        {spec.label}
                      </dt>
                      <dd
                        className={
                          spec.label === "Notes:"
                            ? "font-qi124-qodeinteractive-com-raleway-regular text-[length:var(--qi124-qodeinteractive-com-raleway-regular-font-size)] font-[number:var(--qi124-qodeinteractive-com-raleway-regular-font-weight)] leading-[25px] tracking-[var(--qi124-qodeinteractive-com-raleway-regular-letter-spacing)] text-qi124qodeinteractivecomrangoon-green [font-style:var(--qi124-qodeinteractive-com-raleway-regular-font-style)]"
                            : "font-qi124-qodeinteractive-com-semantic-heading-4-lower text-[24px] font-[number:var(--qi124-qodeinteractive-com-semantic-heading-4-lower-font-weight)] leading-[1] tracking-[var(--qi124-qodeinteractive-com-semantic-heading-4-lower-letter-spacing)] text-qi124qodeinteractivecomrangoon-green sm:text-[28px] [font-style:var(--qi124-qodeinteractive-com-semantic-heading-4-lower-font-style)]"
                        }
                      >
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            );
          })}
        </div>
        <div className="h-6 w-full" />
      </div>
    </section>
  );
};
