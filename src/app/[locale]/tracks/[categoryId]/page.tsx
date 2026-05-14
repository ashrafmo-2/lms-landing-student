"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    ClipboardList,
    Layers,
    PlayCircle,
    FileText,
    ChevronDown,
    ChevronRight,
    User,
    CheckCircle,
    Tag,
    Users,
    Clock,
    X,
    GraduationCap,
} from "lucide-react";
import {
    getCategoryById,
    type CategoryDetail,
    type Subject,
    type Unit,
    type SubUnit,
    type Lesson,
    type Exam,
} from "@/entities/categories/api";
import { cn } from "@/shared/lib/utils";
import { Navbar } from "@/widgets/landing-navbar";
import { Footer } from "@/widgets/landing-footer";
import { useTranslations, useLocale } from "next-intl";

// ─── Gradient palettes ────────────────────────────────────────────────────────

const GRADIENTS = [
    "from-blue-600 to-blue-900",
    "from-purple-600 to-indigo-900",
    "from-teal-500 to-emerald-800",
    "from-rose-500 to-pink-900",
    "from-orange-500 to-amber-800",
    "from-cyan-500 to-sky-800",
];

const CARD_ACCENT = [
    "text-blue-700",
    "text-purple-700",
    "text-teal-700",
    "text-rose-700",
    "text-orange-700",
    "text-cyan-700",
];

// ─── Lesson row (inside drawer) ───────────────────────────────────────────────

function LessonRow({ lesson, categoryId, subjectId, tCommon }: { lesson: Lesson; categoryId: string; subjectId: number; tCommon: (k: string) => string }) {
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
                {lesson.duration !== null && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.duration}{tCommon("minutes")}
                    </span>
                )}
            </div>
        </Link>
    );
}

// ─── Exam row (inside drawer) ─────────────────────────────────────────────────

function ExamRow({ exam, categoryId, tCommon }: { exam: Exam; categoryId: string; tCommon: (k: string) => string }) {
    const locale = useLocale()
    return (
        <Link
            href={`/${locale}/tracks/${categoryId}/exams/${exam.examId}`}
            className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 bg-green-50 border border-green-100 hover:bg-green-100 transition-colors group"
        >
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-green-100 group-hover:bg-green-200 flex items-center justify-center shrink-0 transition-colors">
                    <ClipboardList className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-bold text-gray-700 truncate group-hover:text-green-700 transition-colors">{exam.title}</span>
            </div>
            <span className="text-xs text-green-600 font-bold flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" />
                {exam.duration}{tCommon("minutes")}
            </span>
        </Link>
    );
}

// ─── Sub-unit section (inside drawer unit) ────────────────────────────────────

function SubUnitSection({ subUnit, categoryId, subjectId, tCommon }: { subUnit: SubUnit; categoryId: string; subjectId: number; tCommon: (k: string) => string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="rounded-xl border border-gray-100 overflow-hidden bg-white/50">
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors text-right"
            >
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-purple-100 flex items-center justify-center shrink-0">
                        <Layers className="w-3 h-3 text-purple-600" />
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

// ─── Unit section (inside drawer) ────────────────────────────────────────────

function UnitSection({ unit, categoryId, subjectId, index, tCommon }: { unit: Unit; categoryId: string; subjectId: number; index: number; tCommon: (k: string) => string }) {
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
                        open ? "bg-[#6c3aff] text-white" : "bg-[#ede9ff] text-[#6c3aff]"
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

// ─── Subject Drawer ───────────────────────────────────────────────────────────

type DrawerTab = "units" | "exams";

function SubjectDrawer({
    subject,
    categoryId,
    gradientClass,
    open,
    onClose,
    locale,
}: {
    subject: Subject;
    categoryId: string;
    gradientClass: string;
    open: boolean;
    onClose: () => void;
    locale: string;
}) {
    const tCommon = useTranslations("Common");
    const t = useTranslations("Tracks");
    const [tab, setTab] = useState<DrawerTab>("units");
    const drawerRef = useRef<HTMLDivElement>(null);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onClose]);

    // Lock body scroll when open
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
            {/* Backdrop */}
            <div onClick={onClose} className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} />

            {/* Drawer panel */}
            <div
                ref={drawerRef}
                className={`fixed top-0 ${isRtl ? "right-0" : "left-0"} h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : isRtl ? "-translate-x-full" : "translate-x-full"}`}
                dir={isRtl ? "rtl" : "ltr"}
            >
                {/* Drawer header */}
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

                    {/* Stats strip */}
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

                {/* Tabs */}
                <div className="flex border-b border-gray-100 shrink-0 bg-white">
                    <button
                        type="button"
                        onClick={() => setTab("units")}
                        className={`flex-1 py-3.5 text-sm font-semibold transition-colors border-b-2 ${tab === "units" ? "border-[#6c3aff] text-[#6c3aff]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
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

// ─── Subject Card (grid item) ─────────────────────────────────────────────────

function SubjectCard({
    subject,
    index,
    onOpen,
}: {
    subject: Subject;
    index: number;
    onOpen: () => void;
}) {
    const tCommon = useTranslations("Common");
    const t = useTranslations("Tracks");
    const gradient = GRADIENTS[index % GRADIENTS.length];
    const accent = CARD_ACCENT[index % CARD_ACCENT.length];
    const hasImage = !!subject.image;
    const [imgError, setImgError] = useState(false);
    const showImage = hasImage && !imgError;

    return (
        <button
            type="button"
            onClick={onOpen}
            className="group w-full text-right rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
        >
            {/* ── Image / Placeholder banner ── */}
            <div className="relative h-36 w-full overflow-hidden shrink-0">
                {showImage ? (
                    <>
                        {/* Actual image */}
                        <img
                            src={subject.image}
                            alt={subject.title}
                            onError={() => setImgError(true)}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Dark gradient overlay so text is always readable */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                    </>
                ) : (
                    <>
                        {/* Gradient placeholder */}
                        <div className={`absolute inset-0 bg-linear-to-br ${gradient}`} />
                        {/* Decorative circles */}
                        <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
                        <div className="absolute -right-2 -top-2 w-16 h-16 rounded-full bg-white/10" />
                        {/* Center icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <GraduationCap className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </>
                )}

                {/* Teacher avatar chip — bottom of banner */}
                <div className="absolute bottom-3 start-3 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white/30 backdrop-blur-sm border border-white/40 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-white text-xs font-medium drop-shadow-sm truncate max-w-32">
                        {subject.teacherName}
                    </span>
                </div>

                {/* Exam count badge — top corner */}
                {subject.countExams > 0 && (
                    <div className="absolute top-3 end-3 flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        <ClipboardList className="w-3 h-3" />
                        {subject.countExams}
                    </div>
                )}
            </div>

            {/* ── Card body ── */}
            <div className="flex flex-col flex-1 p-4 gap-3">
                {/* Title */}
                <div>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                        {subject.title}
                    </h3>
                    {subject.shortDescription && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                            {subject.shortDescription}
                        </p>
                    )}
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <div className="flex flex-col items-center gap-0.5">
                        <span className={`text-base font-extrabold ${accent}`}>{subject.countUnits}</span>
                        <span className="text-[10px] text-gray-400">{tCommon("unit")}</span>
                    </div>
                    <div className="w-px h-7 bg-gray-100" />
                    <div className="flex flex-col items-center gap-0.5">
                        <span className={`text-base font-extrabold ${accent}`}>{subject.countLessons}</span>
                        <span className="text-[10px] text-gray-400">{tCommon("lesson")}</span>
                    </div>
                    <div className="w-px h-7 bg-gray-100" />
                    <div className="flex flex-col items-center gap-0.5">
                        <span className="text-base font-extrabold text-green-600">{subject.countExams}</span>
                        <span className="text-[10px] text-gray-400">{tCommon("exam")}</span>
                    </div>
                </div>

                {/* CTA */}
                <div className={`flex items-center justify-center gap-1.5 text-xs font-semibold ${accent} bg-gray-50 group-hover:bg-gray-100 rounded-xl py-2 transition-colors`}>
                    <span>{t("drawer.viewDetails")}</span>
                    <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </div>
            </div>
        </button>
    );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="h-56 bg-gray-200 rounded-3xl" />
            <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded-2xl" />
                ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-48 bg-gray-200 rounded-2xl" />
                ))}
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CategoryDetailPage() {
    const t = useTranslations("Tracks");
    const tLanding = useTranslations("Landing");
    const tCommon = useTranslations("Common");
    const locale = useLocale();
    const { categoryId } = useParams<{ categoryId: string }>();

    const [detail, setDetail] = useState<CategoryDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    function formatPrice(n: number) {
        return `${n.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} ${tCommon("currency")}`;
    }

    useEffect(() => {
        setLoading(true);
        setError(false);
        getCategoryById(Number(categoryId))
            .then(setDetail)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [categoryId]);

    const gradient = GRADIENTS[Number(categoryId) % GRADIENTS.length];
    const effectivePrice = detail?.priceAfterDiscount ?? detail?.priceBeforeDiscount ?? 0;
    const hasDiscount =
        detail?.priceAfterDiscount !== null &&
        detail?.priceAfterDiscount !== undefined &&
        detail.priceBeforeDiscount > detail.priceAfterDiscount;

    const direction = locale === "ar" ? "rtl" : "ltr";

    return (
        <main className="min-h-screen flex flex-col bg-gray-50" dir={direction}>
            <Navbar />

            <div className="grow pt-24 pb-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                        <Link href="/" className="hover:text-[#6c3aff] transition-colors">
                            {tLanding("footer.home")}
                        </Link>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        <Link href={`/${locale}/tracks`} className="hover:text-[#6c3aff] transition-colors">
                            {tLanding("navbar.tracks")}
                        </Link>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        <span className="text-gray-900 font-medium truncate max-w-50">
                            {detail?.name ?? "..."}
                        </span>
                    </nav>

                    {loading ? (
                        <Skeleton />
                    ) : error || !detail ? (
                        <div className="text-center py-24 text-gray-500">{t("notFound")}</div>
                    ) : (
                        <div className="space-y-8">

                            {/* ── Hero banner ── */}
                            <div className={`bg-linear-to-br ${gradient} rounded-3xl p-8 md:p-12 relative overflow-hidden`}>
                                <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full" />
                                <div className="absolute -left-4 -bottom-4 w-40 h-40 bg-white/5 rounded-full" />

                                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                                    <div className="space-y-3">
                                        <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                                            <Tag className="w-3 h-3" />
                                            {t("integratedTrack")}
                                        </span>
                                        <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                                            {detail.name}
                                        </h1>
                                        {detail.description && (
                                            <p className="text-white/80 text-base max-w-xl leading-relaxed">
                                                {detail.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-1.5 text-white/70 text-sm">
                                            <Users className="w-4 h-4" />
                                            <span>
                                                {detail.totalSubscribers.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}{" "}
                                                {t("subscribers")}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price card */}
                                    <div className="bg-white rounded-2xl p-5 shadow-xl shrink-0 min-w-45">
                                        {hasDiscount && (
                                            <p className="text-xs text-gray-400 line-through mb-0.5">
                                                {formatPrice(detail.priceBeforeDiscount)}
                                            </p>
                                        )}
                                        <p className="text-2xl font-extrabold text-[#6c3aff]">
                                            {formatPrice(effectivePrice)}
                                        </p>
                                        {hasDiscount && detail.priceAfterDiscount !== null && (
                                            <span className="inline-block mt-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                                {tCommon("save")}{" "}
                                                {formatPrice(detail.priceBeforeDiscount - detail.priceAfterDiscount)}
                                            </span>
                                        )}
                                        {detail.isSubscribed === 1 ? (
                                            <div className="flex flex-col gap-2 mt-4">
                                                <div className="w-full bg-green-500 text-white font-bold py-2.5 rounded-xl text-sm text-center">
                                                    {t("alreadySubscribed")}
                                                </div>
                                                <Link
                                                    href={(() => {
                                                        const firstSubject = detail.subjects[0];
                                                        const firstLesson =
                                                            firstSubject?.units[0]?.lessons[0] ??
                                                            firstSubject?.units[0]?.subUnits[0]?.lessons[0];
                                                        return `/${locale}/tracks/${categoryId}/lessons/${firstLesson?.lessonId ?? 1}?subjectId=${firstSubject?.subjectId ?? 1}`;
                                                    })()}
                                                    className="w-full bg-[#6c3aff] hover:bg-[#5228e8] text-white font-bold py-2.5 rounded-xl transition-all text-sm text-center shadow-md shadow-[#6c3aff]/30"
                                                >
                                                    {tLanding("hero.getStarted")}
                                                </Link>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                className="mt-4 w-full bg-[#6c3aff] hover:bg-[#5228e8] text-white font-bold py-2.5 rounded-xl transition-all text-sm shadow-md shadow-[#6c3aff]/30"
                                            >
                                                {tCommon("subscribeNow")}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ── Stats row ── */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { icon: <BookOpen className="w-5 h-5 text-[#6c3aff]" />, value: detail.totalSubjects, label: t("stats.subject") },
                                    { icon: <Layers className="w-5 h-5 text-[#6c3aff]" />, value: detail.totalUnits, label: t("stats.unit") },
                                    { icon: <PlayCircle className="w-5 h-5 text-[#6c3aff]" />, value: detail.totalLessons, label: t("stats.lesson") },
                                    { icon: <ClipboardList className="w-5 h-5 text-green-500" />, value: detail.totalExams, label: t("stats.exam") },
                                ].map((s) => (
                                    <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center gap-2">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                            {s.icon}
                                        </div>
                                        <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                                        <p className="text-xs text-gray-500">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* ── Subjects grid ── */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {t("subjectsCount", { count: detail.subjects.length })}
                                    </h2>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                        {t("drawer.tapToExplore")}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {detail.subjects.map((subject, index) => (
                                        <SubjectCard
                                            key={subject.subjectId}
                                            subject={subject}
                                            index={index}
                                            onOpen={() => {
                                                setActiveSubject(subject);
                                                setActiveIndex(index);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>

            <Footer />

            {/* Subject detail drawer */}
            {activeSubject && (
                <SubjectDrawer
                    subject={activeSubject}
                    categoryId={categoryId}
                    gradientClass={GRADIENTS[activeIndex % GRADIENTS.length]}
                    open={activeSubject !== null}
                    onClose={() => setActiveSubject(null)}
                    locale={locale}
                />
            )}
        </main>
    );
}
