"use client";

import { GraduationCap, Menu, X } from "lucide-react";
import { Link } from "@/shared/i18n/routing";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/shared/ui/language-switcher";

function isActive(href: string, pathname: string): boolean {
    // All hash links → only "الرئيسية" (/#hero) is active when on "/"
    if (href.startsWith("/#")) return (href === "/#hero" || href === "/#") && (pathname === "/" || pathname === "/ar" || pathname === "/en" || pathname === "/it");
    if (href === "/") return pathname === "/" || pathname === "/ar" || pathname === "/en" || pathname === "/it";
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
    const locale = useLocale();
    const t = useTranslations("Landing.navbar");
    const tCommon = useTranslations("Common");
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const pathname = usePathname();

    const navLinks = [
        { label: t("features"), href: "/#features" },
        { label: t("howItWorks"), href: "/#how-it-works" },
        { label: t("courses"), href: "/#modules" },
        { label: t("contact"), href: "/#contact" },
        { label: t("tracks"), href: "/tracks" },
    ];

    const linkClass = (href: string) =>
        `text-sm font-medium transition-colors ${isActive(href, pathname)
            ? "text-[#6c3aff] font-semibold"
            : "text-[#64748b] hover:text-[#6c3aff]"
        }`;

    const mobileLinkClass = (href: string) =>
        `text-sm font-medium py-2 transition-colors ${isActive(href, pathname)
            ? "text-[#6c3aff] font-semibold"
            : "text-[#64748b] hover:text-[#6c3aff]"
        }`;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e2e8f0] shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-[#6c3aff] flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-[#0f172a]">إديوستار</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={linkClass(link.href)}
                            >
                                {link.label}
                                {isActive(link.href, pathname) && (
                                    <span className="block h-0.5 bg-[#6c3aff] rounded-full mt-0.5" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Auth Buttons & Lang Switcher */}
                    <div className="hidden md:flex items-center gap-4">
                        <LanguageSwitcher />
                        <div className="h-6 w-px bg-[#e2e8f0]" />
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href={`/${locale}/dashboard`}
                                    className="text-sm font-medium text-[#6c3aff] hover:underline"
                                >
                                    {t("welcome", { name: user?.name })}
                                </Link>
                                <button
                                    type="button"
                                    onClick={logout}
                                    className="text-sm font-medium text-[#64748b] hover:text-[#ef4444] transition-colors"
                                >
                                    {t("logout")}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="text-sm font-medium text-[#64748b] hover:text-[#6c3aff] transition-colors px-4 py-2"
                                >
                                    {t("login")}
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="text-sm font-medium text-white bg-[#6c3aff] hover:bg-[#5228e8] transition-colors px-4 py-2 rounded-lg"
                                >
                                    {t("signup")}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        className="md:hidden p-2 rounded-lg text-[#64748b] hover:bg-[#f8fafc]"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={t("navbar.toggleMenu") || "toggle menu"}
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-[#e2e8f0] px-4 py-4">
                    <nav className="flex flex-col gap-3 mb-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={mobileLinkClass(link.href)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex flex-col gap-3 pt-3 border-t border-[#e2e8f0]">
                        <div className="flex justify-center">
                            <LanguageSwitcher />
                        </div>
                        {isAuthenticated ? (
                            <button
                                type="button"
                                onClick={() => { logout(); setIsOpen(false); }}
                                className="text-sm font-medium text-[#ef4444] py-2 text-center"
                            >
                                {t("logout")}
                            </button>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    onClick={() => setIsOpen(false)}
                                    className="text-sm font-medium text-center text-[#6c3aff] border border-[#6c3aff] py-2 rounded-lg"
                                >
                                    {t("login")}
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    onClick={() => setIsOpen(false)}
                                    className="text-sm font-medium text-center text-white bg-[#6c3aff] py-2 rounded-lg"
                                >
                                    {t("signup")}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>

    );
}
