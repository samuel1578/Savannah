import React from "react";
import mapImage from "../../../../assets/map.png";

export const MapOriginSection = (): JSX.Element => {
    return (
        <section className="relative w-full bg-qi124qodeinteractivecomouter-space text-white py-16 px-6 sm:px-10 lg:px-14 map-section">
            {/* Understated discovered Chapter Marker */}
            <div className="absolute top-8 right-6 sm:right-10 lg:right-14 [font-family:'Raleway',Helvetica] text-[10px] sm:text-xs font-semibold uppercase tracking-[3px] text-white/30 select-none pointer-events-none">
                02 — Origin
            </div>
            <div className="mx-auto flex w-full max-w-[1280px] flex-col justify-center min-h-[500px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_0.9fr] gap-12 items-center">

                    {/* Map Column */}
                    <div className="relative flex items-center justify-center min-h-[350px] w-full max-w-[450px] mx-auto overflow-hidden map-container">
                        <img
                            src={mapImage}
                            alt="Ghana Map of Savannah Regions"
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
                            Inspired by Ghana's rich palm heritage, Savannah Water transforms a traditional essence into a refined modern hydration experience.
                        </p>
                        <a
                            href="#discover"
                            className="[font-family:'Raleway',Helvetica] text-xs sm:text-sm font-semibold uppercase tracking-wider text-white luxury-link"
                        >
                            Discover the Origin
                            <span className="text-[#a8a7a7] arrow-line">——</span>
                        </a>
                    </div>

                    {/* Luxury Text Column */}
                    <div className="flex flex-col justify-center pl-0 lg:pl-6">
                        <h2 className="[font-family:'Cormorant_Unicase',Helvetica] text-[40px] sm:text-[48px] lg:text-[56px] font-light leading-[1] tracking-[-2px] text-white map-headline">
                            <span className="block lowercase font-light italic">a new</span>
                            <span className="block uppercase mt-1">taste <span className="text-[0.7em] font-normal align-middle">OF</span></span>
                            <span className="block uppercase tracking-wide mt-1">LUXURY</span>
                            <span className="block uppercase tracking-wide mt-1">HYDRATION</span>
                        </h2>
                    </div>

                </div>
            </div>
        </section>
    );
};
