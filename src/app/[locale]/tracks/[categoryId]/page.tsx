"use client";

import { useEffect, useState } from "react";
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
    User,
    CheckCircle,
    Tag,
} from "lucide-react";
import { getCategoryById, type CategoryDetail, type Subject, type Lesson } from "@/entities/categories/api";
import { Navbar } from "@/widgets/landing-navbar";
import { Footer } from "@/widgets/landing-footer";
import { useTranslations, useLocale } from "next-intl";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const GRADIENTS = [
    "from-blue-600 to-blue-900",
    "from-purple-600 to-indigo-900",
    "from-teal-500 to-emerald-800",
    "from-rose-500 to-pink-900",
    "from-orange-500 to-amber-800",
    "from-cyan-500 to-sky-800",
];

const lessonTypeIcon = (type: Lesson["type"]) => {
    if (type === "video") return <PlayCircle className="w-4 h-4 text-[#6c3aff]" />;
    if (type === "pdf") return <FileText className="w-4 h-4 text-orange-500" />;
    return <ClipboardList className="w-4 h-4 text-green-500" />;
};

// ─── Subject Accordion Card ───────────────────────────────────────────────────

function SubjectCard({ subject, index }: { subject: Subject; index: number }) {
    const tCommon = useTranslations("Common");
    const [open, setOpen] = useState(false);
    const [openUnit, setOpenUnit] = useState<number | null>(null);
    const gradient = GRADIENTS[index % GRADIENTS.length];

    const lessonTypeBadge = (type: Lesson["type"]) => {
        const map = {
            video: "bg-[#ede9ff] text-[#6c3aff]",
            pdf: "bg-orange-50 text-orange-600",
            quiz: "bg-green-50 text-green-600",
        };
        const label = { video: tCommon("video"), pdf: tCommon("pdf"), quiz: tCommon("quiz") };
        return (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${map[type]}`}>
                {label[type]}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Subject header — click to toggle */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full text-right"
            >
                <div className={`bg-linear-to-br ${gradient} px-6 py-5 flex items-center justify-between gap-4`}>
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-right">
                            <p className="text-white font-bold text-lg leading-tight">{subject.name}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                                <User className="w-3 h-3 text-white/70" />
                                <p className="text-white/80 text-xs">{subject.doctorName}</p>
                            </div>
                        </div>
                    </div>
                    <ChevronDown
                        className={`w-5 h-5 text-white shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    />
                </div>

                {/* Subject stats bar */}
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-6">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Layers className="w-4 h-4 text-[#6c3aff]" />
                        <span className="font-bold text-gray-900">{subject.totalUnits}</span>
                        <span>{tCommon("unit")}</span>
                    </div>
                    <div className="w-px h-4 bg-gray-200" />
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <PlayCircle className="w-4 h-4 text-[#6c3aff]" />
                        <span className="font-bold text-gray-900">{subject.totalLessons}</span>
                        <span>{tCommon("lesson")}</span>
                    </div>
                    <div className="w-px h-4 bg-gray-200" />
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <ClipboardList className="w-4 h-4 text-green-500" />
                        <span className="font-bold text-gray-900">{subject.totalExams}</span>
                        <span>{tCommon("exam")}</span>
                    </div>
                </div>
            </button>

            {/* Units accordion */}
            {open && (
                <div className="divide-y divide-gray-50">
                    {subject.units.map((unit) => (
                        <div key={unit.unitId}>
                            <button
                                type="button"
                                onClick={() =>
                                    setOpenUnit((prev) => (prev === unit.unitId ? null : unit.unitId))
                                }
                                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-right"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-[#ede9ff] flex items-center justify-center shrink-0">
                                        <Layers className="w-3.5 h-3.5 text-[#6c3aff]" />
                                    </div>
                                    <span className="font-semibold text-gray-800 text-sm">{unit.title}</span>
                                    <span className="text-xs text-gray-400">
                                        ({unit.lessons.length} {tCommon("lesson")})
                                    </span>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${openUnit === unit.unitId ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {/* Lessons list */}
                            {openUnit === unit.unitId && (
                                <ul className="px-6 pb-4 space-y-2">
                                    {unit.lessons.map((lesson) => (
                                        <li
                                            key={lesson.lessonId}
                                            className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-4 py-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                {lessonTypeIcon(lesson.type)}
                                                <span className="text-sm text-gray-700">{lesson.title}</span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {lessonTypeBadge(lesson.type)}
                                                {lesson.duration !== "—" && (
                                                    <span className="text-xs text-gray-400">{lesson.duration}</span>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
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
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
            ))}
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

    function formatPrice(n: number) {
        return `${n.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} ${tCommon("currency")}`;
    }

    useEffect(() => {
        getCategoryById(Number(categoryId))
            .then(setDetail)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [categoryId]);

    const gradient = GRADIENTS[Number(categoryId) % GRADIENTS.length];
    const hasDiscount =
        detail && detail.priceBeforeDiscount > detail.priceAfterDiscount;

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
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 ltr:rotate-0" />
                        <Link href="/tracks" className="hover:text-[#6c3aff] transition-colors">
                            {tLanding("navbar.tracks")}
                        </Link>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 ltr:rotate-0" />
                        <span className="text-gray-900 font-medium truncate max-w-50">
                            {detail?.name ?? "..."}
                        </span>
                    </nav>

                    {loading ? (
                        <Skeleton />
                    ) : !detail ? (
                        <div className="text-center py-24 text-gray-500">
                            {t("notFound")}
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* ── Hero banner ── */}
                            <div
                                className={`bg-linear-to-br ${gradient} rounded-3xl p-8 md:p-12 relative overflow-hidden`}
                            >
                                <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full" />
                                <div className="absolute -left-4 -bottom-4 w-40 h-40 bg-white/5 rounded-full" />

                                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                                    <div className="space-y-3">
                                        <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                                            <Tag className="w-3 h-3" />
                                            {detail.tag}
                                        </span>
                                        <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                                            {detail.name}
                                        </h1>
                                        <p className="text-white/80 text-base max-w-xl leading-relaxed">
                                            {detail.description}
                                        </p>
                                    </div>

                                    {/* Price card */}
                                    <div className="bg-white rounded-2xl p-5 shadow-xl shrink-0 min-w-45">
                                        {hasDiscount && (
                                            <p className="text-xs text-gray-400 line-through mb-0.5">
                                                {formatPrice(detail.priceBeforeDiscount)}
                                            </p>
                                        )}
                                        <p className="text-2xl font-extrabold text-[#6c3aff]">
                                            {formatPrice(detail.priceAfterDiscount)}
                                        </p>
                                        {hasDiscount && (
                                            <span className="inline-block mt-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                                {tCommon("save")}{" "}
                                                {formatPrice(
                                                    detail.priceBeforeDiscount - detail.priceAfterDiscount
                                                )}
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            className="mt-4 w-full bg-[#6c3aff] hover:bg-[#5228e8] text-white font-bold py-2.5 rounded-xl transition-all text-sm shadow-md shadow-[#6c3aff]/30"
                                        >
                                            {tCommon("subscribeNow")}
                                        </button>
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
                                    <div
                                        key={s.label}
                                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center gap-2"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                            {s.icon}
                                        </div>
                                        <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                                        <p className="text-xs text-gray-500">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* ── What's included ── */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    {t("whatIncluded")}
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {detail.subjects.map((s) => (
                                        <span
                                            key={s.subjectId}
                                            className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-lg font-medium"
                                        >
                                            {s.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* ── Subjects accordion ── */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">
                                    {t("subjectsCount", { count: detail.subjects.length })}
                                </h2>
                                <div className="space-y-4">
                                    {detail.subjects.map((subject, index) => (
                                        <SubjectCard
                                            key={subject.subjectId}
                                            subject={subject}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
