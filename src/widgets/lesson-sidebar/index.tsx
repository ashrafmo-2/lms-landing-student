"use client";

import { useEffect, useState } from "react";
import {
    ChevronDown,
    ChevronRight,
    PlayCircle,
    FileText,
    CheckCircle2,
    ClipboardList,
    Trophy,
    BookOpen,
    BarChart3,
} from "lucide-react";
import { Link } from "@/shared/i18n/routing";
import { getSubjectById } from "@/entities/lessons/api";
import type {
    SubjectDetail,
    UnitDetail,
    SubUnitDetail,
    LessonItem,
    ExamItem,
} from "@/entities/lessons/model";
import { cn } from "@/shared/lib/utils";

// ─── Props ────────────────────────────────────────────────────────────────────

interface LessonSidebarProps {
    subjectId: number;
    categoryId: number;
    currentLessonId?: number;
}

// ─── Lesson row ───────────────────────────────────────────────────────────────

function LessonRow({
    lesson,
    categoryId,
    subjectId,
    isActive,
}: {
    lesson: LessonItem;
    categoryId: number;
    subjectId: number;
    isActive: boolean;
}) {
    if (lesson.status === "IN_ACTIVE") return null;
    const Icon = lesson.type === "VIDEO" ? PlayCircle : FileText;
    const done = lesson.isCompleted === 1;

    return (
        <Link
            href={`/tracks/${categoryId}/lessons/${lesson.lessonId}?subjectId=${subjectId}`}
            className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all group",
                isActive
                    ? "bg-[#6c3aff] text-white shadow-md shadow-[#6c3aff]/20"
                    : "text-gray-600 hover:bg-[#6c3aff]/5 hover:text-[#6c3aff]"
            )}
        >
            <div
                className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
                    isActive ? "bg-white/20" : "bg-gray-100 group-hover:bg-[#6c3aff]/10"
                )}
            >
                {done ? (
                    <CheckCircle2
                        className={cn("w-4 h-4", isActive ? "text-white" : "text-green-500")}
                    />
                ) : (
                    <Icon
                        className={cn(
                            "w-4 h-4",
                            isActive ? "text-white" : "text-gray-400 group-hover:text-[#6c3aff]"
                        )}
                    />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="truncate text-[13px] font-medium leading-none mb-1 text-right">
                    {lesson.title}
                </p>
                <div
                    className={cn(
                        "flex items-center gap-1.5 text-[10px] font-bold",
                        isActive ? "text-white/70" : "text-gray-400"
                    )}
                >
                    <span>{lesson.type === "VIDEO" ? "فيديو" : "PDF"}</span>
                    {lesson.duration !== null && (
                        <>
                            <span className="w-0.5 h-0.5 rounded-full bg-current" />
                            <span>{lesson.duration} د</span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
}

// ─── Exam row ─────────────────────────────────────────────────────────────────

function ExamRow({
    exam,
    categoryId,
}: {
    exam: ExamItem;
    categoryId: number;
}) {
    if (exam.isActive === "IN_ACTIVE") return null;
    const done = exam.isCompleted === 1;

    return (
        <Link
            href={`/tracks/${categoryId}/exams/${exam.examId}`}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all group text-gray-600 hover:bg-green-50 hover:text-green-700"
        >
            <div className="w-8 h-8 rounded-full bg-green-100 group-hover:bg-green-200 flex items-center justify-center shrink-0 transition-colors">
                {done ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                    <Trophy className="w-4 h-4 text-green-600" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="truncate text-[13px] font-bold leading-none mb-1 text-right">
                    {exam.title}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                    <ClipboardList className="w-3 h-3" />
                    <span>{exam.duration} د</span>
                    {exam.totalMarks > 0 && (
                        <>
                            <span className="w-0.5 h-0.5 rounded-full bg-current" />
                            <span>{exam.totalMarks} درجة</span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
}

// ─── Sub-unit accordion ───────────────────────────────────────────────────────

function SubUnitAccordion({
    subUnit,
    categoryId,
    subjectId,
    currentLessonId,
    expanded,
    onToggle,
}: {
    subUnit: SubUnitDetail;
    categoryId: number;
    subjectId: number;
    currentLessonId?: number;
    expanded: boolean;
    onToggle: () => void;
}) {
    if (subUnit.subUnitStatus === "IN_ACTIVE") return null;

    return (
        <div className="space-y-0.5">
            <button
                type="button"
                onClick={onToggle}
                className={cn(
                    "w-full flex items-center gap-2 px-4 py-2 text-[13px] font-medium transition-all rounded-lg text-right",
                    expanded ? "text-gray-900" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                )}
            >
                <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    {expanded
                        ? <ChevronDown className="w-2.5 h-2.5 text-purple-600" />
                        : <ChevronRight className="w-2.5 h-2.5 text-purple-600 rtl:rotate-180" />}
                </div>
                <span className="flex-1 text-right truncate">{subUnit.title}</span>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md font-bold shrink-0">
                    {subUnit.countLessons + subUnit.countExams}
                </span>
            </button>

            {expanded && (
                <div className="me-4 border-e-2 border-purple-100 pe-1 py-0.5 space-y-0.5">
                    {subUnit.lessons.map((l) => (
                        <LessonRow
                            key={l.lessonId}
                            lesson={l}
                            categoryId={categoryId}
                            subjectId={subjectId}
                            isActive={currentLessonId === l.lessonId}
                        />
                    ))}
                    {subUnit.exams.map((e) => (
                        <ExamRow key={e.examId} exam={e} categoryId={categoryId} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Unit accordion ───────────────────────────────────────────────────────────

function UnitAccordion({
    unit,
    categoryId,
    subjectId,
    currentLessonId,
    expanded,
    expandedSubUnits,
    onToggle,
    onToggleSubUnit,
}: {
    unit: UnitDetail;
    categoryId: number;
    subjectId: number;
    currentLessonId?: number;
    expanded: boolean;
    expandedSubUnits: Record<string, boolean>;
    onToggle: () => void;
    onToggleSubUnit: (id: string) => void;
}) {
    if (unit.unitStatus === "IN_ACTIVE") return null;

    const totalItems = unit.countLessons + unit.countExams;
    const completedLessons = unit.lessons.filter((l) => l.isCompleted === 1).length
        + unit.subUnits.reduce((acc, su) => acc + su.lessons.filter((l) => l.isCompleted === 1).length, 0);
    const completedExams = unit.exams.filter((e) => e.isCompleted === 1).length
        + unit.subUnits.reduce((acc, su) => acc + su.exams.filter((e) => e.isCompleted === 1).length, 0);
    const completed = completedLessons + completedExams;
    const progress = totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0;

    return (
        <div className="rounded-xl overflow-hidden">
            <button
                type="button"
                onClick={onToggle}
                className={cn(
                    "w-full flex flex-col px-4 py-3 text-sm font-semibold transition-all hover:bg-gray-50 group",
                    expanded ? "bg-gray-50" : ""
                )}
            >
                <div className="w-full flex items-center gap-3">
                    <div
                        className={cn(
                            "w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0",
                            expanded
                                ? "bg-[#6c3aff] text-white"
                                : "bg-[#ede9ff] text-[#6c3aff] group-hover:bg-[#6c3aff] group-hover:text-white"
                        )}
                    >
                        {expanded
                            ? <ChevronDown className="w-3.5 h-3.5" />
                            : <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />}
                    </div>
                    <span className="flex-1 text-right text-[13px] line-clamp-1">{unit.title}</span>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md font-bold shrink-0">
                        {totalItems}
                    </span>
                </div>
                {/* Mini progress bar */}
                {totalItems > 0 && (
                    <div className="w-full h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-500",
                                progress === 100 ? "bg-green-500" : "bg-[#6c3aff]/40"
                            )}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </button>

            {expanded && (
                <div className="bg-gray-50/50 border-e-2 border-[#6c3aff]/20 me-4 pe-1 py-1 space-y-0.5">
                    {unit.lessons.map((l) => (
                        <LessonRow
                            key={l.lessonId}
                            lesson={l}
                            categoryId={categoryId}
                            subjectId={subjectId}
                            isActive={currentLessonId === l.lessonId}
                        />
                    ))}
                    {unit.subUnits.map((su) => (
                        <SubUnitAccordion
                            key={su.subUnitId}
                            subUnit={su}
                            categoryId={categoryId}
                            subjectId={subjectId}
                            currentLessonId={currentLessonId}
                            expanded={!!expandedSubUnits[`su-${su.subUnitId}`]}
                            onToggle={() => onToggleSubUnit(`su-${su.subUnitId}`)}
                        />
                    ))}
                    {unit.exams.map((e) => (
                        <ExamRow key={e.examId} exam={e} categoryId={categoryId} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export function LessonSidebar({ subjectId, categoryId, currentLessonId }: LessonSidebarProps) {
    const [subject, setSubject] = useState<SubjectDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});
    const [expandedSubUnits, setExpandedSubUnits] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setLoading(true);
        getSubjectById(subjectId)
            .then(setSubject)
            .finally(() => setLoading(false));
    }, [subjectId]);

    // Auto-expand the unit/sub-unit containing the current lesson
    useEffect(() => {
        if (!subject || !currentLessonId) return;
        for (const unit of subject.units) {
            const inUnit = unit.lessons.some((l) => l.lessonId === currentLessonId);
            if (inUnit) {
                setExpandedUnits((p) => ({ ...p, [`u-${unit.unitId}`]: true }));
                break;
            }
            for (const su of unit.subUnits) {
                const inSu = su.lessons.some((l) => l.lessonId === currentLessonId);
                if (inSu) {
                    setExpandedUnits((p) => ({ ...p, [`u-${unit.unitId}`]: true }));
                    setExpandedSubUnits((p) => ({ ...p, [`su-${su.subUnitId}`]: true }));
                    break;
                }
            }
        }
    }, [subject, currentLessonId]);

    // Progress calculation
    const { total, completed } = (() => {
        if (!subject) return { total: 0, completed: 0 };
        let t = 0;
        let c = 0;
        for (const unit of subject.units) {
            t += unit.lessons.length + unit.exams.length;
            c += unit.lessons.filter((l) => l.isCompleted === 1).length;
            c += unit.exams.filter((e) => e.isCompleted === 1).length;
            for (const su of unit.subUnits) {
                t += su.lessons.length + su.exams.length;
                c += su.lessons.filter((l) => l.isCompleted === 1).length;
                c += su.exams.filter((e) => e.isCompleted === 1).length;
            }
        }
        t += subject.exams.length;
        c += subject.exams.filter((e) => e.isCompleted === 1).length;
        return { total: t, completed: c };
    })();

    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (loading) {
        return (
            <div className="flex flex-col h-full animate-pulse">
                <div className="p-5 border-b border-gray-100 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-2 bg-gray-100 rounded-full w-full" />
                </div>
                <div className="flex-1 p-4 space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-11 bg-gray-100 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (!subject) return null;

    return (
        <div className="flex flex-col h-full select-none">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 bg-white shrink-0">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#ede9ff] flex items-center justify-center shrink-0">
                        <BarChart3 className="w-4 h-4 text-[#6c3aff]" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="font-bold text-sm leading-tight line-clamp-1 text-gray-900">
                            {subject.title}
                        </h2>
                        <p className="text-[11px] text-gray-400 mt-0.5">{subject.teacherName}</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <span>تقدمك</span>
                        <span className="text-[#6c3aff]">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-700",
                                progress === 100 ? "bg-green-500" : "bg-[#6c3aff]"
                            )}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-gray-400">
                        {completed} / {total} مكتمل
                    </p>
                </div>
            </div>

            {/* Curriculum tree */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {/* Subject-level exams */}
                {subject.exams.length > 0 && (
                    <div className="mb-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1 flex items-center gap-1.5">
                            <BookOpen className="w-3 h-3" />
                            اختبارات المادة
                        </p>
                        {subject.exams.map((e) => (
                            <ExamRow key={e.examId} exam={e} categoryId={categoryId} />
                        ))}
                    </div>
                )}

                {/* Units */}
                {subject.units.map((unit) => (
                    <UnitAccordion
                        key={unit.unitId}
                        unit={unit}
                        categoryId={categoryId}
                        subjectId={subjectId}
                        currentLessonId={currentLessonId}
                        expanded={!!expandedUnits[`u-${unit.unitId}`]}
                        expandedSubUnits={expandedSubUnits}
                        onToggle={() =>
                            setExpandedUnits((p) => ({
                                ...p,
                                [`u-${unit.unitId}`]: !p[`u-${unit.unitId}`],
                            }))
                        }
                        onToggleSubUnit={(id) =>
                            setExpandedSubUnits((p) => ({ ...p, [id]: !p[id] }))
                        }
                    />
                ))}
            </div>
        </div>
    );
}
