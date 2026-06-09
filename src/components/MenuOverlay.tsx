import { useEffect } from "react";
import { Link } from "react-router-dom";
import logoLight from "../assets/logo-light.png";

interface MenuOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    activeSection: string;
}

export const MenuOverlay = ({ isOpen, onClose, activeSection }: MenuOverlayProps): JSX.Element | null => {
    // Prevent body scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 w-full h-screen bg-[#0d1512] z-[100] flex items-center justify-center p-6 sm:p-10 lg:p-16 text-[#f3f1ec] overflow-y-auto animate-fade-in">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-8 right-6 sm:top-10 sm:right-10 lg:top-12 lg:right-14 w-10 h-10 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity z-[110] bg-transparent border-0 outline-none"
                aria-label="Close menu"
            >
                <div className="relative w-8 h-8">
                    <div className="absolute top-3.5 left-0 w-8 h-[1.5px] bg-[#f5f3ef] rotate-45 transform-origin-center" />
                    <div className="absolute top-3.5 left-0 w-8 h-[1.5px] bg-[#f5f3ef] -rotate-45 transform-origin-center" />
                </div>
            </button>

            {/* Main Content Container */}
            <div className="w-full max-w-[1280px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-16 py-8">

                {/* Left Column: Navigation Links */}
                <nav className="flex flex-col gap-3 sm:gap-4 lg:gap-6 text-[56px] sm:text-[72px] lg:text-[96px] xl:text-[112px] lowercase font-light leading-[1.05] tracking-tight [font-family:'Cormorant_Unicase',Helvetica] w-full lg:w-auto text-left pl-0 sm:pl-8 lg:pl-0">
                    <Link
                        to="/"
                        onClick={onClose}
                        className={`hover:opacity-100 transition-opacity duration-300 ${activeSection === "home" ? "opacity-100 font-normal" : "opacity-35"}`}
                    >
                        home
                    </Link>
                    <Link
                        to="/about"
                        onClick={onClose}
                        className={`hover:opacity-100 transition-opacity duration-300 ${activeSection === "about" ? "opacity-100 font-normal" : "opacity-35"}`}
                    >
                        about
                    </Link>
                    <Link
                        to="/blog"
                        onClick={onClose}
                        className={`hover:opacity-100 transition-opacity duration-300 ${activeSection === "blog" ? "opacity-100 font-normal" : "opacity-35"}`}
                    >
                        blog
                    </Link>
                    <Link
                        to="/contact"
                        onClick={onClose}
                        className={`hover:opacity-100 transition-opacity duration-300 ${activeSection === "contact" ? "opacity-100 font-normal" : "opacity-35"}`}
                    >
                        contact
                    </Link>
                </nav>

                {/* Right Column: Logo & Content */}
                <div className="flex flex-col items-center lg:items-end text-center lg:text-right gap-8 sm:gap-10 lg:gap-12 max-w-[450px] w-full">
                    {/* Logo */}
                    <img
                        src={logoLight}
                        alt="Savannah Water Logo"
                        className="w-[220px] sm:w-[300px] lg:w-[380px] h-auto object-contain"
                    />

                    {/* Info Blocks */}
                    <div className="space-y-6 [font-family:'Raleway',Helvetica] text-xs sm:text-sm lg:text-base text-[#f5f3ef]/80 tracking-wide leading-relaxed">
                        <p className="font-light">
                            Savannah Water Studio<br />
                            London, United Kingdom<br />
                            Inspired by Ghana
                        </p>
                        <p className="font-light">
                            Luxury Hydration Experience<br />
                            Available Worldwide
                        </p>
                        <Link
                            to="/contact"
                            onClick={onClose}
                            className="inline-block [font-family:'Cormorant_Unicase',Helvetica] text-2xl sm:text-3xl lg:text-[38px] font-light text-white hover:opacity-75 transition-opacity mt-6 border-b border-white pb-1"
                        >
                            Visit us
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};
