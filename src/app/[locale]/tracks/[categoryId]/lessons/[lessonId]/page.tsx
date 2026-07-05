"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

import { Link } from "@/shared/i18n/routing";
import { getSubjectById, flattenLessons, completeLesson } from "@/entities/lessons/api";
import type { SubjectDetail, LessonItem, FlatLesson } from "@/entities/lessons/model";
import { Loader2, PlayCircle, FileText, ChevronLeft, ChevronRight, Clock, CheckCircle2, ArrowRight, BookOpen, User, AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { formatDuration } from "@/shared/lib/format-duration";

function useContentProtection(ref: React.RefObject<HTMLElement | null>) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const block = (e: Event) => e.preventDefault();
        el.addEventListener("contextmenu", block);

        const blockKeys = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && ["s", "p", "u", "a"].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }
        };
        el.addEventListener("keydown", blockKeys);

        return () => {
            el.removeEventListener("contextmenu", block);
            el.removeEventListener("keydown", blockKeys);
        };
    }, [ref]);
}

function VideoPlayer({ url, title }: { url: string; title: string }) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    useContentProtection(wrapperRef);

    if (!url) {
        return (
            <div className="aspect-video bg-gray-900 rounded-2xl flex flex-col items-center justify-center gap-3 text-white/60">
                <PlayCircle className="w-12 h-12" />
                <p className="text-sm">الفيديو غير متاح بعد</p>
            </div>
        );
    }

    return (
        <div ref={wrapperRef} className="aspect-video bg-black rounded-2xl overflow-hidden shadow-xl relative select-none">
            <video
                src={url}
                controls
                className="w-full h-full object-contain"
                title={title}
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                onDragStart={(e) => e.preventDefault()}
            />
        </div>
    );
}


function PdfViewer({ url, title }: { url: string; title: string }) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    useContentProtection(wrapperRef);

    if (!url) {
        return (
            <div className="w-full rounded-2xl overflow-hidden shadow-xl bg-gray-900 flex flex-col items-center justify-center gap-3 text-white/60" style={{ height: "75vh" }}>
                <FileText className="w-12 h-12" />
                <p className="text-sm">الملف غير متاح بعد</p>
            </div>
        );
    }

    // Append PDF viewer params to hide toolbar/download in Chrome/Edge built-in viewer
    const viewerUrl = `${url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;

    return (
        <div
            ref={wrapperRef}
            className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-gray-100 select-none"
            style={{ height: "75vh" }}
            onContextMenu={(e) => e.preventDefault()}
        >
            <iframe
                src={viewerUrl}
                title={title}
                className="w-full h-full border-0"
                // No sandbox — needed for cross-origin PDF rendering
                // Protection is handled by CSS user-select + JS event blocking
                referrerPolicy="no-referrer"
            />
        </div>
    );
}

export default function LessonPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const locale = useLocale();

    const categoryId = params.categoryId as string;
    const lessonId = Number(params.lessonId);
    const subjectId = searchParams.get("subjectId") ? Number(searchParams.get("subjectId")) : null;

    const [subject, setSubject] = useState<SubjectDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<"not_found" | "forbidden" | "unknown" | null>(null);
    // optimistic completion state — starts from API value, toggled locally on success
    const [isCompleted, setIsCompleted] = useState<0 | 1>(0);
    const [completing, setCompleting] = useState(false);

    const isRtl = locale === "ar";

    // Global page-level protection: block Ctrl+S, Ctrl+P on the whole page
    useEffect(() => {
        const block = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && ["s", "p", "u"].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }
        };
        window.addEventListener("keydown", block);
        return () => window.removeEventListener("keydown", block);
    }, []);

    useEffect(() => {
        if (!subjectId) {
            setError("not_found");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        getSubjectById(subjectId)
            .then(setSubject)
            .catch((err) => {
                const status = err?.response?.status;
                if (status === 403) setError("forbidden");
                else if (status === 404) setError("not_found");
                else setError("unknown");
            })
            .finally(() => setLoading(false));
    }, [subjectId]);

    // Derive current lesson and flat list from subject
    const flatList: FlatLesson[] = subject ? flattenLessons(subject) : [];
    const currentIndex = flatList.findIndex((l) => l.lessonId === lessonId);
    const lesson: LessonItem | undefined = flatList[currentIndex];
    const prevLesson: FlatLesson | undefined = flatList[currentIndex - 1];
    const nextLesson: FlatLesson | undefined = flatList[currentIndex + 1];

    // Sync isCompleted from API whenever the lesson changes
    useEffect(() => {
        if (lesson) setIsCompleted(lesson.isCompleted);
    }, [lesson?.lessonId, lesson?.isCompleted]);

    const handleComplete = useCallback(async () => {
        if (isCompleted === 1 || completing) return;
        setCompleting(true);
        try {
            await completeLesson(lessonId);
            setIsCompleted(1);
            // Notify the sidebar to refetch so progress updates immediately
            window.dispatchEvent(new CustomEvent("lesson:completed", { detail: { lessonId } }));
        } catch {
            // silently ignore — user can retry
        } finally {
            setCompleting(false);
        }
    }, [lessonId, isCompleted, completing]);

    const navLink = useCallback((l: FlatLesson) => `/tracks/${categoryId}/lessons/${l.lessonId}?subjectId=${subjectId}`, [locale, categoryId, subjectId]);

    if (loading) {
        return (
            <div className="flex flex-col h-full items-center justify-center gap-4 min-h-screen">
                <Loader2 className="w-10 h-10 text-[#0067b8] animate-spin" />
                <p className="text-sm text-gray-500 animate-pulse">جاري تحميل الدرس...</p>
            </div>
        );
    }

    // ── Error states ─────────────────────────────────────────────────────────
    if (error || !lesson) {
        const messages = {
            forbidden: { title: "غير مصرح لك", desc: "يجب الاشتراك في هذا المسار للوصول إلى الدروس." },
            not_found: { title: "الدرس غير موجود", desc: "يبدو أن الرابط غير صحيح أو أن الدرس لم يعد متاحاً." },
            unknown: { title: "حدث خطأ", desc: "تعذر تحميل الدرس، حاول مرة أخرى." },
        };
        const msg = messages[error ?? "not_found"];
        return (
            <div className="flex h-full items-center justify-center p-6 text-center min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
                <div className="max-w-sm space-y-4">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{msg.title}</h2>
                    <p className="text-gray-500 text-sm">{msg.desc}</p>
                    <Link
                        href={`/tracks/${categoryId}`}
                        className="inline-flex items-center gap-2 bg-[#0067b8] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#004a86] transition-colors"
                    >
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                        العودة للمسار
                    </Link>
                </div>
            </div>
        );
    }

    const isVideo = lesson.type === "VIDEO";
    const isDone = lesson.isCompleted === 1;

    return (
        <div className="min-h-full flex flex-col bg-gray-50" dir={isRtl ? "rtl" : "ltr"}>

            {/* ── Top bar ── */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm px-4 md:px-6 py-3 flex items-center justify-between gap-4">
                {/* Back button + breadcrumb */}
                <div className="flex items-center gap-3 min-w-0">
                    <Link
                        href={`/tracks/${categoryId}`}
                        className="flex items-center gap-1.5 shrink-0 bg-gray-100 hover:bg-[#e8f4ff] hover:text-[#0067b8] text-gray-600 font-semibold text-xs px-3 py-2 rounded-xl transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                        <span className="hidden sm:inline">تفاصيل المسار</span>
                    </Link>
                    <div className="w-px h-5 bg-gray-200 shrink-0" />
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                            <BookOpen className="w-3 h-3 shrink-0" />
                            <span className="truncate">{subject?.title}</span>
                        </div>
                        <h1 className="text-sm font-bold text-gray-900 truncate">{lesson.title}</h1>
                    </div>
                </div>

                {/* Status badge */}
                <div
                    className={cn(
                        "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold",
                        isDone
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                    )}
                >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{isDone ? "مكتمل" : "لم يكتمل"}</span>
                </div>
            </div>

            {/* ── Main content ── */}
            <div className="flex-1 p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* Player */}
                    {isVideo
                        ? <VideoPlayer url={lesson.lessonUrl} title={lesson.title} />
                        : <PdfViewer url={lesson.lessonUrl} title={lesson.title} />
                    }

                    {/* Info bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3">
                        <div className="flex items-center gap-4">
                            {/* Type badge */}
                            <div className={cn(
                                "flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full",
                                isVideo ? "bg-[#e8f4ff] text-[#0067b8]" : "bg-orange-50 text-orange-600"
                            )}>
                                {isVideo
                                    ? <PlayCircle className="w-3.5 h-3.5" />
                                    : <FileText className="w-3.5 h-3.5" />}
                                {isVideo ? "فيديو تعليمي" : "مستند PDF"}
                            </div>
                            {/* Duration */}
                            {lesson.duration !== null && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{formatDuration(lesson.duration)}</span>
                                </div>
                            )}
                            {/* Teacher */}
                            {subject?.teacherName && (
                                <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
                                    <User className="w-3.5 h-3.5" />
                                    <span>{subject.teacherName}</span>
                                </div>
                            )}
                        </div>
                        {/* Lesson position */}
                        {flatList.length > 0 && (
                            <span className="text-xs text-gray-400 font-medium">
                                {currentIndex + 1} / {flatList.length}
                            </span>
                        )}
                    </div>

                    {/* Mark complete button */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleComplete}
                            disabled={isCompleted === 1 || completing}
                            className={cn(
                                "flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm",
                                isCompleted === 1
                                    ? "bg-green-100 text-green-700 cursor-default"
                                    : "bg-[#0067b8] hover:bg-[#004a86] text-white shadow-[#0067b8]/25 shadow-lg active:scale-95"
                            )}
                        >
                            {completing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <CheckCircle2 className="w-4 h-4" />
                            )}
                            {isCompleted === 1 ? "تم إكمال الدرس" : completing ? "جاري الحفظ..." : "خلصت الدرس"}
                        </button>
                    </div>

                    {/* Description */}
                    {subject?.longDescription && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h2 className="font-bold text-gray-900 mb-2 text-sm">عن هذه المادة</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">{subject.longDescription}</p>
                        </div>
                    )}

                    {/* ── Prev / Next navigation ── */}
                    <div className="flex items-center justify-between gap-4 pt-2 pb-8">
                        {prevLesson ? (
                            <Link
                                href={navLink(prevLesson)}
                                className="flex items-center gap-3 bg-white border border-gray-200 hover:border-[#0067b8]/40 hover:bg-[#f8fbfd] rounded-2xl px-4 py-3 transition-all group max-w-xs"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0067b8] shrink-0 rtl:rotate-0 ltr:rotate-180" />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">الدرس السابق</p>
                                    <p className="text-sm font-semibold text-gray-700 group-hover:text-[#0067b8] truncate">{prevLesson.title}</p>
                                </div>
                            </Link>
                        ) : <div />}

                        {nextLesson ? (
                            <Link
                                href={navLink(nextLesson)}
                                className="flex items-center gap-3 bg-[#0067b8] hover:bg-[#004a86] rounded-2xl px-4 py-3 transition-all group max-w-xs shadow-lg shadow-[#0067b8]/20"
                            >
                                <div className="min-w-0 text-right">
                                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-0.5">الدرس التالي</p>
                                    <p className="text-sm font-semibold text-white truncate">{nextLesson.title}</p>
                                </div>
                                <ChevronLeft className="w-5 h-5 text-white/80 shrink-0 rtl:rotate-0 ltr:rotate-180" />
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3 bg-green-500 rounded-2xl px-4 py-3 shadow-lg shadow-green-500/20">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-0.5">انتهيت</p>
                                    <p className="text-sm font-semibold text-white">آخر درس في المادة 🎉</p>
                                </div>
                                <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
