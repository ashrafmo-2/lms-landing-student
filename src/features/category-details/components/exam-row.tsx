import { Exam } from "@/entities/categories/model";
import { formatDurationShort } from "@/shared/lib/format-duration";
import { ClipboardList, Clock } from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";

export function ExamRow({ exam, categoryId, tCommon }: { exam: Exam; categoryId: string; tCommon: (k: string) => string }) {
    const locale = useLocale();
    return (
        <Link href={`/${locale}/tracks/${categoryId}/exams/${exam.examId}`} className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 bg-green-50 border border-green-100 hover:bg-green-100 transition-colors group">
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-green-100 group-hover:bg-green-200 flex items-center justify-center shrink-0 transition-colors">
                    <ClipboardList className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-bold text-gray-700 truncate group-hover:text-green-700 transition-colors">{exam.title}</span>
            </div>
            <span className="text-xs text-green-600 font-bold flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" />
                {formatDurationShort(exam.duration)}
            </span>
        </Link>
    );
}