import React from "react";

export const CallToActionSection = (): JSX.Element => {
    return (
        <section className="relative w-full bg-qi-12-4qodeinteractivecomwhite py-24 px-6 sm:px-10 lg:px-14 text-center reveal-section cta-section">
            <div className="mx-auto w-full max-w-[850px] flex flex-col items-center justify-center">

                {/* Title */}
                <h2 className="[font-family:'Cormorant_Unicase',Helvetica] text-3xl sm:text-4xl lg:text-[45px] font-light leading-[1.15] tracking-[-1px] text-qi124qodeinteractivecomrangoon-green mb-8 uppercase max-w-[720px] cta-headline">
                    EXPERIENCE SAVANNAH WATER BEYOND THE BOTTLE. VISIT US OR CONNECT WITH OUR CEO.
                </h2>

                {/* Link */}
                <a
                    href="#schedule"
                    className="[font-family:'Raleway',Helvetica] text-xs sm:text-sm font-semibold uppercase tracking-wider text-qi124qodeinteractivecomrangoon-green cta-button luxury-link"
                >
                    Schedule a Visit
                    <span className="text-[#a8a7a7] arrow-line">——</span>
                </a>

            </div>
        </section>
    );
};
