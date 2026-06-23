import { useState } from "react";
import colImage from "../../assets/col.jpg";

const getFullImageUrl = (path: string) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith("/")) return `https://savannahdrinks.co.uk${path}`;
    return `https://savannahdrinks.co.uk/${path}`;
};

export const SignatureCollectionsSection = ({ collections }: { collections: any[] }): JSX.Element => {
    const headline = "signature savannah collections";

    const [openTab, setOpenTab] = useState<number | null>(collections.length > 0 ? collections[0].id : null);

    const handleTabClick = (id: number) => {
        setOpenTab((prev) => (prev === id ? null : id));
    };

    const activeCollection = collections.find(c => c.id === openTab);
    const displayImage = activeCollection?.main_image_url ? getFullImageUrl(activeCollection.main_image_url) : colImage;
    const displayAlt = activeCollection?.main_image_alt || "Savannah Collections";

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
                <h2 className="sig-left-heading collections-left" dangerouslySetInnerHTML={{ __html: headline.replace(/\s/g, '<br />') }}>
                </h2>

                {/* Right Column — Accordion tabs */}
                <div className="sig-accordion-wrapper collections-right">
                    {collections.map((item) => (
                        <div key={item.id}>
                            <div
                                className="sig-tab-header"
                                onClick={() => handleTabClick(item.id)}
                            >
                                <span>{item.tab_title}</span>
                                <span
                                    className={`sig-chevron ${openTab === item.id ? "open" : "closed"
                                        }`}
                                >
                                    ▾
                                </span>
                            </div>
                            <div
                                className="sig-tab-panel"
                                style={{
                                    maxHeight: openTab === item.id ? "200px" : "0px",
                                }}
                            >
                                <div className="sig-tab-content">
                                    {item.tab_content}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottle Image */}
            <img
                className="sig-bottle-image"
                src={displayImage}
                alt={displayAlt}
            />
        </div>
    );
};
