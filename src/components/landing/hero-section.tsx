"use client";

import { Link } from "@/shared/i18n/routing";
import { Play, Star, Trophy, TrendingUp, Download, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getHeroStats, type HeroStats } from "@/entities/hero/api";
import { useTranslations } from "next-intl";

function formatCount(n: number): string {
    if (n >= 1000) return `${Math.floor(n / 1000)}k+`;
    return `${n}+`;
}

export function HeroSection() {
    const t = useTranslations("Landing.hero");
    const [stats, setStats] = useState<HeroStats | null>(null);

    useEffect(() => {
        getHeroStats()
            .then(setStats)
            .catch(() => {
                // silently fall back to static values
            });
    }, []);

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-br from-[#f5f3ff] via-white to-[#ede9ff]"
        >
            {/* Background blobs */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-[#6c3aff]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 left-0 w-80 h-80 bg-[#f97316]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Text */}
                    <div className="space-y-6">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-[#ede9ff] text-[#6c3aff] text-sm font-medium px-4 py-2 rounded-full">
                            <Star className="w-4 h-4 fill-[#6c3aff]" />
                            {t("title").split(" ")[0]} ...
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0f172a] leading-tight">
                            {t("title")}
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-[#64748b] leading-relaxed max-w-lg">
                            {t("subtitle")}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/#courses"
                                className="inline-flex items-center gap-2 bg-[#6c3aff] hover:bg-[#5228e8] text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#6c3aff]/30 hover:shadow-[#6c3aff]/50 hover:-translate-y-0.5"
                            >
                                {t("browseCourses")}
                                <TrendingUp className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/#how-it-works"
                                className="inline-flex items-center gap-2 bg-white hover:bg-[#f8fafc] text-[#0f172a] font-semibold px-6 py-3 rounded-xl border border-[#e2e8f0] transition-all hover:-translate-y-0.5"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#6c3aff]/10 flex items-center justify-center">
                                    <Play className="w-3 h-3 text-[#6c3aff] fill-[#6c3aff] mr-[-2px]" />
                                </div>
                                {t("getStarted")}
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-6 pt-4">
                            <div className="text-center">
                                <p className="text-2xl font-extrabold text-[#0f172a]">
                                    {stats ? formatCount(stats.totalStudents) : "15k+"}
                                </p>
                                <p className="text-sm text-[#64748b]">{t("stats.students")}</p>
                            </div>
                            <div className="w-px bg-[#e2e8f0]" />
                            <div className="text-center">
                                <p className="text-2xl font-extrabold text-[#0f172a]">
                                    {stats ? formatCount(stats.totalCategories) : "45+"}
                                </p>
                                <p className="text-sm text-[#64748b]">{t("stats.courses")}</p>
                            </div>
                            <div className="w-px bg-[#e2e8f0]" />
                            <div className="text-center">
                                <div className="flex items-center gap-1 justify-center">
                                    <p className="text-2xl font-extrabold text-[#0f172a]">4.9</p>
                                    <Star className="w-5 h-5 text-[#f97316] fill-[#f97316]" />
                                </div>
                                <p className="text-sm text-[#64748b]">{t("stats.rating")}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Dashboard Card */}
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-sm">
                            {/* Main Card */}
                            <div className="bg-white rounded-2xl shadow-2xl p-5 border border-[#e2e8f0]">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex -space-x-2 rtl:space-x-reverse">
                                        {["bg-[#6c3aff]", "bg-[#f97316]", "bg-[#06b6d4]"].map((color, i) => (
                                            <div
                                                key={i}
                                                className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
                                            >
                                                {(t.raw("dashboard.sampleInitials") as string[])[i]}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1 bg-[#ede9ff] text-[#6c3aff] text-xs font-semibold px-3 py-1 rounded-full">
                                        <Trophy className="w-3 h-3" />
                                        {t("dashboard.rank", { rank: 3 })}
                                    </div>
                                </div>

                                {/* Student Info */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6c3aff] to-[#f97316] flex items-center justify-center text-white font-bold">
                                        {(t.raw("dashboard.sampleInitials") as string[])[0]}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#0f172a] text-sm">{t("dashboard.sampleUser")}</p>
                                        <p className="text-xs text-[#64748b]">{t("dashboard.weeklyRank", { rank: 3 })}</p>
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs text-[#64748b] mb-1">
                                        <span>{t("dashboard.courseProgress")}</span>
                                        <span className="font-semibold text-[#6c3aff]">75%</span>
                                    </div>
                                    <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#6c3aff] to-[#06b6d4] rounded-full transition-all"
                                            style={{ width: "75%" }}
                                        />
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-[#f0fdf4] rounded-xl p-2 text-center">
                                        <CheckCircle className="w-4 h-4 text-[#22c55e] mx-auto mb-1" />
                                        <p className="text-xs font-medium text-[#22c55e]">{t("dashboard.completed")}</p>
                                    </div>
                                    <div className="flex-1 bg-[#fff7ed] rounded-xl p-2 text-center">
                                        <Star className="w-4 h-4 text-[#f97316] fill-[#f97316] mx-auto mb-1" />
                                        <p className="text-xs font-medium text-[#f97316]">{t("dashboard.featured")}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating: Offline Badge */}
                            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg border border-[#e2e8f0] px-3 py-2 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-[#ede9ff] flex items-center justify-center">
                                    <Download className="w-4 h-4 text-[#6c3aff]" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-[#0f172a]">{t("dashboard.downloaded")}</p>
                                    <p className="text-xs text-[#64748b]">{t("dashboard.offlineAvailable")}</p>
                                </div>
                            </div>

                            {/* Floating: Score Badge */}
                            <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg border border-[#e2e8f0] px-3 py-2 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-[#fff7ed] flex items-center justify-center text-lg">
                                    🎉
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-[#0f172a]">{t("dashboard.examResult")}</p>
                                    <p className="text-xs text-[#f97316] font-bold">98/100</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
