"use client";

import {
    GraduationCap, Menu, X,
    User, BookOpen, ClipboardList, Trophy, CreditCard, LogOut, ChevronDown,
    Home, Layers, Phone,
} from "lucide-react";
import { Link } from "@/shared/i18n/routing";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useLocale, useTranslations } from "next-intl";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * next-intl's usePathname strips the locale prefix, so pathname is always
 * like "/tracks" or "/", never "/ar/tracks".
 * We normalise both sides to be locale-free before comparing.
 *
 * Hash links (/#features, /#contact …) are never "active" — only the plain
 * Home link "/" gets the active state when the user is on the home page.
 */
function stripLocale(path: string): string {
    return path.replace(/^\/(ar|en|it)(\/|$)/, "/");
}

function isActive(href: string, pathname: string): boolean {
    // Hash anchor links are never highlighted as active
    if (href.includes("#")) return false;

    const cleanHref = stripLocale(href);
    const cleanPath = stripLocale(pathname);

    if (cleanHref === "/") return cleanPath === "/" || cleanPath === "";

    return cleanPath === cleanHref || cleanPath.startsWith(`${cleanHref}/`);
}

// ─── User Avatar ──────────────────────────────────────────────────────────────

function UserAvatar({ name, avatar, size = "sm" }: { name: string; avatar?: string | null; size?: "sm" | "md" | "lg" }) {
    const dim = size === "sm" ? "w-8 h-8 text-xs" : size === "md" ? "w-10 h-10 text-sm" : "w-14 h-14 text-base";
    if (avatar) {
        return (
            <img
                src={avatar}
                alt={name}
                className={`${dim} rounded-full object-cover ring-2 ring-[#6c3aff]/30`}
            />
        );
    }
    return (
        <div className={`${dim} rounded-full bg-linear-to-br from-[#6c3aff] to-[#f97316] flex items-center justify-center text-white font-bold shrink-0`}>
            {name?.[0] ?? "؟"}
        </div>
    );
}

// ─── User Dropdown (desktop) ──────────────────────────────────────────────────

function UserDropdown({ onClose }: { onClose: () => void }) {
    const { user, logout } = useAuth();
    const t = useTranslations("Landing.navbar");

    const menuItems = [
        { icon: User, label: t("dropdown.profile"), href: `/profile` },
        { icon: BookOpen, label: t("dropdown.myCourses"), href: `/courses` },
        { icon: ClipboardList, label: t("dropdown.exams"), href: `/exams` },
        { icon: Trophy, label: t("dropdown.achievements"), href: `/achievements` },
        { icon: CreditCard, label: t("dropdown.subscriptions"), href: `/subscriptions` },
    ];

    return (
        <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#e2e8f0] overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-[#f1f5f9] bg-[#f8fafc]">
                <p className="text-sm font-bold text-[#0f172a] truncate">{user?.name}</p>
                <p className="text-xs text-[#64748b] truncate">{user?.email}</p>
            </div>
            <div className="py-1">
                {menuItems.map(({ icon: Icon, label, href }) => (
                    <Link
                        key={href}
                        href={href}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#f5f3ff] hover:text-[#6c3aff] transition-colors group"
                    >
                        <Icon className="w-4 h-4 text-[#9ca3af] group-hover:text-[#6c3aff] transition-colors" />
                        {label}
                    </Link>
                ))}
            </div>
            <div className="border-t border-[#f1f5f9] py-1">
                <button
                    type="button"
                    onClick={() => { logout(); onClose(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#ef4444] hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    {t("logout")}
                </button>
            </div>
        </div>
    );
}

// ─── Mobile Drawer ────────────────────────────────────────────────────────────

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
    const locale = useLocale();
    const t = useTranslations("Landing.navbar");
    const tCommon = useTranslations("Common");
    const { isAuthenticated, user, logout } = useAuth();
    const pathname = usePathname();

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onClose]);

    const isRtl = locale === "ar";

    const navLinks = [
        { icon: Home, label: t("home"), href: "/" },
        { icon: Layers, label: t("tracks"), href: "/tracks" },
        { icon: BookOpen, label: t("courses"), href: "/#modules" },
        { icon: Phone, label: t("contact"), href: "/#contact" },
    ];

    const accountLinks = [
        { icon: User, label: t("dropdown.profile"), href: "/profile" },
        { icon: BookOpen, label: t("dropdown.myCourses"), href: "/dashboard/courses" },
        { icon: ClipboardList, label: t("dropdown.exams"), href: "/dashboard/exams" },
        { icon: Trophy, label: t("dropdown.achievements"), href: "/dashboard/achievements" },
        { icon: CreditCard, label: t("dropdown.subscriptions"), href: "/dashboard/subscriptions" },
    ];

    const activeLinkClass = "bg-[#f5f3ff] text-[#6c3aff] font-semibold";
    const inactiveLinkClass = "text-[#374151] hover:bg-gray-50 hover:text-[#6c3aff]";

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            />

            {/* Drawer panel */}
            <div
                className={`fixed top-0 ${isRtl ? "right-0" : "left-0"} h-full w-80 max-w-[85vw] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${open ? "translate-x-0" : isRtl ? "translate-x-full" : "-translate-x-full"}`}
                dir={isRtl ? "rtl" : "ltr"}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                    <Link href="/" onClick={onClose} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#6c3aff] flex items-center justify-center">
                            <GraduationCap className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-[#0f172a]">{tCommon("brandName")}</span>
                    </Link>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">

                    {/* Nav links */}
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
                            {t("quickLinks")}
                        </p>
                        <nav className="space-y-1">
                            {navLinks.map(({ icon: Icon, label, href }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={onClose}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${isActive(href, pathname) ? activeLinkClass : inactiveLinkClass}`}
                                >
                                    <Icon className="w-4 h-4 shrink-0" />
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Account section */}
                    {isAuthenticated ? (
                        <div>
                            {/* User card */}
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-linear-to-br from-[#f5f3ff] to-[#ede9ff] mb-3">
                                <UserAvatar name={user?.name ?? ""} avatar={user?.avatar} size="lg" />
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-[#0f172a] truncate">{user?.name}</p>
                                    <p className="text-xs text-[#64748b] truncate">{user?.email}</p>
                                </div>
                            </div>

                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
                                {t("dropdown.profile")}
                            </p>
                            <nav className="space-y-1">
                                {accountLinks.map(({ icon: Icon, label, href }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${isActive(href, pathname) ? activeLinkClass : inactiveLinkClass}`}
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        {label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Link
                                href="/auth/login"
                                onClick={onClose}
                                className="flex items-center justify-center w-full text-sm font-semibold text-[#6c3aff] border-2 border-[#6c3aff] py-2.5 rounded-xl hover:bg-[#f5f3ff] transition-colors"
                            >
                                {t("login")}
                            </Link>
                            <Link
                                href="/auth/signup"
                                onClick={onClose}
                                className="flex items-center justify-center w-full text-sm font-semibold text-white bg-[#6c3aff] hover:bg-[#5228e8] py-2.5 rounded-xl transition-colors"
                            >
                                {t("signup")}
                            </Link>
                        </div>
                    )}
                </div>

                {/* Footer — logout */}
                {isAuthenticated && (
                    <div className="shrink-0 px-4 py-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => { logout(); onClose(); }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            {t("logout")}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
    const locale = useLocale();
    const t = useTranslations("Landing.navbar");
    const tCommon = useTranslations("Common");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const pathname = usePathname();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // next-intl's <Link> prepends the locale automatically — keep hrefs locale-free
    const navLinks = [
        { label: t("home"), href: "/" },
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

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e2e8f0] shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-[#6c3aff] flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-[#0f172a]">{tCommon("brandName")}</span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                                    {link.label}
                                    {isActive(link.href, pathname) && (
                                        <span className="block h-0.5 bg-[#6c3aff] rounded-full mt-0.5" />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Auth */}
                        <div className="hidden md:flex items-center gap-3">
                            {isAuthenticated ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setDropdownOpen((v) => !v)}
                                        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[#f5f3ff] transition-colors"
                                    >
                                        <UserAvatar name={user?.name ?? ""} avatar={user?.avatar} />
                                        <span className="text-sm font-medium text-[#0f172a] max-w-24 truncate">
                                            {user?.name}
                                        </span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-[#64748b] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                    {dropdownOpen && (
                                        <UserDropdown onClose={() => setDropdownOpen(false)} />
                                    )}
                                </div>
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

                        {/* Mobile hamburger */}
                        <button
                            type="button"
                            className="md:hidden p-2 rounded-lg text-[#64748b] hover:bg-[#f8fafc] transition-colors"
                            onClick={() => setDrawerOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile drawer — rendered outside header so it can cover full viewport */}
            <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </>
    );
}
