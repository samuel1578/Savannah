import React from "react";
import { useAuth } from "../../hooks/useAuth";
import logoLight from "../../assets/logo-light.png";
import { LogOut, LayoutDashboard, Database, Settings, ShieldCheck, User as UserIcon } from "lucide-react";

export const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error("Failed to log out", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#070D0A] text-[#F3F4F6] font-sans flex flex-col">
            {/* Header */}
            <header className="border-b border-[#C5A880]/10 bg-[#0B1510]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img src={logoLight} alt="Savannah Water Logo" className="h-10 w-auto object-contain" />
                    <div className="h-6 w-[1px] bg-[#C5A880]/20 hidden sm:block"></div>
                    <span className="text-xs font-light tracking-[0.2em] text-[#C5A880] uppercase hidden sm:block">
                        Content Management System
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-light text-[#9CA3AF]">
                        <UserIcon className="w-4 h-4 text-[#C5A880]" />
                        <span className="hidden sm:inline">{user?.email}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/40 text-red-300 text-xs tracking-wider uppercase px-4 py-2 rounded-xl transition-all duration-300 focus:outline-none"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
                <div className="text-center max-w-2xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-[#C5A880]/10 border border-[#C5A880]/20 px-4 py-1.5 rounded-full text-[#C5A880] text-xs tracking-widest uppercase mb-6">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Phase 1 Secure Foundation Active</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-serif font-light text-[#F3F4F6] tracking-wide mb-4">
                        Savannah Water CMS
                    </h1>
                    <p className="text-[#9CA3AF] font-light leading-relaxed mb-8">
                        The secure authentication foundation has been successfully established. Your PHP Session is active and protected against session fixation, CSRF, and brute-force attacks.
                    </p>

                    {/* Grid of future modules */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
                        <div className="p-5 bg-[#0B1510] border border-[#C5A880]/10 rounded-2xl flex items-start gap-4">
                            <div className="p-2.5 bg-[#C5A880]/10 rounded-xl text-[#C5A880]">
                                <LayoutDashboard className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-sm text-[#F3F4F6]">Dashboard Panel</h3>
                                <p className="text-xs text-[#6B7280] font-light mt-1">Status overview & analytics (Phase 2)</p>
                            </div>
                        </div>

                        <div className="p-5 bg-[#0B1510] border border-[#C5A880]/10 rounded-2xl flex items-start gap-4">
                            <div className="p-2.5 bg-[#C5A880]/10 rounded-xl text-[#C5A880]">
                                <Database className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-sm text-[#F3F4F6]">Content Modules</h3>
                                <p className="text-xs text-[#6B7280] font-light mt-1">Homepage, About, Blog, Products (Phase 2)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-[#C5A880]/10 py-6 text-center text-xs font-light text-[#4B5563]">
                Savannah Water Content Management System © 2026 Savannah Drinks. All Rights Reserved.
            </footer>
        </div>
    );
};
