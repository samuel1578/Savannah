import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logoLight from "../assets/logo-light.png";
import hamburger from "../assets/hamburger.svg";

interface HeaderProps {
    onMenuOpen: () => void;
}

export const Header = ({ onMenuOpen }: HeaderProps): JSX.Element => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 15);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 w-full h-[85px] flex items-center justify-between px-6 sm:px-10 lg:px-14 z-50 transition-all duration-500 ${scrolled ? "header-scrolled" : ""}`}>
            {/* Logo */}
            <div className="flex items-center">
                <Link to="/" aria-label="Home">
                    <img
                        src={logoLight}
                        alt="Savannah Water Logo"
                        className="h-14 sm:h-16 lg:h-[70px] w-auto object-contain header-logo transition-all duration-300"
                    />
                </Link>
            </div>

            {/* Hamburger Menu Button */}
            <button
                onClick={onMenuOpen}
                className="flex items-center justify-center transition-opacity hover:opacity-80 bg-transparent border-0 cursor-pointer outline-none p-0"
                aria-label="Open the menu"
            >
                <img
                    src={hamburger}
                    alt="Menu"
                    className="w-8 sm:w-10 lg:w-12 h-auto object-contain"
                />
            </button>
        </header>
    );
};
