import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import { ChevronDown, Layers } from "lucide-react";
import { Unit } from "@/entities/categories/model";
import { SubUnitSection } from "./subUnit-section";
import { ExamRow } from "./exam-row";
import { LessonRow } from "./lesson-row";

export function UnitSection({ unit, categoryId, subjectId, index, tCommon }: { unit: Unit; categoryId: string; subjectId: number; index: number; tCommon: (k: string) => string }) {
    const [open, setOpen] = useState(index === 0);
    return (
        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-xs bg-white">
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className={cn(
                    "w-full flex items-center justify-between px-5 py-4 transition-all text-right",
                    open ? "bg-gray-50" : "hover:bg-gray-50"
                )}
            >
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                        open ? "bg-[#0067b8] text-white" : "bg-[#e8f4ff] text-[#0067b8]"
                    )}>
                        <Layers className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm leading-tight">{unit.title}</p>
                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                            {unit.countLessons} درساً • {unit.countExams} اختباراً
                        </p>
                    </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="p-4 space-y-3 bg-gray-50/50 animate-in slide-in-from-top-2 duration-300">
                    {unit.lessons.length > 0 && (
                        <div className="space-y-1.5">
                            {unit.lessons.map(l => <LessonRow key={l.lessonId} lesson={l} categoryId={categoryId} subjectId={subjectId} tCommon={tCommon} />)}
                        </div>
                    )}
                    {unit.subUnits.length > 0 && (
                        <div className="space-y-2">
                            {unit.subUnits.map(su => <SubUnitSection key={su.subUnitId} subUnit={su} categoryId={categoryId} subjectId={subjectId} tCommon={tCommon} />)}
                        </div>
                    )}
                    {unit.exams.length > 0 && (
                        <div className="space-y-1.5">
                            {unit.exams.map(e => <ExamRow key={e.examId} exam={e} categoryId={categoryId} tCommon={tCommon} />)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
