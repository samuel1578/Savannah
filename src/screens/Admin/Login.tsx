import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useAuth } from "../../hooks/useAuth";
import logoLight from "../../assets/logo-light.png";
import loginImg from "../../assets/login.jpg";
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

export const Login: React.FC = () => {
    const { login, isAuthenticated, isLoading: authLoading, checkSession } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Validation states
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

    // API states
    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lockoutTime, setLockoutSeconds] = useState<number>(0);

    // Modal/Overlay state for Forgot Password
    const [showForgotModal, setShowForgotModal] = useState(false);

    // Refs for GSAP animation
    const leftSectionRef = useRef<HTMLDivElement>(null);
    const rightSectionRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const errorContainerRef = useRef<HTMLDivElement>(null);

    // Redirect if already authenticated
    const from = (location.state as any)?.from?.pathname || "/admin/dashboard";

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    // Handle lockout countdown timer
    useEffect(() => {
        if (lockoutTime <= 0) return;

        const timer = setInterval(() => {
            setLockoutSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setApiError(null);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [lockoutTime]);

    // GSAP Entrance Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Set initial states
            gsap.set(".animate-fade-in", { opacity: 0 });
            gsap.set(".animate-slide-up", { opacity: 0, y: 30 });

            const tl = gsap.timeline();

            // Left section image zoom & reveal
            tl.fromTo(
                imageRef.current,
                { scale: 1.15, filter: "brightness(0.2)" },
                { scale: 1, filter: "brightness(0.6)", duration: 1.8, ease: "power3.out" }
            );

            // Left content glassmorphism panel slide & fade
            tl.fromTo(
                overlayRef.current,
                { opacity: 0, y: 40, backdropFilter: "blur(0px)" },
                { opacity: 1, y: 0, backdropFilter: "blur(12px)", duration: 1.2, ease: "power2.out" },
                "-=1.0"
            );

            // Right section elements staggered slide up
            tl.fromTo(
                ".animate-slide-up",
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out"
                },
                "-=0.8"
            );

            // Subtle logo fade-in on left
            tl.fromTo(
                ".animate-fade-in",
                { opacity: 0 },
                { opacity: 1, duration: 1, ease: "power1.out" },
                "-=0.4"
            );
        });

        return () => ctx.revert();
    }, []);

    // Form validation helper
    const validateField = (name: "email" | "password", value: string) => {
        const newErrors = { ...errors };

        if (name === "email") {
            if (!value.trim()) {
                newErrors.email = "Email address is required.";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                newErrors.email = "Please enter a valid email address.";
            } else {
                delete newErrors.email;
            }
        }

        if (name === "password") {
            if (!value) {
                newErrors.password = "Password is required.";
            } else if (value.length < 6) {
                newErrors.password = "Password must be at least 6 characters.";
            } else {
                delete newErrors.password;
            }
        }

        setErrors(newErrors);
    };

    const handleBlur = (field: "email" | "password") => {
        setTouched({ ...touched, [field]: true });
        validateField(field, field === "email" ? email : password);
    };

    const handleInputChange = (field: "email" | "password", value: string) => {
        if (field === "email") {
            setEmail(value);
        } else {
            setPassword(value);
        }

        if (touched[field]) {
            validateField(field, value);
        }
    };

    // Handle Form Submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ email: true, password: true });

        // Validate all fields
        const emailErr = !email.trim()
            ? "Email address is required."
            : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                ? "Please enter a valid email address."
                : undefined;

        const passwordErr = !password
            ? "Password is required."
            : password.length < 6
                ? "Password must be at least 6 characters."
                : undefined;

        if (emailErr || passwordErr) {
            setErrors({ email: emailErr, password: passwordErr });
            return;
        }

        setApiError(null);
        setApiSuccess(null);
        setIsSubmitting(true);

        try {
            const response = await login(email, password, rememberMe);

            if (response.success) {
                setApiSuccess("Access granted. Initializing secure session...");

                // Premium GSAP exit animation on successful login
                gsap.to(rightSectionRef.current, {
                    opacity: 0,
                    x: 50,
                    duration: 0.6,
                    ease: "power2.in",
                });

                gsap.to(imageRef.current, {
                    scale: 1.05,
                    duration: 1.2,
                    ease: "power2.out",
                });

                setTimeout(() => {
                    navigate(from, { replace: true });
                }, 1000);
            } else {
                setApiError(response.error || "Invalid credentials.");

                if (response.code === "LOCKED_OUT" && response.retry_after) {
                    setLockoutSeconds(response.retry_after);
                }

                // Error shake animation using GSAP
                if (formRef.current) {
                    gsap.fromTo(
                        formRef.current,
                        { x: -10 },
                        { x: 0, duration: 0.5, ease: "rough({ template: none, strength: 2, points: 5, taper: none, randomize: true, clamp: false })", clearProps: "x" }
                    );
                }
            }
        } catch (err) {
            setApiError("An unexpected system error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format lockout time
    const formatLockoutTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <div className="min-h-screen bg-[#070D0A] flex flex-col md:flex-row text-[#F3F4F6] font-sans overflow-hidden">

            {/* LEFT SECTION: Editorial Visual */}
            <div
                ref={leftSectionRef}
                className="relative w-full md:w-1/2 lg:w-[55%] min-h-[40vh] md:min-h-screen flex items-end p-8 sm:p-12 lg:p-16 overflow-hidden border-b md:border-b-0 md:border-r border-[#C5A880]/10"
            >
                {/* Background Image with Reveal Ref */}
                <img
                    ref={imageRef}
                    src={loginImg}
                    alt="Savannah Water Editorial"
                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
                />

                {/* Dark Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070D0A] via-[#070D0A]/40 to-transparent z-10 opacity-90"></div>
                <div className="absolute inset-0 bg-[#070D0A]/30 mix-blend-overlay z-10"></div>

                {/* Animated Subtle Gradient Mesh (Luxury Feeling) */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(197,168,128,0.08),transparent_50%)] z-10 pointer-events-none animate-pulse duration-[8000ms]"></div>

                {/* Savannah Water Branding Content Overlay */}
                <div
                    ref={overlayRef}
                    className="relative z-20 w-full max-w-lg bg-[#070D0A]/40 border border-[#C5A880]/15 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-md"
                >
                    <div className="animate-fade-in flex flex-col gap-6">
                        <img
                            src={logoLight}
                            alt="Savannah Water Logo"
                            className="h-10 sm:h-12 w-auto object-contain self-start"
                        />
                        <div className="h-[1px] w-16 bg-[#C5A880]/40"></div>
                        <div>
                            <p className="text-[#C5A880] font-light tracking-[0.25em] text-xs uppercase mb-2">
                                The Essence of Luxury Hydration
                            </p>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-light tracking-wide text-[#F3F4F6] leading-tight">
                                Pristine water infused with the subtle essence of smoked palm fruit.
                            </h2>
                        </div>
                        <p className="text-[#9CA3AF] text-sm font-light leading-relaxed">
                            Crafted in Ghana, enjoyed by connoisseurs worldwide. The Savannah Water Content Management System allows you to curate and protect this premium brand experience.
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT SECTION: Login Form */}
            <div
                ref={rightSectionRef}
                className="w-full md:w-1/2 lg:w-[45%] min-h-[60vh] md:min-h-screen bg-[#0B1510] flex flex-col justify-between p-8 sm:p-12 lg:p-16"
            >
                {/* Empty top spacer for perfect centering layout on desktop */}
                <div className="hidden md:block"></div>

                {/* Form Container */}
                <div className="w-full max-w-md mx-auto my-auto py-8">

                    {/* Header */}
                    <div className="mb-8">
                        <span className="animate-slide-up inline-block text-[#C5A880] font-light tracking-[0.2em] text-xs uppercase mb-2 bg-[#C5A880]/10 px-3 py-1 rounded-full border border-[#C5A880]/20">
                            Admin Access
                        </span>
                        <h1 className="animate-slide-up text-3xl sm:text-4xl font-serif font-light text-[#F3F4F6] tracking-wide mt-2">
                            Welcome Back
                        </h1>
                        <p className="animate-slide-up text-[#9CA3AF] text-sm font-light leading-relaxed mt-3">
                            Sign in to manage homepage sections, editorial storytelling, media assets, blog content, and the Savannah Water brand experience.
                        </p>
                    </div>

                    {/* Branded API Messages */}
                    {apiError && (
                        <div
                            ref={errorContainerRef}
                            className="mb-6 p-4 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-200 text-sm animate-fade-in shadow-lg"
                        >
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-1">
                                <span className="font-medium text-red-300">Authentication Failed</span>
                                <span className="font-light leading-relaxed">{apiError}</span>
                                {lockoutTime > 0 && (
                                    <span className="mt-2 text-xs bg-red-500/10 border border-red-500/20 px-2 py-1 rounded self-start font-mono text-red-300">
                                        Lockout Active: {formatLockoutTime(lockoutTime)}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {apiSuccess && (
                        <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-start gap-3 text-emerald-200 text-sm animate-fade-in shadow-lg">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-1">
                                <span className="font-medium text-emerald-300">Access Granted</span>
                                <span className="font-light leading-relaxed">{apiSuccess}</span>
                            </div>
                        </div>
                    )}

                    {/* Login Form */}
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

                        {/* Email Field */}
                        <div className="animate-slide-up">
                            <label
                                htmlFor="email"
                                className="block text-xs font-light text-[#C5A880] tracking-wider uppercase mb-2"
                            >
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF] group-focus-within:text-[#C5A880] transition-colors">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    disabled={isSubmitting || lockoutTime > 0}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    onBlur={() => handleBlur("email")}
                                    placeholder="admin@savannahwater.com"
                                    className={`w-full bg-[#070D0A]/50 border ${errors.email && touched.email
                                            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                                            : "border-[#C5A880]/20 focus:border-[#C5A880] focus:ring-[#C5A880]/10"
                                        } rounded-xl pl-11 pr-4 py-3.5 text-sm text-[#F3F4F6] placeholder-[#4B5563] focus:outline-none focus:ring-4 transition-all duration-300`}
                                />
                            </div>

                            {/* Custom Inline Validation */}
                            {errors.email && touched.email && (
                                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400 font-light animate-slide-up">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>{errors.email}</span>
                                </div>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="animate-slide-up">
                            <label
                                htmlFor="password"
                                className="block text-xs font-light text-[#C5A880] tracking-wider uppercase mb-2"
                            >
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF] group-focus-within:text-[#C5A880] transition-colors">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    disabled={isSubmitting || lockoutTime > 0}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    onBlur={() => handleBlur("password")}
                                    placeholder="••••••••"
                                    className={`w-full bg-[#070D0A]/50 border ${errors.password && touched.password
                                            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                                            : "border-[#C5A880]/20 focus:border-[#C5A880] focus:ring-[#C5A880]/10"
                                        } rounded-xl pl-11 pr-11 py-3.5 text-sm text-[#F3F4F6] placeholder-[#4B5563] focus:outline-none focus:ring-4 transition-all duration-300`}
                                />
                                <button
                                    type="button"
                                    disabled={isSubmitting || lockoutTime > 0}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9CA3AF] hover:text-[#C5A880] transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Custom Inline Validation */}
                            {errors.password && touched.password && (
                                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400 font-light animate-slide-up">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>{errors.password}</span>
                                </div>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="animate-slide-up flex items-center justify-between text-xs font-light text-[#9CA3AF]">
                            <label className="flex items-center gap-2 cursor-pointer select-none group">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    disabled={isSubmitting || lockoutTime > 0}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center ${rememberMe
                                        ? "bg-[#C5A880] border-[#C5A880] text-[#070D0A]"
                                        : "border-[#C5A880]/30 bg-transparent group-hover:border-[#C5A880]/60"
                                    }`}>
                                    {rememberMe && (
                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                        </svg>
                                    )}
                                </div>
                                <span className="group-hover:text-[#F3F4F6] transition-colors">Remember Me</span>
                            </label>

                            <button
                                type="button"
                                disabled={isSubmitting || lockoutTime > 0}
                                onClick={() => setShowForgotModal(true)}
                                className="text-[#C5A880] hover:text-[#F3F4F6] hover:underline transition-colors focus:outline-none"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || lockoutTime > 0}
                            className="animate-slide-up relative w-full bg-[#C5A880] hover:bg-[#D4BC9C] text-[#070D0A] font-medium text-sm tracking-widest uppercase py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-[#C5A880]/10 hover:shadow-xl hover:shadow-[#C5A880]/15 disabled:bg-[#C5A880]/40 disabled:text-[#070D0A]/60 disabled:cursor-not-allowed overflow-hidden group"
                        >
                            {/* Subtle shining light effect on hover */}
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine"></span>

                            <span className="flex items-center justify-center gap-2">
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-[#070D0A]" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.3 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Verifying Credentials...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="w-4.5 h-4.5" />
                                        Access CMS Dashboard
                                    </>
                                )}
                            </span>
                        </button>

                    </form>
                </div>

                {/* Footer */}
                <div className="animate-fade-in text-center md:text-left text-[10px] sm:text-xs font-light text-[#4B5563] tracking-wide border-t border-[#C5A880]/10 pt-6">
                    Savannah Water Content Management System © 2026 Savannah Drinks. All Rights Reserved.
                </div>
            </div>

            {/* PASSWORD RECOVERY MODAL (Premium glassmorphism overlay modal) */}
            {showForgotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070D0A]/80 backdrop-blur-md animate-fade-in">
                    <div className="relative w-full max-w-md bg-[#0B1510] border border-[#C5A880]/20 rounded-2xl p-8 shadow-2xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] mb-4">
                                <Lock className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-serif font-light text-[#F3F4F6] tracking-wide">
                                Password Recovery
                            </h3>
                            <p className="text-sm font-light text-[#9CA3AF] leading-relaxed mt-3">
                                For security reasons, password resets are restricted in the Savannah Water CMS.
                                Please contact the lead system administrator directly to recover or update your login credentials.
                            </p>
                            <div className="h-[1px] w-12 bg-[#C5A880]/20 my-6"></div>
                            <button
                                type="button"
                                onClick={() => setShowForgotModal(false)}
                                className="w-full bg-[#C5A880]/10 hover:bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30 font-medium text-xs tracking-wider uppercase py-3 rounded-xl transition-all duration-300 focus:outline-none"
                            >
                                Acknowledge & Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
