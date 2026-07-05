"use client";

import { ArrowUpRight, Layers3 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { type Category, getPublicCategories } from "@/entities/categories/api";
import { Link } from "@/shared/i18n/routing";
import { TrackCard } from "./track-card";

const GRADIENTS = [
  "from-[#0067b8] to-[#101827]",
  "from-[#00a6a6] to-[#0b3b4a]",
  "from-[#ffb000] to-[#7a4a00]",
  "from-[#12b76a] to-[#123c2a]",
  "from-[#3b82f6] to-[#172554]",
  "from-[#f04438] to-[#7a271a]",
];

const SKELETON_CARDS = [
  "track-skeleton-a",
  "track-skeleton-b",
  "track-skeleton-c",
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
    <section id="modules" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div data-reveal="left">
            <div className="section-kicker mb-4">
              <Layers3 className="h-3.5 w-3.5" />
              {t("badge")}
            </div>
            <h2 className="max-w-2xl text-4xl font-black leading-tight text-[#101827] md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#5d6b7d]">
              {t("subtitle")}
            </p>
          </div>
          <Link
            href="/tracks"
            className="focus-ring group flex shrink-0 items-center gap-2 border border-[#cdd9e5] bg-white px-5 py-3 text-sm font-black text-[#101827] shadow-[0_14px_30px_rgba(16,24,39,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0067b8]/40"
            data-reveal="right"
          >
            {t("viewAll")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:rotate-[-90deg]" />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SKELETON_CARDS.map((cardId) => (
              <div
                key={cardId}
                className="animate-pulse border border-[#d9e3ee] bg-white"
              >
                <div className="h-40 bg-[#dfe8f1]" />
                <div className="space-y-3 p-6">
                  <div className="h-4 w-3/4 bg-[#dfe8f1]" />
                  <div className="h-3 w-full bg-[#eef3f8]" />
                  <div className="h-3 w-5/6 bg-[#eef3f8]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, index) => (
              <div
                key={cat.categoryId}
                data-reveal="scale"
                style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
              >
                <TrackCard {...categoryToCardProps(cat, index)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
