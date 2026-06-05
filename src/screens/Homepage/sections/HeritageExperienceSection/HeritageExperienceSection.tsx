import React from "react";
import heritageImage from "../../../../assets/heritage.jpg";
import luxuryImage from "../../../../assets/fixeda.jpg";

export const HeritageExperienceSection = (): JSX.Element => {
    return (
        <section className="relative w-full bg-qi-12-4qodeinteractivecomwhite py-16 px-6 sm:px-10 lg:px-14 reveal-section heritage-section">
            <div className="mx-auto w-full max-w-[1280px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">

                    {/* Left Column: Heritage Process */}
                    <div className="flex flex-col">
                        {/* Image */}
                        <div className="relative w-full aspect-[4/3] mb-6 overflow-hidden border border-solid border-black/5">
                            <img
                                src={heritageImage}
                                alt="Ghanaian heritage process"
                                className="w-full h-full object-cover reveal-image heritage-story-image"
                            />
                        </div>

                        {/* Category / Source */}
                        <span className="[font-family:'Raleway',Helvetica] text-xs font-semibold tracking-wider text-[#a8a7a7] uppercase mb-3">
                            Heritage Process / Savannah Water
                        </span>

                        {/* Title */}
                        <h3 className="[font-family:'Cormorant_Unicase',Helvetica] text-3xl sm:text-4xl lg:text-[42px] font-light leading-[1.1] tracking-[-1px] text-qi124qodeinteractivecomrangoon-green mb-4">
                            FROM PALM FRUIT<br />
                            TO PREMIUM<br />
                            HYDRATION
                        </h3>

                        {/* Description */}
                        <p className="[font-family:'Raleway',Helvetica] text-sm sm:text-base leading-[26px] text-qi124qodeinteractivecomrangoon-green/80 mb-6 max-w-[480px]">
                            Discover how Ghana's smoked palm fruit tradition inspired the creation of Savannah Water — a refined modern beverage rooted in culture, craftsmanship, and wellness.
                        </p>

                        {/* Link */}
                        <a
                            href="#read-more-heritage"
                            className="[font-family:'Raleway',Helvetica] text-xs sm:text-sm font-semibold uppercase tracking-wider text-qi124qodeinteractivecomrangoon-green mt-auto luxury-link"
                        >
                            Read More
                            <span className="text-[#a8a7a7] arrow-line">——</span>
                        </a>
                    </div>

                    {/* Right Column: Luxury Experiences */}
                    <div className="flex flex-col">
                        {/* Image */}
                        <div className="relative w-full aspect-[4/3] mb-6 overflow-hidden border border-solid border-black/5">
                            <img
                                src={luxuryImage}
                                alt="Luxury Savannah experiences"
                                className="w-full h-full object-cover reveal-image luxury-story-image"
                            />
                        </div>

                        {/* Category / Source */}
                        <span className="[font-family:'Raleway',Helvetica] text-xs font-semibold tracking-wider text-[#a8a7a7] uppercase mb-3">
                            Luxury Experiences / Savannah Water
                        </span>

                        {/* Title */}
                        <h3 className="[font-family:'Cormorant_Unicase',Helvetica] text-3xl sm:text-4xl lg:text-[42px] font-light leading-[1.1] tracking-[-1px] text-qi124qodeinteractivecomrangoon-green mb-4">
                            INSIDE THE<br />
                            SAVANNAH<br />
                            EXPERIENCE
                        </h3>

                        {/* Description */}
                        <p className="[font-family:'Raleway',Helvetica] text-sm sm:text-base leading-[26px] text-qi124qodeinteractivecomrangoon-green/80 mb-6 max-w-[480px]">
                            Explore the vision behind Savannah Water through private tastings, hospitality partnerships, and immersive conversations with our founder.
                        </p>

                        {/* Link */}
                        <a
                            href="#read-more-experience"
                            className="[font-family:'Raleway',Helvetica] text-xs sm:text-sm font-semibold uppercase tracking-wider text-qi124qodeinteractivecomrangoon-green mt-auto luxury-link"
                        >
                            Read More
                            <span className="text-[#a8a7a7] arrow-line">——</span>
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
};
