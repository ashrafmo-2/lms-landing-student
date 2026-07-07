"use client";

import {
  BookOpen,
  ChevronDown,
  ClipboardList,
  CreditCard,
  GraduationCap,
  Home,
  Layers,
  LogOut,
  Menu,
  Phone,
  Presentation,
  Trophy,
  User,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "@/shared/i18n/routing";
import { stripLocale } from "@/shared/lib/strip-locale";
import { LanguageSwitcher } from "@/shared/ui/language-switcher";

function isActive(href: string, pathname: string): boolean {
  if (href.includes("#")) return false;

  const cleanHref = stripLocale(href);
  const cleanPath = stripLocale(pathname);

  if (cleanHref === "/") return cleanPath === "/" || cleanPath === "";

  return cleanPath === cleanHref || cleanPath.startsWith(`${cleanHref}/`);
}

function UserAvatar({
  name,
  avatar,
  size = "sm",
}: {
  name: string;
  avatar?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const dim =
    size === "sm"
      ? "w-8 h-8 text-xs"
      : size === "md"
        ? "w-10 h-10 text-sm"
        : "w-14 h-14 text-base";

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${dim} object-cover ring-2 ring-[#0067b8]/25`}
      />
    );
  }

  return (
    <div
      className={`${dim} bg-linear-to-br from-[#0067b8] to-[#00a6a6] flex items-center justify-center text-white font-bold shrink-0`}
    >
      {name?.[0] ?? "؟"}
    </div>
  );
}

function UserDropdown({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth();
  const t = useTranslations("Landing.navbar");
  const pathname = usePathname();

  const menuItems = [
    { icon: User, label: t("dropdown.profile"), href: "/profile" },
    { icon: BookOpen, label: t("dropdown.myCourses"), href: "/courses" },
    { icon: ClipboardList, label: t("dropdown.exams"), href: "/exams" },
    { icon: Trophy, label: t("dropdown.achievements"), href: "/achievements" },
    {
      icon: CreditCard,
      label: t("dropdown.subscriptions"),
      href: "/subscriptions",
    },
    { icon: Presentation, label: "Workshops", href: "/dashboard/workshops" },
  ];

  return (
    <div className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden border border-[#d9e3ee] bg-white shadow-xl">
      <div className="border-b border-[#edf2f7] bg-[#f8fbfd] px-4 py-3">
        <p className="text-sm font-bold text-[#0f172a] truncate">
          {user?.name}
        </p>
        <p className="text-xs text-[#64748b] truncate">{user?.email}</p>
      </div>
      <div className="py-1">
        {menuItems.map(({ icon: Icon, label, href }) => {
          const active = isActive(href, pathname);

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors group ${
                active
                  ? "bg-[#e8f4ff] text-[#0067b8] font-semibold"
                  : "text-[#374151] hover:bg-[#f8fbfd] hover:text-[#0067b8]"
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  active
                    ? "text-[#0067b8]"
                    : "text-[#9ca3af] group-hover:text-[#0067b8]"
                }`}
              />
              {label}
            </Link>
          );
        })}
      </div>
      <div className="border-t border-[#f1f5f9] py-1">
        <button
          type="button"
          onClick={() => {
            logout();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#ef4444] hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {t("logout")}
        </button>
      </div>
    </div>
  );
}

function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations("Landing.navbar");
  const tCommon = useTranslations("Common");
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const isRtl = locale === "ar";

  const navLinks = [
    { icon: Home, label: t("home"), href: "/" },
    { icon: Layers, label: t("tracks"), href: "/tracks" },
    {
      icon: Presentation,
      label: locale === "ar" ? "الوركشوبات" : "Workshops",
      href: "/workshops",
    },
    { icon: BookOpen, label: t("courses"), href: "/#modules" },
    { icon: Phone, label: t("contact"), href: "/#contact" },
  ];

  const accountLinks = [
    {
      icon: Presentation,
      label: locale === "ar" ? "وركشوباتي" : "My workshops",
      href: "/dashboard/workshops",
    },
    { icon: User, label: t("dropdown.profile"), href: "/profile" },
    { icon: BookOpen, label: t("dropdown.myCourses"), href: "/courses" },
    { icon: ClipboardList, label: t("dropdown.exams"), href: "/exams" },
    { icon: Trophy, label: t("dropdown.achievements"), href: "/achievements" },
    {
      icon: CreditCard,
      label: t("dropdown.subscriptions"),
      href: "/subscriptions",
    },
  ];

  const activeLinkClass = "bg-[#e8f4ff] text-[#0067b8] font-semibold";
  const inactiveLinkClass =
    "text-[#374151] hover:bg-[#f8fbfd] hover:text-[#0067b8]";

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed top-0 ${isRtl ? "right-0" : "left-0"} h-full w-80 max-w-[85vw] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          open
            ? "translate-x-0"
            : isRtl
              ? "translate-x-full"
              : "-translate-x-full"
        }`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0067b8] flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-[#0f172a]">
              {tCommon("brandName")}
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 bg-[#eef3f8] hover:bg-[#d9e3ee] flex items-center justify-center transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
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
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                    isActive(href, pathname)
                      ? activeLinkClass
                      : inactiveLinkClass
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {isAuthenticated ? (
            <div>
              <div className="mb-3 flex items-center gap-3 border border-[#d9e3ee] bg-linear-to-br from-[#f8fbfd] to-[#e8f4ff] p-3">
                <UserAvatar
                  name={user?.name ?? ""}
                  avatar={user?.avatar}
                  size="lg"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#0f172a] truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-[#64748b] truncate">
                    {user?.email}
                  </p>
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
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                      isActive(href, pathname)
                        ? activeLinkClass
                        : inactiveLinkClass
                    }`}
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
                className="flex w-full items-center justify-center border-2 border-[#0067b8] py-2.5 text-sm font-semibold text-[#0067b8] transition-colors hover:bg-[#e8f4ff]"
              >
                {t("login")}
              </Link>
              <Link
                href="/auth/signup"
                onClick={onClose}
                className="flex w-full items-center justify-center bg-[#0067b8] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004a86]"
              >
                {t("signup")}
              </Link>
            </div>
          )}
        </div>

        {isAuthenticated && (
          <div className="shrink-0 px-4 py-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
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

export function Navbar() {
  const t = useTranslations("Landing.navbar");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { label: t("features"), href: "/#features" },
    { label: t("howItWorks"), href: "/#how-it-works" },
    { label: locale === "ar" ? "الوركشوبات" : "Workshops", href: "/workshops" },
    { label: t("courses"), href: "/#modules" },
    { label: t("contact"), href: "/#contact" },
    { label: t("tracks"), href: "/tracks" },
  ];

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      isActive(href, pathname)
        ? "text-[#0067b8] font-semibold"
        : "text-[#64748b] hover:text-[#0067b8]"
    }`;

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#d9e3ee] bg-white/86 shadow-sm backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#0067b8] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#0f172a]">
                {tCommon("brandName")}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClass(link.href)}
                >
                  {link.label}
                  {isActive(link.href, pathname) && (
                    <span className="mt-0.5 block h-0.5 bg-[#0067b8]" />
                  )}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {/* <LanguageSwitcher /> */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((value) => !value)}
                    className="flex items-center gap-2 px-2 py-1.5 transition-colors hover:bg-[#e8f4ff]"
                  >
                    <UserAvatar name={user?.name ?? ""} avatar={user?.avatar} />
                    <span className="text-sm font-medium text-[#0f172a] max-w-24 truncate">
                      {user?.name}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#64748b] transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
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
                    className="px-4 py-2 text-sm font-medium text-[#64748b] transition-colors hover:text-[#0067b8]"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-[#0067b8] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#004a86]"
                  >
                    {t("signup")}
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-[#64748b] hover:bg-[#f8fafc] transition-colors"
              onClick={() => setDrawerOpen(true)}
              aria-label={locale === "ar" ? "فتح القائمة" : "Open menu"}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
