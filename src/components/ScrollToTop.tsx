import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = (): null => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Always scroll to top when the pathname changes
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [pathname]);

    return null;
};

export default ScrollToTop;
