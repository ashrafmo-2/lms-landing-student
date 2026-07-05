import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ExamListItem } from "@/entities/exams";
import { formatMinutes, formatPercent } from "../lib/format";

export function ExamCard({
  exam,
  href,
  locale,
}: {
  exam: ExamListItem;
  href: string;
  locale: string;
}) {
  const completed = exam.isCompleted === 1;
  const score = exam.lastAttempt
    ? `${exam.lastAttempt.score}/${exam.lastAttempt.totalScore}`
    : "-";

  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-[#d8ccff] hover:shadow-xl"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8f4ff] text-[#0067b8] transition-colors group-hover:bg-[#0067b8] group-hover:text-white">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="line-clamp-2 font-extrabold text-gray-900">
              {exam.title}
            </h2>
            <p className="mt-1 truncate text-xs font-semibold text-gray-400">
              {exam.category.title}
              {exam.subject ? ` · ${exam.subject.title}` : ""}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
            completed
              ? "bg-green-50 text-green-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {completed ? "مكتمل" : "لم يبدأ"}
        </span>
      </div>

      <p className="mb-5 line-clamp-2 min-h-10 text-sm text-gray-500">
        {exam.description || "اختبار تفاعلي لقياس تقدمك داخل المسار."}
      </p>

      <div className="mb-5 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-gray-50 p-3">
          <Clock3 className="mx-auto mb-1 h-4 w-4 text-[#0067b8]" />
          <p className="text-xs font-bold text-gray-700">
            {formatMinutes(exam.durationInMinutes, locale)}
          </p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <Trophy className="mx-auto mb-1 h-4 w-4 text-[#0067b8]" />
          <p className="text-xs font-bold text-gray-700">
            {exam.totalMarks} درجة
          </p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <Users className="mx-auto mb-1 h-4 w-4 text-[#0067b8]" />
          <p className="text-xs font-bold text-gray-700">{score}</p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          {exam.lastAttempt
            ? formatPercent(exam.lastAttempt.percentage, locale)
            : "جاهز للحل"}
        </div>
        <span className="text-sm font-extrabold text-[#0067b8]">
          عرض الاختبار
        </span>
      </div>
    </Link>
  );
}
