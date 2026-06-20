import React from "react";
import mapImage from "../../../../assets/map.png";
import { HomepageSection } from "../../../../services/homepageCmsService";

interface MapOriginSectionProps {
    data?: HomepageSection;
}

export const MapOriginSection = ({ data }: MapOriginSectionProps): JSX.Element => {
    // Helper to get field value
    const getField = (key: string, fallback: string) => {
        return data?.fields.find(f => f.key === key)?.value || fallback;
    };

    const chapterMarker = data?.chapter_marker || "02 — Origin";
    const description = getField("map_description", "Inspired by Ghana's rich palm heritage, Savannah Water transforms a traditional essence into a refined modern hydration experience.");
    const ctaText = getField("map_cta_text", "Discover the Origin");
    const ctaUrl = getField("map_cta_url", "#discover");

    const headlineLine1 = getField("map_headline_line_1", "a new");
    const headlineLine2 = getField("map_headline_line_2", "taste OF");
    const headlineLine3 = getField("map_headline_line_3", "LUXURY");
    const headlineLine4 = getField("map_headline_line_4", "HYDRATION");

    // Resolve Map Image from CMS
    const cmsMapImageUrl = getField("map_image_url", "");
    const cmsMapImageAlt = getField("map_image_alt", "Ghana Map of Savannah Regions");

    const getFullImageUrl = (path: string) => {
        if (!path) return "";
        if (/^https?:\/\//i.test(path)) return path;
        if (path.startsWith("/")) return `https://savannahdrinks.co.uk${path}`;
        return `https://savannahdrinks.co.uk/${path}`;
    };

    const displayMapImage = cmsMapImageUrl ? getFullImageUrl(cmsMapImageUrl) : mapImage;

    return (
        <section className="relative w-full bg-qi124qodeinteractivecomouter-space text-white py-16 px-6 sm:px-10 lg:px-14 map-section">
            {/* Understated discovered Chapter Marker */}
            <div className="absolute top-8 right-6 sm:right-10 lg:right-14 [font-family:'Raleway',Helvetica] text-[10px] sm:text-xs font-semibold uppercase tracking-[3px] text-white/30 select-none pointer-events-none">
                {chapterMarker}
            </div>
            <div className="mx-auto flex w-full max-w-[1280px] flex-col justify-center min-h-[500px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_0.9fr] gap-12 items-center">

                    {/* Map Column */}
                    <div className="relative flex items-center justify-center min-h-[350px] w-full max-w-[450px] mx-auto overflow-hidden map-container">
                        <img
                            src={displayMapImage}
                            alt={cmsMapImageAlt}
                            className="w-full h-auto object-contain max-h-[350px] map-image"
                        />
                        {/* Gold Markers */}
                        <div className="absolute top-[35%] left-[45%] w-3 h-3 bg-[#e5c158] rounded-full shadow-[0_0_8px_#e5c158] opacity-0 map-marker" />
                        <div className="absolute top-[50%] left-[35%] w-3 h-3 bg-[#e5c158] rounded-full shadow-[0_0_8px_#e5c158] opacity-0 map-marker" />
                        <div className="absolute top-[65%] left-[55%] w-3 h-3 bg-[#e5c158] rounded-full shadow-[0_0_8px_#e5c158] opacity-0 map-marker" />
                    </div>

                    {/* Description Column */}
                    <div className="flex flex-col justify-center max-w-[340px] mx-auto lg:mx-0 map-description">
                        <p className="[font-family:'Raleway',Helvetica] text-sm sm:text-base leading-[26px] text-[#d2d2d2] mb-6">
                            {description}
                        </p>
                        <a
                            href={ctaUrl}
                            className="[font-family:'Raleway',Helvetica] text-xs sm:text-sm font-semibold uppercase tracking-wider text-white luxury-link"
                        >
                            {ctaText}
                            <span className="text-[#a8a7a7] arrow-line">——</span>
                        </a>
                    </div>

                    {/* Luxury Text Column */}
                    <div className="flex flex-col justify-center pl-0 lg:pl-6">
                        <h2 className="[font-family:'Cormorant_Unicase',Helvetica] text-[40px] sm:text-[48px] lg:text-[56px] font-light leading-[1] tracking-[-2px] text-white map-headline">
                            <span className="block lowercase font-light italic">{headlineLine1}</span>
                            <span className="block uppercase mt-1">
                                {headlineLine2.includes("OF") ? (
                                    <>
                                        {headlineLine2.replace("OF", "").trim()} <span className="text-[0.7em] font-normal align-middle">OF</span>
                                    </>
                                ) : headlineLine2}
                            </span>
                            <span className="block uppercase tracking-wide mt-1">{headlineLine3}</span>
                            <span className="block uppercase tracking-wide mt-1">{headlineLine4}</span>
                        </h2>
                    </div>

                </div>
            </div>
        </section>
    );
};
