import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-[#0B1510] flex flex-col items-center justify-center z-50">
                {/* Premium elegant loader */}
                <div className="relative flex flex-col items-center">
                    <div className="w-16 h-16 border border-[#C5A880]/20 rounded-full flex items-center justify-center animate-pulse">
                        <div className="w-12 h-12 border border-[#C5A880]/40 rounded-full flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-[#C5A880]/10 border border-[#C5A880]"></div>
                        </div>
                    </div>
                    <span className="mt-6 text-[#C5A880] font-light tracking-[0.2em] text-xs uppercase animate-pulse">
                        Savannah Water
                    </span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect them to the login page, but save the current location they were trying to go to
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
