"use client";

import { useState, useRef } from "react";
import {
    User, Mail, Phone, Camera, Save, Loader2,
    Sun, Moon, Monitor, Palette, Check, Languages
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useTheme, ACCENT_COLORS } from "@/contexts/theme-context";
import type { ThemeMode } from "@/contexts/theme-context";
import { useTranslations } from "next-intl";
import { updateProfile } from "@/entities/auth/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "profile" | "themes" | "language";

const MODE_OPTIONS: { id: ThemeMode; label: string; icon: React.ElementType }[] = [
    { id: "light", label: "light", icon: Sun },
    { id: "dark", label: "dark", icon: Moon },
    { id: "system", label: "system", icon: Monitor },
];

// ─── Shared input class ───────────────────────────────────────────────────────

const inputCls =
    "w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm";

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab() {
    const t = useTranslations("Dashboard.settings");
    const { user, refreshProfile } = useAuth();

    const [form, setForm] = useState({
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((p) => ({ ...p, [e.target.id]: e.target.value }));
    }

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            await updateProfile({
                name: form.name,
                email: form.email,
                phone: form.phone || undefined,
                avatar: avatarFile || undefined,
            });
            await refreshProfile();
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch {
            setError("حدث خطأ أثناء الحفظ، حاول مرة أخرى.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSave} className="space-y-8">
            {/* Avatar */}
            <div className="flex items-center gap-6">
                <div className="relative">
                    {avatarPreview ? (
                        <img
                            src={avatarPreview}
                            alt="avatar"
                            className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {user?.name?.[0] ?? "؟"}
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="absolute -bottom-2 -left-2 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary-dark transition-colors"
                    >
                        <Camera className="w-3.5 h-3.5" />
                    </button>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml,image/webp"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />
                </div>
                <div>
                    <p className="font-bold text-foreground">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${user?.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                        }`}>
                        {user?.status === "ACTIVE" ? t("active") : t("inactive")}
                    </span>
                </div>
            </div>

            {/* Fields */}
            <div className="grid sm:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-bold text-foreground mb-2">
                        <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {t("fullName")}</span>
                    </label>
                    <input id="name" type="text" value={form.name} onChange={handleChange} className={inputCls} />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-foreground mb-2">
                        <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {t("phoneNumber")}</span>
                    </label>
                    <input id="phone" type="tel" value={form.phone ?? ""} onChange={handleChange} className={inputCls} dir="ltr" />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-bold text-foreground mb-2">
                        <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {t("email")}</span>
                    </label>
                    <input id="email" type="email" value={form.email} onChange={handleChange} className={inputCls} dir="ltr" />
                </div>
            </div>

            {/* Stats */}
            <div className="bg-muted rounded-2xl p-5 flex items-center gap-6">
                <div className="text-center">
                    <p className="text-2xl font-extrabold text-primary">
                        {user?.totalCategorySubscription ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">{t("subscribedTracks")}</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                    <p className="text-2xl font-extrabold text-foreground">#{user?.userId}</p>
                    <p className="text-xs text-muted-foreground">{t("accountId")}</p>
                </div>
            </div>

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md"
            >
                {saving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> {t("saving")}</>
                ) : saved ? (
                    <><Check className="w-4 h-4" /> {t("saved")}</>
                ) : (
                    <><Save className="w-4 h-4" /> {t("saveChanges")}</>
                )}
            </button>
        </form>
    );
}

// ─── Themes Tab ───────────────────────────────────────────────────────────────

function ThemesTab() {
    const t = useTranslations("Dashboard.settings");
    const { mode, accent, changeMode, changeAccent } = useTheme();

    return (
        <div className="space-y-8">
            {/* Mode */}
            <div>
                <h3 className="font-bold text-foreground mb-1">{t("displayMode")}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t("displayModeDesc")}</p>
                <div className="grid grid-cols-3 gap-3">
                    {MODE_OPTIONS.map(({ id, label, icon: Icon }) => {
                        const active = mode === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => changeMode(id)}
                                className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${active
                                    ? "border-primary bg-primary-light"
                                    : "border-border bg-card hover:border-primary/40"
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                    }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className={`text-sm font-semibold ${active ? "text-primary" : "text-foreground"}`}>
                                    {t(label)}
                                </span>
                                {active && <Check className="w-4 h-4 text-primary" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Accent */}
            <div>
                <h3 className="font-bold text-foreground mb-1">{t("accentColor")}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t("accentColorDesc")}</p>
                <div className="flex flex-wrap gap-3">
                    {ACCENT_COLORS.map((color) => {
                        const active = accent === color.id;
                        return (
                            <button
                                key={color.id}
                                type="button"
                                onClick={() => changeAccent(color.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${active
                                    ? "border-primary bg-primary-light"
                                    : "border-border bg-card hover:border-primary/40"
                                    }`}
                            >
                                <span className={`w-5 h-5 rounded-full ${color.preview} shadow-sm flex items-center justify-center`}>
                                    {active && <Check className="w-3 h-3 text-white" />}
                                </span>
                                <span className={`text-sm font-semibold ${active ? "text-primary" : "text-foreground"}`}>
                                    {color.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Preview */}
            <div>
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <Palette className="w-4 h-4" /> {t("themePreview")}
                </h3>
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm">أ</div>
                        <div>
                            <p className="font-bold text-foreground text-sm">أحمد محمد</p>
                            <p className="text-xs text-muted-foreground">{t("featuredStudent")}</p>
                        </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-primary rounded-full" />
                    </div>
                    <div className="flex gap-2">
                        <button type="button" className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg">
                            {t("primaryButton")}
                        </button>
                        <button type="button" className="px-4 py-2 bg-muted text-foreground text-xs font-bold rounded-lg border border-border">
                            {t("secondaryButton")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Language Tab ──────────────────────────────────────────────────────────────

function LanguageTab() {
    const t = useTranslations("Dashboard.settings");
    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-bold text-foreground mb-1">{t("language")}</h3>
                <p className="text-sm text-muted-foreground mb-6">{t("languageDesc")}</p>
                {/* <div className="bg-muted/30 p-6 rounded-2xl border border-border">
                    <LanguageSwitcher />
                </div> */}
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
    const t = useTranslations("Dashboard.settings");
    const [activeTab, setActiveTab] = useState<Tab>("profile");

    const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
        { id: "profile", label: t("profile"), icon: User },
        { id: "themes", label: t("theme"), icon: Palette },
        { id: "language", label: t("language"), icon: Languages },
    ];

    return (
        <div className="w-full max-w-3xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-foreground">{t("title")}</h1>
                <p className="text-sm text-muted-foreground mt-1">{t("titleDesc")}</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-muted p-1 rounded-xl mb-8 w-fit">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setActiveTab(id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === id
                            ? "bg-card text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
                {activeTab === "profile" ? <ProfileTab /> : activeTab === "themes" ? <ThemesTab /> : <LanguageTab />}
            </div>
        </div>
    );
}
