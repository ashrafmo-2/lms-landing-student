"use client";

import { ClipboardList, Search, X } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { type ExamListItem, getExams } from "@/entities/exams";
import { StudentAuthenticatedGuard } from "@/features/auth/components/student-authenticated-guard";
import { Footer } from "@/widgets/landing-footer";
import { Navbar } from "@/widgets/landing-navbar";
import { ExamCard } from "./exam-card";
import { ExamEmptyState } from "./exam-empty-state";
import { ExamLoadingGrid } from "./exam-loading-grid";

type FilterMode = "all" | "pending" | "completed";

const FILTERS: { id: FilterMode; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "pending", label: "لم يبدأ" },
  { id: "completed", label: "مكتمل" },
];

export function ExamsListPage() {
  const locale = useLocale();
  const { isAuthenticated, isLoading } = useAuth();
  const [exams, setExams] = useState<ExamListItem[]>([]);
  const [stats, setStats] = useState({ totalExams: 0, completedExams: 0 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");

  const direction = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    let ignore = false;

    if (isLoading || !isAuthenticated) {
      return () => {
        ignore = true;
      };
    }

    setLoading(true);
    getExams({ perPage: 100, page: 1 })
      .then((data) => {
        if (ignore) return;
        setExams(data.exams);
        setStats({
          totalExams: data.totalExams,
          completedExams: data.completedExams,
        });
      })
      .catch(() => {
        if (ignore) return;
        setExams([]);
        setStats({ totalExams: 0, completedExams: 0 });
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, isLoading]);

  const filtered = useMemo(() => {
    const search = searchInput.trim().toLowerCase();

    return exams.filter((exam) => {
      const matchesSearch =
        !search ||
        exam.title.toLowerCase().includes(search) ||
        exam.category.title.toLowerCase().includes(search) ||
        exam.subject?.title.toLowerCase().includes(search);
      const matchesFilter =
        filter === "all" ||
        (filter === "completed" && exam.isCompleted === 1) ||
        (filter === "pending" && exam.isCompleted !== 1);

      return matchesSearch && matchesFilter;
    });
  }, [exams, filter, searchInput]);

  const pendingExams = Math.max(stats.totalExams - stats.completedExams, 0);

  return (
    <StudentAuthenticatedGuard>
      <main className="flex min-h-screen flex-col bg-gray-50" dir={direction}>
        <Navbar />

        <div className="grow pt-24 pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f4ff]">
                  <ClipboardList className="h-6 w-6 text-[#0067b8]" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
                    الاختبارات
                  </h1>
                  <p className="mt-0.5 text-sm text-gray-500">
                    تابع اختباراتك، ابدأ محاولة جديدة، وراجع نتائجك السابقة.
                  </p>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-3 gap-3">
                {[
                  {
                    label: "كل الاختبارات",
                    value: stats.totalExams,
                    className: "bg-[#e8f4ff] text-[#0067b8]",
                  },
                  {
                    label: "مكتملة",
                    value: stats.completedExams,
                    className: "bg-green-50 text-green-700",
                  },
                  {
                    label: "متبقية",
                    value: pendingExams,
                    className: "bg-amber-50 text-amber-700",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`${item.className} rounded-2xl p-4 text-center`}
                  >
                    <p className="text-xl font-extrabold md:text-2xl">
                      {item.value}
                    </p>
                    <p className="mt-0.5 text-xs opacity-80">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                <div className="relative">
                  <Search className="absolute inset-s-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="ابحث باسم الاختبار أو المسار..."
                    className="w-full rounded-2xl border border-gray-200 bg-white py-3 ps-11 pe-10 text-sm text-gray-800 shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-[#0067b8] focus:ring-2 focus:ring-[#0067b8]/40"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput("")}
                      className="absolute inset-e-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
                    >
                      <X className="h-3 w-3 text-gray-500" />
                    </button>
                  )}
                </div>

                <div className="flex rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
                  {FILTERS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFilter(item.id)}
                      className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                        filter === item.id
                          ? "bg-[#0067b8] text-white"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {loading ? (
              <ExamLoadingGrid />
            ) : filtered.length === 0 ? (
              <ExamEmptyState
                title="لا توجد اختبارات مطابقة"
                description="جرّب تغيير البحث أو حالة العرض، أو ارجع للمسارات المتاحة."
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((exam) => (
                  <ExamCard
                    key={exam.examId}
                    exam={exam}
                    href={`/${locale}/exams/${exam.examId}`}
                    locale={locale}
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
