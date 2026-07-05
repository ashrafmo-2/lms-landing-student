import { SubUnit } from "@/entities/categories/model";
import { ChevronDown, Layers } from "lucide-react";
import { useState } from "react";
import { ExamRow } from "./exam-row";
import { LessonRow } from "./lesson-row";

export function SubUnitSection({ subUnit, categoryId, subjectId, tCommon }: { subUnit: SubUnit; categoryId: string; subjectId: number; tCommon: (k: string) => string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="rounded-xl border border-gray-100 overflow-hidden bg-white/50">
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors text-right"
            >
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[#e8f4ff] flex items-center justify-center shrink-0">
                        <Layers className="w-3 h-3 text-[#0067b8]" />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{subUnit.title}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        {subUnit.countLessons} {tCommon("lesson")}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                </div>
            </button>
            {open && (
                <div className="p-2 space-y-1 bg-gray-50/30 border-t border-gray-100">
                    {subUnit.lessons.map(l => <LessonRow key={l.lessonId} lesson={l} categoryId={categoryId} subjectId={subjectId} tCommon={tCommon} />)}
                    {subUnit.exams.map(e => <ExamRow key={e.examId} exam={e} categoryId={categoryId} tCommon={tCommon} />)}
                </div>
            )}
        </div>
    );
}
