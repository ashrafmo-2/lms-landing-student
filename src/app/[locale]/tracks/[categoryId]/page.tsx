"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

import { ArrowRight, BookOpen, ClipboardList, Layers, PlayCircle, CheckCircle, Tag, Users } from "lucide-react";
import { getCategoryById, type CategoryDetail, type Subject } from "@/entities/categories/api";
import { Navbar } from "@/widgets/landing-navbar";
import { Footer } from "@/widgets/landing-footer";
import { Skeleton } from "@/features/category-details/components/loading-skeleton";
import { SubjectCard } from "@/features/category-details/components/subject-card";
import { SubjectDrawer } from "@/features/category-details/components/subject-drawer";

const GRADIENTS = [
    "from-blue-600 to-blue-900",
    "from-purple-600 to-indigo-900",
    "from-teal-500 to-emerald-800",
    "from-rose-500 to-pink-900",
    "from-orange-500 to-amber-800",
    "from-cyan-500 to-sky-800",
];

export default function CategoryDetailPage() {
    const t = useTranslations("Tracks");
    const tLanding = useTranslations("Landing");
    const tCommon = useTranslations("Common");
    const locale = useLocale();
    const { categoryId } = useParams<{ categoryId: string }>();

    const [detail, setDetail] = useState<CategoryDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Pure price formatter — uses locale + currency from translations
    const fmt = (n: number) =>
        `${n.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} ${tCommon("currency")}`;

    useEffect(() => {
        setLoading(true);
        setError(false);
        getCategoryById(Number(categoryId))
            .then(setDetail)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [categoryId]);

    const gradient = GRADIENTS[Number(categoryId) % GRADIENTS.length];
    const effectivePrice = detail?.priceAfterDiscount ?? detail?.priceBeforeDiscount ?? 0;
    const hasDiscount =
        detail?.priceAfterDiscount !== null &&
        detail?.priceAfterDiscount !== undefined &&
        detail.priceBeforeDiscount > detail.priceAfterDiscount;

    const direction = locale === "ar" ? "rtl" : "ltr";

    return (
        <main className="min-h-screen flex flex-col bg-gray-50" dir={direction}>
            <Navbar />

            <div className="grow pt-24 pb-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                        <Link href="/" className="hover:text-[#6c3aff] transition-colors">
                            {tLanding("footer.home")}
                        </Link>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        <Link href={`/${locale}/tracks`} className="hover:text-[#6c3aff] transition-colors">
                            {tLanding("navbar.tracks")}
                        </Link>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        <span className="text-gray-900 font-medium truncate max-w-50">
                            {detail?.name ?? "..."}
                        </span>
                    </nav>

                    {loading ? (
                        <Skeleton />
                    ) : error || !detail ? (
                        <div className="text-center py-24 text-gray-500">{t("notFound")}</div>
                    ) : (
                        <div className="space-y-8">

                            <div className={`bg-linear-to-br ${gradient} rounded-3xl p-8 md:p-12 relative overflow-hidden`}>
                                <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full" />
                                <div className="absolute -left-4 -bottom-4 w-40 h-40 bg-white/5 rounded-full" />

                                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                                    <div className="space-y-3">
                                        <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                                            <Tag className="w-3 h-3" />
                                            {t("integratedTrack")}
                                        </span>
                                        <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                                            {detail.name}
                                        </h1>
                                        {detail.description && (
                                            <p className="text-white/80 text-base max-w-xl leading-relaxed">
                                                {detail.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-1.5 text-white/70 text-sm">
                                            <Users className="w-4 h-4" />
                                            <span>
                                                {detail.totalSubscribers.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}{" "}
                                                {t("subscribers")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-5 shadow-xl shrink-0 min-w-45">
                                        {hasDiscount && (
                                            <p className="text-xs text-gray-400 line-through mb-0.5">
                                                {fmt(detail.priceBeforeDiscount)}
                                            </p>
                                        )}
                                        <p className="text-2xl font-extrabold text-[#6c3aff]">
                                            {fmt(effectivePrice)}
                                        </p>
                                        {hasDiscount && detail.priceAfterDiscount !== null && (
                                            <span className="inline-block mt-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                                {tCommon("save")}{" "}
                                                {fmt(detail.priceBeforeDiscount - detail.priceAfterDiscount)}
                                            </span>
                                        )}
                                        {detail.isSubscribed === 1 ? (
                                            <div className="flex flex-col gap-2 mt-4">
                                                <div className="w-full bg-green-500 text-white font-bold py-2.5 rounded-xl text-sm text-center">
                                                    {t("alreadySubscribed")}
                                                </div>
                                                <Link
                                                    href={(() => {
                                                        const firstSubject = detail.subjects[0];
                                                        const firstLesson =
                                                            firstSubject?.units[0]?.lessons[0] ??
                                                            firstSubject?.units[0]?.subUnits[0]?.lessons[0];
                                                        return `/${locale}/tracks/${categoryId}/lessons/${firstLesson?.lessonId ?? 1}?subjectId=${firstSubject?.subjectId ?? 1}`;
                                                    })()}
                                                    className="w-full bg-[#6c3aff] hover:bg-[#5228e8] text-white font-bold py-2.5 rounded-xl transition-all text-sm text-center shadow-md shadow-[#6c3aff]/30"
                                                >
                                                    {tLanding("hero.getStarted")}
                                                </Link>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                className="mt-4 w-full bg-[#6c3aff] hover:bg-[#5228e8] text-white font-bold py-2.5 rounded-xl transition-all text-sm shadow-md shadow-[#6c3aff]/30"
                                            >
                                                {tCommon("subscribeNow")}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { icon: <BookOpen className="w-5 h-5 text-[#6c3aff]" />, value: detail.totalSubjects, label: t("stats.subject") },
                                    { icon: <Layers className="w-5 h-5 text-[#6c3aff]" />, value: detail.totalUnits, label: t("stats.unit") },
                                    { icon: <PlayCircle className="w-5 h-5 text-[#6c3aff]" />, value: detail.totalLessons, label: t("stats.lesson") },
                                    { icon: <ClipboardList className="w-5 h-5 text-green-500" />, value: detail.totalExams, label: t("stats.exam") },
                                ].map((s) => (
                                    <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center gap-2">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center"> {s.icon} </div>
                                        <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                                        <p className="text-xs text-gray-500">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {t("subjectsCount", { count: detail.subjects.length })}
                                    </h2>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                        {t("drawer.tapToExplore")}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {detail.subjects.map((subject, index) => (
                                        <SubjectCard
                                            key={subject.subjectId}
                                            subject={subject}
                                            index={index}
                                            onOpen={() => {
                                                setActiveSubject(subject);
                                                setActiveIndex(index);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>

            <Footer />

            {activeSubject && (
                <SubjectDrawer
                    subject={activeSubject}
                    categoryId={categoryId}
                    gradientClass={GRADIENTS[activeIndex % GRADIENTS.length]}
                    open={activeSubject !== null}
                    onClose={() => setActiveSubject(null)}
                    locale={locale}
                />
            )}
        </main>
    );
}
