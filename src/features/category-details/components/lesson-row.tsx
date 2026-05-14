import { Lesson } from "@/entities/categories/model";
import { formatDurationShort } from "@/shared/lib/format-duration";
import { Clock, FileText, PlayCircle } from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";

export function LessonRow({ lesson, categoryId, subjectId, tCommon }: { lesson: Lesson; categoryId: string; subjectId: number; tCommon: (k: string) => string }) {
    const isVideo = lesson.type === "VIDEO";
    const locale = useLocale();
    return (
        <Link
            href={`/${locale}/tracks/${categoryId}/lessons/${lesson.lessonId}?subjectId=${subjectId}`}
            className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 bg-white border border-gray-100 hover:border-[#6c3aff]/30 transition-colors group"
        >
            <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isVideo ? "bg-[#ede9ff]" : "bg-orange-50"}`}>
                    {isVideo
                        ? <PlayCircle className="w-4 h-4 text-[#6c3aff]" />
                        : <FileText className="w-4 h-4 text-orange-500" />}
                </div>
                <span className="text-sm text-gray-700 truncate group-hover:text-[#6c3aff] transition-colors">{lesson.title}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isVideo ? "bg-[#ede9ff] text-[#6c3aff]" : "bg-orange-50 text-orange-600"}`}>
                    {isVideo ? tCommon("video") : tCommon("pdf")}
                </span>
                {lesson.duration && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDurationShort(lesson.duration)}
                    </span>
                )}
            </div>
        </Link>
    );
}