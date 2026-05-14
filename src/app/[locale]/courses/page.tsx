"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Search, X, GraduationCap } from "lucide-react";
import { TrackCard } from "@/components/landing/track-card";
import { Navbar } from "@/widgets/landing-navbar";
import { Footer } from "@/widgets/landing-footer";
import { useAuth } from "@/contexts/auth-context";
import { useTranslations, useLocale } from "next-intl";
import type { Category } from "@/entities/categories/api";
import Link from "next/link";
import { SkeletonCard } from "@/features/my-courses/components/skeleton-card";
import { LoadingAllCourse } from "@/features/my-courses/components/loading-all-courses";

// ─── Dummy data (replace with real API call when endpoint is ready) ───────────

const GRADIENTS = [
    "from-blue-600 to-blue-900",
    "from-purple-600 to-indigo-900",
    "from-teal-500 to-emerald-800",
    "from-rose-500 to-pink-900",
    "from-orange-500 to-amber-800",
    "from-cyan-500 to-sky-800",
];

const DUMMY_COURSES: Category[] = [
    {
        categoryId: 15,
        name: "وحدة المحترفين",
        description: "مسار شامل يغطي جميع مهارات التواصل الفعال والعرض والتقديم الاحترافي.",
        totalSubjects: 1,
        totalUnits: 1,
        totalLessons: 3,
        subjectNames: ["مهارات التواصل الفعال"],
        priceBeforeDiscount: 15000,
        priceAfterDiscount: 13999,
        isSubscribed: 1,
    },
    {
        categoryId: 8,
        name: "Matematica",
        description: "دورة شاملة في الرياضيات تغطي الجبر والهندسة والتفاضل والتكامل.",
        totalSubjects: 2,
        totalUnits: 2,
        totalLessons: 18,
        subjectNames: ["Chimica Organica", "Filosofia Moderna"],
        priceBeforeDiscount: 120,
        priceAfterDiscount: 90,
        isSubscribed: 1,
    },
    {
        categoryId: 5,
        name: "الفيزياء والكيمياء التطبيقية",
        description: "مسار متكامل يجمع بين الفيزياء العامة والكيمياء التطبيقية بأسلوب تفاعلي.",
        totalSubjects: 2,
        totalUnits: 11,
        totalLessons: 42,
        subjectNames: ["الفيزياء العامة", "الكيمياء التطبيقية"],
        priceBeforeDiscount: 734,
        priceAfterDiscount: 361,
        isSubscribed: 1,
    },
];

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ locale }: { locale: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-[#ede9ff] rounded-full flex items-center justify-center mb-5">
                <GraduationCap className="w-10 h-10 text-[#6c3aff]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">لا توجد كورسات مشترك بها</h2>
            <p className="text-gray-500 text-sm max-w-xs mb-6">
                لم تشترك في أي مسار تعليمي بعد. تصفح المسارات المتاحة وابدأ رحلتك التعليمية.
            </p>
            <Link
                href={`/${locale}/tracks`}
                className="flex items-center gap-2 bg-[#6c3aff] hover:bg-[#5228e8] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-lg shadow-[#6c3aff]/20"
            >
                <BookOpen className="w-4 h-4" />
                تصفح المسارات
            </Link>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyCoursesPage() {
    const tCommon = useTranslations("Common");
    const locale = useLocale();
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useAuth();

    const [courses] = useState<Category[]>(DUMMY_COURSES);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");

    // ── Auth guard ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace(`/${locale}/auth/login`);
        }
    }, [isAuthenticated, isLoading, router, locale]);

    // Simulate loading
    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(t);
    }, []);

    const filtered = courses.filter((c) =>
        c.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        c.subjectNames.some((s) => s.toLowerCase().includes(searchInput.toLowerCase()))
    );



    function courseToCardProps(cat: Category, index: number) {
        const hasDiscount = cat.priceBeforeDiscount > cat.priceAfterDiscount;
        const fmt = (n: number) =>
            `${n.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} ${tCommon("currency")}`;
        return {
            icon: "ph-duotone ph-stack",
            gradient: GRADIENTS[index % GRADIENTS.length],
            tag: "مسار متكامل",
            title: cat.name,
            description: cat.description || tCommon("defaultDesc"),
            includes: cat.subjectNames.slice(0, 3),
            extraIncludes:
                cat.subjectNames.length > 3
                    ? `+${cat.subjectNames.length - 3} ${tCommon("subjects")}`
                    : undefined,
            stats: [
                { label: tCommon("subjects"), value: String(cat.totalSubjects) },
                { label: tCommon("unit"), value: String(cat.totalUnits) },
                { label: tCommon("lesson"), value: String(cat.totalLessons) },
            ],
            price: fmt(cat.priceAfterDiscount),
            oldPrice: hasDiscount ? fmt(cat.priceBeforeDiscount) : undefined,
            href: `/${locale}/tracks/${cat.categoryId}`,
            isSubscribed: cat.isSubscribed,
        };
    }

    const direction = locale === "ar" ? "rtl" : "ltr";

    if (isLoading || !isAuthenticated) return <LoadingAllCourse />


    return (
        <main className="min-h-screen flex flex-col bg-gray-50" dir={direction}>
            <Navbar />

            <div className="grow pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* ── Page header ── */}
                    <div className="mb-10">
                        {/* Greeting */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#ede9ff] flex items-center justify-center shrink-0">
                                <BookOpen className="w-6 h-6 text-[#6c3aff]" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                                    كورساتي
                                </h1>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    مرحباً {user?.name} — لديك{" "}
                                    <span className="font-bold text-[#6c3aff]">{courses.length}</span>{" "}
                                    {courses.length === 1 ? "مسار مشترك" : "مسارات مشترك بها"}
                                </p>
                            </div>
                        </div>

                        {/* Stats strip */}
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {[
                                { label: "المسارات", value: courses.length, color: "text-[#6c3aff]", bg: "bg-[#ede9ff]" },
                                {
                                    label: "المواد",
                                    value: courses.reduce((a, c) => a + c.totalSubjects, 0),
                                    color: "text-blue-700",
                                    bg: "bg-blue-50",
                                },
                                {
                                    label: "الدروس",
                                    value: courses.reduce((a, c) => a + c.totalLessons, 0),
                                    color: "text-teal-700",
                                    bg: "bg-teal-50",
                                },
                            ].map((s) => (
                                <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
                                    <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative max-w-md">
                            <Search className="absolute inset-s-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="ابحث في كورساتك..."
                                className="w-full bg-white border border-gray-200 rounded-2xl py-3 ps-11 pe-10 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6c3aff]/40 focus:border-[#6c3aff] transition-all"
                            />
                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={() => setSearchInput("")}
                                    className="absolute inset-e-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-3 h-3 text-gray-500" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ── Grid ── */}
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : filtered.length === 0 ? (
                        searchInput ? (
                            <div className="text-center py-20">
                                <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">لا توجد نتائج لـ "{searchInput}"</p>
                            </div>
                        ) : (
                            <EmptyState locale={locale} />
                        )
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filtered.map((cat, index) => (
                                <TrackCard
                                    key={cat.categoryId}
                                    {...courseToCardProps(cat, index)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
