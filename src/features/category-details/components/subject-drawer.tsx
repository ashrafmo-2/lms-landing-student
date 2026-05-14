import { Subject } from "@/entities/categories/model";
import { BookOpen, ClipboardList, Layers, PlayCircle, User, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { UnitSection } from "./unit-section";
import { ExamRow } from "./exam-row";

type DrawerTab = "units" | "exams";

export function SubjectDrawer({ subject, categoryId, gradientClass, open, onClose, locale }: { subject: Subject; categoryId: string; gradientClass: string; open: boolean; onClose: () => void; locale: string }) {
    const tCommon = useTranslations("Common");
    const t = useTranslations("Tracks");
    const [tab, setTab] = useState<DrawerTab>("units");
    const drawerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onClose]);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const isRtl = locale === "ar";
    const allExams = [
        ...subject.exams,
        ...subject.units.flatMap(u => [...u.exams, ...u.subUnits.flatMap(su => su.exams)]),
    ];

    return (
        <>
            <div onClick={onClose} className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} />
            <div ref={drawerRef} dir={isRtl ? "rtl" : "ltr"} className={`fixed top-0 ${isRtl ? "right-0" : "left-0"} h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : isRtl ? "-translate-x-full" : "translate-x-full"}`}>
                <div className={`bg-linear-to-br ${gradientClass} px-6 py-5 shrink-0`}>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-lg leading-tight">{subject.title}</h2>
                                <div className="flex items-center gap-1 mt-1">
                                    <User className="w-3 h-3 text-white/70" />
                                    <span className="text-white/80 text-xs">{subject.teacherName}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0 mt-0.5"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-1.5 text-white/90 text-xs">
                            <Layers className="w-3.5 h-3.5" />
                            <span className="font-bold">{subject.countUnits}</span>
                            <span>{tCommon("unit")}</span>
                        </div>
                        <div className="w-px h-3 bg-white/30" />
                        <div className="flex items-center gap-1.5 text-white/90 text-xs">
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span className="font-bold">{subject.countLessons}</span>
                            <span>{tCommon("lesson")}</span>
                        </div>
                        <div className="w-px h-3 bg-white/30" />
                        <div className="flex items-center gap-1.5 text-white/90 text-xs">
                            <ClipboardList className="w-3.5 h-3.5" />
                            <span className="font-bold">{subject.countExams}</span>
                            <span>{tCommon("exam")}</span>
                        </div>
                    </div>
                </div>

                <div className="flex border-b border-gray-100 shrink-0 bg-white">
                    <button type="button" onClick={() => setTab("units")} className={`flex-1 py-3.5 text-sm font-semibold transition-colors border-b-2 ${tab === "units" ? "border-[#6c3aff] text-[#6c3aff]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                        <span className="flex items-center justify-center gap-1.5">
                            <Layers className="w-4 h-4" />
                            {t("drawer.units")}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab("exams")}
                        className={`flex-1 py-3.5 text-sm font-semibold transition-colors border-b-2 ${tab === "exams" ? "border-green-500 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                        <span className="flex items-center justify-center gap-1.5">
                            <ClipboardList className="w-4 h-4" />
                            {t("drawer.exams")}
                            {allExams.length > 0 && (
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {allExams.length}
                                </span>
                            )}
                        </span>
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {tab === "units" && (
                        subject.units.length === 0 ? (
                            <p className="text-center text-gray-400 py-12 text-sm">{t("drawer.noUnits")}</p>
                        ) : (
                            subject.units.map((unit, i) => (
                                <UnitSection key={unit.unitId} unit={unit} categoryId={categoryId} subjectId={subject.subjectId} index={i} tCommon={(k) => tCommon(k)} />
                            ))
                        )
                    )}

                    {tab === "exams" && (
                        allExams.length === 0 ? (
                            <p className="text-center text-gray-400 py-12 text-sm">{t("drawer.noExams")}</p>
                        ) : (
                            <div className="space-y-2">
                                {allExams.map(e => <ExamRow key={e.examId} exam={e} categoryId={categoryId} tCommon={(k) => tCommon(k)} />)}
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
}