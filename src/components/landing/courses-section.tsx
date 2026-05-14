"use client";

import { Link } from "@/shared/i18n/routing";
import { useEffect, useState } from "react";
import { TrackCard } from "./track-card";
import { getPublicCategories, type Category } from "@/entities/categories/api";
import { useTranslations, useLocale } from "next-intl";


// Gradient palette — cycles through cards
const GRADIENTS = [
    "from-blue-600 to-blue-900",
    "from-purple-600 to-indigo-900",
    "from-teal-500 to-emerald-800",
    "from-rose-500 to-pink-900",
    "from-orange-500 to-amber-800",
    "from-cyan-500 to-sky-800",
];

export function CoursesSection() {
    const t = useTranslations("Landing.courses");
    const tCommon = useTranslations("Common");
    const locale = useLocale();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    function categoryToCardProps(cat: Category, index: number) {
        const hasDiscount = cat.priceBeforeDiscount > cat.priceAfterDiscount;
        const fmt = (n: number) =>
            `${n.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} ${tCommon("currency")}`;

        return {
            icon: "ph-duotone ph-stack",
            gradient: GRADIENTS[index % GRADIENTS.length],
            tag: t("trackTag"),
            title: cat.name,
            description: cat.description || t("defaultDesc"),
            includes: cat.subjectNames.slice(0, 3),
            extraIncludes:
                cat.subjectNames.length > 3
                    ? t("moreSubjects", { count: cat.subjectNames.length - 3 })
                    : undefined,
            stats: [
                { label: t("subjects"), value: String(cat.totalSubjects) },
                { label: t("units"), value: String(cat.totalUnits) },
                { label: t("lessons"), value: String(cat.totalLessons) },
            ],
            price: fmt(cat.priceAfterDiscount),
            oldPrice: hasDiscount ? fmt(cat.priceBeforeDiscount) : undefined,
            href: `/${locale}/tracks/${cat.categoryId}`,
        };
    }

    useEffect(() => {
        getPublicCategories({ perPage: 3, page: 1 })
            .then(({ categories }) => setCategories(categories))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section id="modules" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <div>
                        <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-bold mb-3">
                            {t("badge")}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            {t("title")}
                        </h2>
                        <p className="text-gray-600">
                            {t("subtitle")}
                        </p>
                    </div>
                    <Link
                        href="/tracks"
                        className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 px-6 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-2 shadow-sm shrink-0"
                    >
                        {t("viewAll")}
                        <i className="ph-bold ph-arrow-left ltr:rotate-180" />
                    </Link>
                </div>

                {loading ? (
                    // Skeleton placeholders
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 3 }).map((_, i) => (
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
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((cat, index) => (
                            <TrackCard key={cat.categoryId} {...categoryToCardProps(cat, index)} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

