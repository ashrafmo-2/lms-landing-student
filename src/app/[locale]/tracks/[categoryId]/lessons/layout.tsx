"use client";

import { Loader2 } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { StudentAuthenticatedGuard } from "@/features/auth/components/student-authenticated-guard";
import { LessonSidebar } from "@/widgets/lesson-sidebar";

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const categoryId = Number(params.categoryId);
  const lessonId = params.lessonId ? Number(params.lessonId) : undefined;
  // subjectId is passed as ?subjectId=X from the category detail page
  const subjectId = searchParams.get("subjectId")
    ? Number(searchParams.get("subjectId"))
    : undefined;

  const fallback = (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-[#6c3aff] animate-spin" />
        <p className="text-sm text-gray-500">جاري التحميل...</p>
      </div>
    </div>
  );

  const isRtl = locale === "ar";

  return (
    <StudentAuthenticatedGuard fallback={fallback}>
      <div
        className="flex h-screen bg-gray-50 overflow-hidden"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Sidebar — right in RTL, left in LTR */}
        {subjectId ? (
          <aside className="w-80 shrink-0 border-s border-gray-200 bg-white hidden md:flex flex-col">
            <LessonSidebar
              subjectId={subjectId}
              categoryId={categoryId}
              currentLessonId={lessonId}
            />
          </aside>
        ) : null}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </StudentAuthenticatedGuard>
  );
}
