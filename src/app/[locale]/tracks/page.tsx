"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { TrackCard } from "@/components/landing/track-card";
import { getPublicCategories, type Category } from "@/entities/categories/api";
import { Navbar } from "@/widgets/landing-navbar";
import { Footer } from "@/widgets/landing-footer";
import { useTranslations, useLocale } from "next-intl";


const GRADIENTS = [
    "from-blue-600 to-blue-900",
    "from-purple-600 to-indigo-900",
    "from-teal-500 to-emerald-800",
    "from-rose-500 to-pink-900",
    "from-orange-500 to-amber-800",
    "from-cyan-500 to-sky-800",
];

const DEBOUNCE_MS = 400;

export default function TracksPage() {
    const t = useTranslations("Tracks");
    const tCommon = useTranslations("Common");
    const locale = useLocale();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Debounce: update searchQuery 400ms after the user stops typing
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSearchQuery(searchInput.trim());
        }, DEBOUNCE_MS);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchInput]);

    // Fetch whenever searchQuery changes
    useEffect(() => {
        setLoading(true);
        getPublicCategories({ perPage: 12, page: 1, search: searchQuery || undefined })
            .then(({ categories }) => setCategories(categories))
            .catch(() => setCategories([]))
            .finally(() => setLoading(false));
    }, [searchQuery]);

    function categoryToCardProps(cat: Category, index: number) {
        const hasDiscount = cat.priceBeforeDiscount > cat.priceAfterDiscount;
        const currency = tCommon("currency");
        const fmt = (n: number) =>
            `${n.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} ${currency}`;
        return {
            icon: "ph-duotone ph-stack",
            gradient: GRADIENTS[index % GRADIENTS.length],
            tag: t("integratedTrack"),
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
    const isSearching = searchInput !== searchQuery; // debounce in-flight

    return (
        <main className="min-h-screen flex flex-col" dir={direction}>
            <Navbar />

            <div className="grow pt-24 pb-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* ── Page header ── */}
                    <div className="mb-10 text-center">
                        <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-bold mb-3">
                            {t("comprehensiveSubscription")}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {t("title")}
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                            {t("subtitle")}
                        </p>

                        {/* ── Search bar ── */}
                        <div className="max-w-xl mx-auto relative">
                            <div className="relative flex items-center">
                                <Search className="absolute inset-s-4 w-4 h-4 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder={t("searchPlaceholder")}
                                    className="w-full bg-white border border-gray-200 rounded-2xl py-3 ps-11 pe-10 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6c3aff]/40 focus:border-[#6c3aff] transition-all"
                                />
                                {/* Clear button */}
                                {searchInput && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchInput("")}
                                        className="absolute inset-e-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                        aria-label="Clear search"
                                    >
                                        <X className="w-3 h-3 text-gray-500" />
                                    </button>
                                )}
                            </div>

                            {/* Live indicator */}
                            {isSearching && (
                                <p className="text-xs text-gray-400 mt-2 text-center animate-pulse">
                                    {tCommon("loading")}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── Results ── */}
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse"
                                >
                                    <div className="h-40 bg-gray-200" />
                                    <div className="p-6 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-100 rounded w-full" />
                                        <div className="h-3 bg-gray-100 rounded w-5/6" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-24">
                            <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">{t("noResults")}</p>
                            {searchQuery && (
                                <p className="text-sm text-gray-400 mt-1">
                                    "{searchQuery}"
                                </p>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Result count when searching */}
                            {searchQuery && (
                                <p className="text-sm text-gray-500 mb-4">
                                    {t("resultsCount", { count: categories.length, query: searchQuery })}
                                </p>
                            )}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {categories.map((cat, index) => (
                                    <TrackCard
                                        key={cat.categoryId}
                                        {...categoryToCardProps(cat, index)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
