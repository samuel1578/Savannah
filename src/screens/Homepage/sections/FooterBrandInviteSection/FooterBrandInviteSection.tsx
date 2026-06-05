import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Link } from "react-router-dom";
import logoLight from "../../../../assets/logo-light.png";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#read-more-heritage" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const FooterBrandInviteSection = (): JSX.Element => {
  return (
    <footer className="relative w-full bg-qi124qodeinteractivecomouter-space text-white py-20 px-6 sm:px-10 lg:px-14 reveal-section">
      <div className="mx-auto flex flex-col items-center justify-center max-w-[793px] text-center">

        {/* Logo Image */}
        <div className="flex flex-col items-center mb-12 footer-logotype">
          <img
            src={logoLight}
            alt="Savannah Water Logo"
            className="w-[280px] sm:w-[350px] lg:w-[420px] h-auto object-contain"
          />
        </div>

        {/* Email Form */}
        <form className="mb-14 flex w-full max-w-[580px] items-end gap-4 border-b border-[#a8a7a7]/40 pb-[4px] mx-auto footer-form">
          <label htmlFor="footer-email" className="sr-only">
            Your E-mail
          </label>
          <Input
            id="footer-email"
            type="email"
            defaultValue=""
            placeholder="Your E-mail"
            className="h-8 flex-1 rounded-none border-0 bg-transparent px-[5px] py-0 [font-family:'Raleway',Helvetica] text-sm tracking-[1px] text-[#d2d2d2] shadow-none placeholder:text-qi124qodeinteractivecomsilver-chalice/60 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            type="submit"
            variant="ghost"
            className="h-auto rounded-none px-0 pb-0 pt-0 [font-family:'Raleway',Helvetica] text-xs sm:text-sm font-semibold tracking-[2px] uppercase text-white hover:bg-transparent hover:text-white/80 transition-opacity"
          >
            Send
          </Button>
        </form>

        {/* Centered Navigation Links */}
        <nav
          aria-label="Footer navigation"
          className="flex items-center justify-center gap-12 sm:gap-16 lg:gap-24 mb-16"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="[font-family:'Raleway',Helvetica] text-sm sm:text-base font-medium tracking-[1px] text-[#d2d2d2] hover:text-white transition-colors footer-nav-link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <div className="w-full border-t border-white/5 pt-8 footer-copyright">
          <p className="[font-family:'Raleway',Helvetica] text-xs sm:text-sm text-[#a8a7a7]/60 leading-[25px]">
            © 2026 Savannah Drinks, All Rights Reserved
          </p>
        </div>

      </div>
    </footer>
  );
};
