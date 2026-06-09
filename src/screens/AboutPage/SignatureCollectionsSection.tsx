import { useState } from "react";
import colImage from "../../assets/col.jpg";

export const SignatureCollectionsSection = (): JSX.Element => {
    const [openTab, setOpenTab] = useState<"reserve" | "daily" | null>("reserve");

    const handleTabClick = (tab: "reserve" | "daily") => {
        setOpenTab((prev) => (prev === tab ? null : tab));
    };

    return (
        <div style={{ width: "100%", backgroundColor: "#ffffff" }} className="collections-section reveal-section">
            <style>{`
                .sig-outer-wrapper {
                    width: 100%;
                    padding: 80px 60px;
                    box-sizing: border-box;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    align-items: start;
                    gap: 40px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .sig-left-heading {
                    font-family: 'Cormorant Unicase', serif;
                    font-size: clamp(40px, 4vw, 95px);
                    font-weight: 300;
                    letter-spacing: -4px;
                    line-height: 1;
                    text-transform: lowercase;
                    color: #242514;
                }
                .sig-accordion-wrapper {
                    display: flex;
                    flex-direction: column;
                    border-bottom: 1px solid #ebebeb;
                }
                .sig-tab-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 0;
                    border-top: 1px solid #ebebeb;
                    cursor: pointer;
                    font-family: 'Cormorant Unicase', serif;
                    font-size: clamp(24px, 2.5vw, 46px);
                    font-weight: 400;
                    letter-spacing: -2px;
                    line-height: 36px;
                    text-transform: lowercase;
                    color: #242514;
                    user-select: none;
                }
                .sig-chevron {
                    display: inline-block;
                    transition: transform 0.3s ease;
                }
                .sig-chevron.open {
                    transform: rotate(180deg);
                }
                .sig-chevron.closed {
                    transform: rotate(0deg);
                }
                .sig-tab-panel {
                    overflow: hidden;
                    transition: max-height 0.4s ease;
                }
                .sig-tab-content {
                    padding: 0 0 24px 0;
                    font-family: 'Raleway', sans-serif;
                    font-size: 14px;
                    line-height: 25px;
                    color: #242514;
                }
                .sig-bottle-image {
                    width: 100%;
                    max-width: 1200px;
                    margin: 40px auto 0;
                    display: block;
                    height: auto;
                    aspect-ratio: 16/7;
                    object-fit: cover;
                    border-radius: 2px;
                }
                @media (max-width: 768px) {
                    .sig-outer-wrapper {
                        grid-template-columns: 1fr;
                        padding: 60px 24px;
                    }
                }
            `}</style>

            {/* Outer wrapper */}
            <div className="sig-outer-wrapper">
                {/* Left Column — Heading */}
                <h2 className="sig-left-heading collections-left">
                    signature<br />
                    savannah<br />
                    collections
                </h2>

                {/* Right Column — Accordion tabs */}
                <div className="sig-accordion-wrapper collections-right">
                    {/* Savannah Reserve Tab */}
                    <div>
                        <div
                            className="sig-tab-header"
                            onClick={() => handleTabClick("reserve")}
                        >
                            <span>savannah reserve</span>
                            <span
                                className={`sig-chevron ${openTab === "reserve" ? "open" : "closed"
                                    }`}
                            >
                                ▾
                            </span>
                        </div>
                        <div
                            className="sig-tab-panel"
                            style={{
                                maxHeight: openTab === "reserve" ? "200px" : "0px",
                            }}
                        >
                            <div className="sig-tab-content">
                                2024 • Signature Smoked Palm Fruit Infused Water • Premium Bottle Collection  A refined luxury hydration experience crafted from purified water and a delicate smoked palm fruit infusion inspired by Ghanaian heritage and modern sophistication.
                            </div>
                        </div>
                    </div>

                    {/* Savannah Daily Tab */}
                    <div>
                        <div
                            className="sig-tab-header"
                            onClick={() => handleTabClick("daily")}
                        >
                            <span>savannah daily</span>
                            <span
                                className={`sig-chevron ${openTab === "daily" ? "open" : "closed"
                                    }`}
                            >
                                ▾
                            </span>
                        </div>
                        <div
                            className="sig-tab-panel"
                            style={{
                                maxHeight: openTab === "daily" ? "200px" : "0px",
                            }}
                        >
                            <div className="sig-tab-content">
                                2024 • Everyday Smoked Palm Fruit Infused Water • Classic Bottle Collection  The everyday expression of Savannah Water — the same authentic Ghanaian heritage, crafted for daily rituals and modern living.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottle Image */}
            <img
                className="sig-bottle-image"
                src={colImage}
                alt="Savannah Collections"
            />
        </div>
    );
};
