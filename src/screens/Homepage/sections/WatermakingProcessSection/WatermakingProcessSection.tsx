import React from "react";
import watermakingImage from "../../../../assets/watermaking.png";

export const WatermakingProcessSection = (): JSX.Element => {
    return (
        <a
            href="#watermaking-process"
            className="group relative block w-full h-[280px] sm:h-[350px] lg:h-[450px] bg-[#1c1c16] overflow-hidden flex items-end cursor-pointer reveal-section lifestyle-banner"
        >
            {/* Understated discovered Chapter Marker */}
            <div className="absolute top-8 right-6 sm:right-10 lg:right-14 [font-family:'Raleway',Helvetica] text-[10px] sm:text-xs font-semibold uppercase tracking-[3px] text-white/30 select-none pointer-events-none z-20">
                03 — Experience
            </div>
            {/* Full-bleed background image with scale effect on hover */}
            <img
                src={watermakingImage}
                alt="Watermaking Process"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-103 reveal-image lifestyle-image"
            />

            {/* Subtle overlay to ensure text contrast */}
            <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:bg-black/20" />

            <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 pb-8 sm:px-10 sm:pb-12 lg:px-14 lg:pb-16">
                <span className="[font-family:'Cormorant_Unicase',Helvetica] text-xl sm:text-2xl lg:text-3xl font-light tracking-[2px] text-[#fbfbfb] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                    WATERMAKING PROCESS
                </span>
            </div>
        </a>
    );
};
