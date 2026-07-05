"use client";

import { BookOpen, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { TrackCard } from "@/components/landing/track-card";
import { useAuth } from "@/contexts/auth-context";
import { getMyCategories, type MyCategory } from "@/entities/categories/api";
import { StudentAuthenticatedGuard } from "@/features/auth/components/student-authenticated-guard";
import { EmptyState } from "@/features/my-courses/components/empty-state";
import { LoadingAllCourse } from "@/features/my-courses/components/loading-all-courses";
import { SkeletonCard } from "@/features/my-courses/components/skeleton-card";
import { Footer } from "@/widgets/landing-footer";
import { Navbar } from "@/widgets/landing-navbar";

const GRADIENTS = [
  "from-blue-600 to-blue-900",
  "from-[#0067b8] to-[#101827]",
  "from-teal-500 to-emerald-800",
  "from-rose-500 to-pink-900",
  "from-orange-500 to-amber-800",
  "from-cyan-500 to-sky-800",
];

const SKELETON_IDS = [
  "course-skeleton-1",
  "course-skeleton-2",
  "course-skeleton-3",
];

export default function MyCoursesPage() {
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const { isAuthenticated, isLoading, user } = useAuth();

  const [courses, setCourses] = useState<MyCategory[]>([]);
  const [totals, setTotals] = useState({
    totalCategories: 0,
    totalSubjects: 0,
    totalLessons: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    let ignore = false;

    if (isLoading || !isAuthenticated) {
      return () => {
        ignore = true;
      };
    }

    setLoading(true);
    getMyCategories({ perPage: 100, page: 1 })
      .then((data) => {
        if (ignore) return;
        setCourses(data.categories);
        setTotals({
          totalCategories: data.totalCategories,
          totalSubjects: data.totalSubjects,
          totalLessons: data.totalLessons,
        });
      })
      .catch(() => {
        if (ignore) return;
        setCourses([]);
        setTotals({
          totalCategories: 0,
          totalSubjects: 0,
          totalLessons: 0,
        });
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, isLoading]);

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      c.subjects.some((subject) =>
        subject.title.toLowerCase().includes(searchInput.toLowerCase()),
      ),
  );

  function courseToCardProps(cat: MyCategory, index: number) {
    const priceAfterDiscount =
      cat.priceAfterDiscount ?? cat.priceBeforeDiscount;
    const hasDiscount =
      cat.priceAfterDiscount !== null &&
      cat.priceBeforeDiscount > cat.priceAfterDiscount;
    const fmt = (n: number) =>
      `${n.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} ${tCommon("currency")}`;
    const subjectNames = cat.subjects.map((subject) => subject.title);

    return {
      icon: "ph-duotone ph-stack",
      gradient: GRADIENTS[index % GRADIENTS.length],
      tag: `مكتمل ${cat.completionPercentage.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}%`,
      title: cat.title,
      description: cat.subjects[0]?.shortDescription || tCommon("defaultDesc"),
      includes: subjectNames.slice(0, 3),
      extraIncludes:
        subjectNames.length > 3
          ? `+${subjectNames.length - 3} ${tCommon("subjects")}`
          : undefined,
      stats: [
        { label: tCommon("subjects"), value: String(cat.countSubjects) },
        { label: tCommon("unit"), value: String(cat.countUnits) },
        { label: tCommon("lesson"), value: String(cat.countLessons) },
      ],
      price: fmt(priceAfterDiscount),
      oldPrice: hasDiscount ? fmt(cat.priceBeforeDiscount) : undefined,
      href: `/${locale}/tracks/${cat.categoryId}`,
      isSubscribed: 1 as const,
    };
  }

  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <StudentAuthenticatedGuard fallback={<LoadingAllCourse />}>
      <main className="min-h-screen flex flex-col bg-gray-50" dir={direction}>
        <Navbar />

        <div className="grow pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* ── Page header ── */}
            <div className="mb-10">
              {/* Greeting */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#e8f4ff] flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-[#0067b8]" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                    كورساتي
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    مرحباً {user?.name} — لديك{" "}
                    <span className="font-bold text-[#0067b8]">
                      {courses.length}
                    </span>{" "}
                    {courses.length === 1 ? "مسار مشترك" : "مسارات مشترك بها"}
                  </p>
                </div>
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  {
                    label: "المسارات",
                    value: totals.totalCategories,
                    color: "text-[#0067b8]",
                    bg: "bg-[#e8f4ff]",
                  },
                  {
                    label: "المواد",
                    value: totals.totalSubjects,
                    color: "text-blue-700",
                    bg: "bg-blue-50",
                  },
                  {
                    label: "الدروس",
                    value: totals.totalLessons,
                    color: "text-teal-700",
                    bg: "bg-teal-50",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`${s.bg} rounded-2xl p-4 text-center`}
                  >
                    <p className={`text-2xl font-extrabold ${s.color}`}>
                      {s.value}
                    </p>
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
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3 ps-11 pe-10 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0067b8]/40 focus:border-[#0067b8] transition-all"
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
                {SKELETON_IDS.map((id) => (
                  <SkeletonCard key={id} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              searchInput ? (
                <div className="text-center py-20">
                  <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    لا توجد نتائج لـ "{searchInput}"
                  </p>
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
    </StudentAuthenticatedGuard>
  );
}
