"use client";

import { useEffect, useState } from "react";
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

export default function TracksPage() {
    const t = useTranslations("Tracks");
    const tCommon = useTranslations("Common");
    const locale = useLocale();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    function formatPrice(amount: number): string {
        return `${amount.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} ${tCommon("currency")}`;
    }

    function categoryToCardProps(cat: Category, index: number) {
        const hasDiscount = cat.priceBeforeDiscount > cat.priceAfterDiscount;
        return {
            icon: "ph-duotone ph-stack",
            gradient: GRADIENTS[index % GRADIENTS.length],
            tag: t("integratedTrack"),
            title: cat.name,
            description:
                cat.description ||
                tCommon("defaultDesc"),
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
            price: formatPrice(cat.priceAfterDiscount),
            oldPrice: hasDiscount ? formatPrice(cat.priceBeforeDiscount) : undefined,
            href: `/${locale}/tracks/${cat.categoryId}`,
        };
    }

    useEffect(() => {
        getPublicCategories({ perPage: 12, page: 1 })
            .then(({ categories }) => setCategories(categories))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const direction = locale === "ar" ? "rtl" : "ltr";

    return (
        <main className="min-h-screen flex flex-col" dir={direction}>
            <Navbar />

            <div className="grow pt-24 pb-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-bold mb-3">
                            {t("comprehensiveSubscription")}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {t("title")}
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {t("subtitle")}
                        </p>
                    </div>

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
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categories.map((cat, index) => (
                                <TrackCard
                                    key={cat.categoryId}
                                    {...categoryToCardProps(cat, index)}
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
