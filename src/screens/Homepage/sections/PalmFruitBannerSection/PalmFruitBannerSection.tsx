import React from "react";
import selectionImage from "../../../../assets/selection.png";

export const PalmFruitBannerSection = (): JSX.Element => {
    return (
        <section className="relative w-full h-[280px] sm:h-[350px] lg:h-[450px] bg-[#2f1810] overflow-hidden flex items-end reveal-section palm-fruit-banner">
            {/* Full-bleed background image */}
            <img
                src={selectionImage}
                alt="Palm Fruit Selection"
                className="absolute inset-0 w-full h-full object-cover reveal-image"
            />

            {/* Subtle overlay to ensure text contrast */}
            <div className="absolute inset-0 bg-black/10" />

            <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 pb-8 sm:px-10 sm:pb-12 lg:px-14 lg:pb-16">
                <span className="[font-family:'Cormorant_Unicase',Helvetica] text-xl sm:text-2xl lg:text-3xl font-light tracking-[2px] text-[#fbfbfb] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                    our selection
                </span>
            </div>
        </section>
    );
};
