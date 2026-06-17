import React from "react";
import reviewsImage from "../../../../assets/fixedb.jpg";
import { HomepageSection } from "../../../../services/homepageCmsService";

interface ReviewsSectionProps {
    data?: HomepageSection;
}

export const ReviewsSection = ({ data }: ReviewsSectionProps): JSX.Element => {
    // Helper to get field value
    const getField = (key: string, fallback: string) => {
        return data?.fields.find(f => f.key === key)?.value || fallback;
    };

    const label = getField("reviews_label", "REVIEWS");
    const url = getField("reviews_url", "#reviews");

    return (
        <a
            href={url}
            className="group relative block w-full h-[280px] sm:h-[350px] lg:h-[450px] bg-[#2a1c1a] overflow-hidden flex items-end cursor-pointer reveal-section community-banner"
        >
            {/* Full-bleed background image with scale effect on hover */}
            <img
                src={reviewsImage}
                alt="Reviews"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-103 reveal-image community-image"
            />

            {/* Subtle overlay to ensure text contrast */}
            <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:bg-black/20" />

            <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 pb-8 sm:px-10 sm:pb-12 lg:px-14 lg:pb-16">
                <span className="[font-family:'Cormorant_Unicase',Helvetica] text-xl sm:text-2xl lg:text-3xl font-light tracking-[2px] text-[#fbfbfb] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                    {label}
                </span>
            </div>
        </a>
    );
};
