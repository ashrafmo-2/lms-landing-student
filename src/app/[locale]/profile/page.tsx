"use client";

import { useState, useRef, useEffect } from "react";
import { User, Mail, Phone, Camera, Save, Loader2, Sun, Moon, Monitor, Palette, Check, ArrowRight, ShieldCheck, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useTheme, ACCENT_COLORS } from "@/contexts/theme-context";
import type { ThemeMode } from "@/contexts/theme-context";
import { useTranslations, useLocale } from "next-intl";
import { updateProfile, changePassword } from "@/entities/auth/api";
import { Navbar } from "@/widgets/landing-navbar";
import { Footer } from "@/widgets/landing-footer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProfileTab } from "@/features/auth/components/profile-tab";

type Tab = "profile" | "security" | "themes" | "language";

const MODE_OPTIONS: { id: ThemeMode; label: string; icon: React.ElementType }[] = [
    { id: "light", label: "light", icon: Sun },
    { id: "dark", label: "dark", icon: Moon },
    { id: "system", label: "system", icon: Monitor },
];





function SecurityTab() {
    const { logout } = useAuth();
    const locale = useLocale();
    const router = useRouter();

    const [form, setForm] = useState({
        currentPassword: "",
        password: "",
        confirmPassword: "",
    });
    const [show, setShow] = useState({ current: false, new: false, confirm: false });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((p) => ({ ...p, [e.target.id]: e.target.value }));
        setError(null);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (form.password !== form.confirmPassword) { setError("كلمتا المرور غير متطابقتين"); return; }
        if (form.password.length < 8) { setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل"); return; }

        setSaving(true);
        try {
            await changePassword({ currentPassword: form.currentPassword, password: form.password });
            setSuccess(true);
            setTimeout(async () => { await logout(); router.replace(`/${locale}/auth/login`); }, 2000);
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(msg || "كلمة المرور الحالية غير صحيحة");
        } finally {
            setSaving(false);
        }
    }

    const fieldCls = "w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm";

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-foreground">تم تغيير كلمة المرور بنجاح ✅</h3>
                <p className="text-sm text-muted-foreground">سيتم تسجيل خروجك وإعادة توجيهك لتسجيل الدخول...</p>
                <Loader2 className="w-5 h-5 text-primary animate-spin mt-2" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            {/* Warning banner */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">بعد تغيير كلمة المرور سيتم تسجيل خروجك من جميع الأجهزة تلقائياً.</p>
            </div>

            {/* Current password */}
            <div>
                <label htmlFor="currentPassword" className="block text-sm font-bold text-foreground mb-2">
                    <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> كلمة المرور الحالية</span>
                </label>
                <div className="relative">
                    <input id="currentPassword" type={show.current ? "text" : "password"} value={form.currentPassword} onChange={handleChange} placeholder="••••••••" className={fieldCls} required />
                    <button type="button" onClick={() => setShow((s) => ({ ...s, current: !s.current }))} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {show.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* New password */}
            <div>
                <label htmlFor="password" className="block text-sm font-bold text-foreground mb-2">
                    <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> كلمة المرور الجديدة</span>
                </label>
                <div className="relative">
                    <input id="password" type={show.new ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="••••••••" className={fieldCls} required />
                    <button type="button" onClick={() => setShow((s) => ({ ...s, new: !s.new }))} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {show.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                <div className="flex gap-3 mt-2">
                    {[
                        { ok: form.password.length >= 8, label: "8 أحرف" },
                        { ok: /[a-zA-Z]/.test(form.password), label: "حروف" },
                        { ok: /\d/.test(form.password), label: "أرقام" },
                    ].map(({ ok, label }) => (
                        <span key={label} className={`text-xs font-medium flex items-center gap-1 ${ok ? "text-green-600" : "text-muted-foreground"}`}>
                            <Check className={`w-3 h-3 ${ok ? "opacity-100" : "opacity-30"}`} /> {label}
                        </span>
                    ))}
                </div>
            </div>

            {/* Confirm password */}
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-foreground mb-2">
                    <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> تأكيد كلمة المرور</span>
                </label>
                <div className="relative">
                    <input
                        id="confirmPassword"
                        type={show.confirm ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`${fieldCls} ${form.confirmPassword && form.confirmPassword !== form.password ? "border-red-400 focus:border-red-400" : ""}`}
                        required
                    />
                    <button type="button" onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {show.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                {form.confirmPassword && form.confirmPassword !== form.password && (
                    <p className="text-red-500 text-xs mt-1">كلمتا المرور غير متطابقتين</p>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={saving || !form.currentPassword || !form.password || !form.confirmPassword}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md"
            >
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري الحفظ...</> : <><ShieldCheck className="w-4 h-4" /> تغيير كلمة المرور</>}
            </button>
        </form>
    );
}

function ThemesTab() {
    const t = useTranslations("Dashboard.settings");
    const { mode, accent, changeMode, changeAccent } = useTheme();

    return (
        <div className="space-y-8">
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
                                className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${active ? "border-primary bg-primary-light" : "border-border bg-card hover:border-primary/40"
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
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${active ? "border-primary bg-primary-light" : "border-border bg-card hover:border-primary/40"
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

function LanguageTab() {
    const t = useTranslations("Dashboard.settings");
    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-bold text-foreground mb-1">{t("language")}</h3>
                <p className="text-sm text-muted-foreground mb-6">{t("languageDesc")}</p>
            </div>
        </div>
    );
}


export default function ProfilePage() {
    const t = useTranslations("Dashboard.settings");
    const locale = useLocale();
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>("profile");

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace(`/${locale}/auth/login`);
        }
    }, [isAuthenticated, isLoading, router, locale]);

    const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
        { id: "profile", label: t("profile"), icon: User },
        { id: "security", label: t("security"), icon: ShieldCheck },
        // { id: "themes", label: t("theme"), icon: Palette },
        // { id: "language", label: t("language"), icon: Languages },
    ];

    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <div className="flex-1 pt-24 pb-16 bg-muted">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8" dir="rtl">
                        <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
                        <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                        <span className="text-foreground font-medium">{t("title")}</span>
                    </nav>

                    {/* Header */}
                    <div className="mb-8" dir="rtl">
                        <h1 className="text-2xl font-extrabold text-foreground">{t("title")}</h1>
                        <p className="text-sm text-muted-foreground mt-1">{t("titleDesc")}</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 bg-card border border-border p-1 rounded-xl mb-6 w-fit shadow-sm" dir="rtl">
                        {tabs.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setActiveTab(id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === id
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="bg-card rounded-2xl border border-border shadow-sm p-8" dir="rtl">
                        {activeTab === "profile" && <ProfileTab />}
                        {activeTab === "security" && <SecurityTab />}
                        {activeTab === "themes" && <ThemesTab />}
                        {activeTab === "language" && <LanguageTab />}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}