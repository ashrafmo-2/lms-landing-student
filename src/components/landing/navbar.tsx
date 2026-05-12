"use client";

import { GraduationCap, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";

const navLinks = [
  { label: "الرئيسية", href: "/#hero" },
  { label: "المميزات", href: "/#features" },
  { label: "الكورسات", href: "/#modules" },
  { label: "كيف تعمل؟", href: "/#how-it-works" },
  { label: "تواصل معنا", href: "/#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e2e8f0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16" dir="rtl">
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
                className="text-sm font-medium text-[#64748b] hover:text-[#6c3aff] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard/products"
                  className="text-sm font-medium text-[#6c3aff] hover:underline"
                >
                  مرحباً، {user?.name}
                </Link>
                <button
                    type="button"
                    onClick={logout}
                    className="text-sm font-medium text-[#64748b] hover:text-[#ef4444] transition-colors"
                >
                    تسجيل الخروج
                </button>
                </>
                ) : (
                <>
                <Link
                    href="/auth/login"
                    className="text-sm font-medium text-[#64748b] hover:text-[#6c3aff] transition-colors px-4 py-2"
                >
                    تسجيل الدخول
                </Link>
                <Link
                    href="/auth/signup"
                    className="text-sm font-medium text-white bg-[#6c3aff] hover:bg-[#5228e8] transition-colors px-4 py-2 rounded-lg"
                >
                    ابدأ مجاناً
                </Link>
                </>
                )}
                </div>

                {/* Mobile Menu Button */}
                <button
                type="button"
                className="md:hidden p-2 rounded-lg text-[#64748b] hover:bg-[#f8fafc]"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="toggle menu"
                >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                <div className="md:hidden bg-white border-t border-[#e2e8f0] px-4 py-4" dir="rtl">
                <nav className="flex flex-col gap-3 mb-4">
                {navLinks.map((link) => (
                <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-[#64748b] hover:text-[#6c3aff] py-2"
                >
                {link.label}
                </Link>
                ))}
                </nav>
                <div className="flex flex-col gap-2 pt-3 border-t border-[#e2e8f0]">
                {isAuthenticated ? (
                <button
                type="button"
                onClick={() => { logout(); setIsOpen(false); }}
                className="text-sm font-medium text-[#ef4444] py-2 text-right"
                >
                تسجيل الخروج
                </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-center text-[#6c3aff] border border-[#6c3aff] py-2 rounded-lg"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-center text-white bg-[#6c3aff] py-2 rounded-lg"
                >
                  ابدأ مجاناً
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
