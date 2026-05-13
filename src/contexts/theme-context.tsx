"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";
type ThemeAccent = "violet" | "purple" | "blue" | "teal" | "rose";

export const ACCENT_COLORS: { id: ThemeAccent; label: string; primary: string; preview: string }[] = [
    { id: "violet", label: "بنفسجي", primary: "#6c3aff", preview: "bg-[#6c3aff]" },
    { id: "purple", label: "أرجواني", primary: "#7c3aed", preview: "bg-[#7c3aed]" },
    { id: "blue", label: "أزرق", primary: "#2563eb", preview: "bg-[#2563eb]" },
    { id: "teal", label: "زيتي", primary: "#0d9488", preview: "bg-[#0d9488]" },
    { id: "rose", label: "وردي", primary: "#e11d48", preview: "bg-[#e11d48]" },
];

interface ThemeContextType {
    mode: ThemeMode;
    accent: ThemeAccent;
    changeMode: (m: ThemeMode) => void;
    changeAccent: (a: ThemeAccent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyTheme(mode: ThemeMode, accent: ThemeAccent) {
    const root = document.documentElement;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = mode === "dark" || (mode === "system" && prefersDark);

    root.setAttribute("data-dark", isDark ? "true" : "false");

    root.setAttribute("data-theme", accent);

    root.style.removeProperty("--primary");
    root.style.removeProperty("--primary-dark");
    root.style.removeProperty("--ring");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>("light");
    const [accent, setAccent] = useState<ThemeAccent>("violet");

    // Apply saved theme on mount
    useEffect(() => {
        const savedMode = (localStorage.getItem("theme-mode") as ThemeMode) || "light";
        const savedAccent = (localStorage.getItem("theme-accent") as ThemeAccent) || "violet";
        setMode(savedMode);
        setAccent(savedAccent);
        applyTheme(savedMode, savedAccent);

        // Re-apply when system preference changes (for "system" mode)
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => {
            const currentMode = (localStorage.getItem("theme-mode") as ThemeMode) || "light";
            if (currentMode === "system") applyTheme("system", savedAccent);
        };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    const changeMode = useCallback((m: ThemeMode) => {
        setMode(m);
        localStorage.setItem("theme-mode", m);
        applyTheme(m, accent);
    }, [accent]);

    const changeAccent = useCallback((a: ThemeAccent) => {
        setAccent(a);
        localStorage.setItem("theme-accent", a);
        applyTheme(mode, a);
    }, [mode]);

    return (
        <ThemeContext.Provider value={{ mode, accent, changeMode, changeAccent }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}
