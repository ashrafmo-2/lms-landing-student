"use client";

import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ClipboardList,
  Clock3,
  ExternalLink,
  FileText,
  ImageIcon,
  Loader2,
  LogOut,
  Medal,
  Paperclip,
  Play,
  RotateCcw,
  Send,
  ShieldAlert,
  Trophy,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  type ExamAttemptResult,
  type ExamDetail,
  getExamAttempt,
  getExamById,
  type StartedExamAttempt,
  type SubmitExamResult,
  startExam,
  submitExamAttempt,
} from "@/entities/exams";
import { StudentAuthenticatedGuard } from "@/features/auth/components/student-authenticated-guard";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { Footer } from "@/widgets/landing-footer";
import { Navbar } from "@/widgets/landing-navbar";
import {
  formatExamDateTime,
  formatMinutes,
  formatPercent,
} from "../lib/format";

type ResultView = ExamAttemptResult | SubmitExamResult;

type MultiAnswerMap = Record<number, number[]>;

function getAttachmentKind(url: string) {
  const cleanUrl = url.split("?")[0].toLowerCase();

  if (/\.(png|jpe?g|gif|webp|svg|bmp)$/i.test(cleanUrl)) return "image";
  if (/\.pdf$/i.test(cleanUrl)) return "pdf";

  return "file";
}

function AttachmentPreview({ url }: { url: string | null }) {
  if (!url) return null;

  const kind = getAttachmentKind(url);

  if (kind === "image") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 block overflow-hidden rounded-2xl border border-gray-100 bg-gray-50"
      >
        <div
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url("${url}")` }}
        />
        <div className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-500">
          <ImageIcon className="h-4 w-4" />
          فتح الصورة
          <ExternalLink className="h-3.5 w-3.5" />
        </div>
      </a>
    );
  }

  if (kind === "pdf") {
    return (
      <div className="mt-3 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <FileText className="h-4 w-4 text-red-500" />
            ملف PDF مرفق
          </div>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#6c3aff]"
          >
            فتح
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <object
          data={url}
          type="application/pdf"
          className="h-64 w-full bg-white"
        >
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex h-32 items-center justify-center text-sm font-bold text-[#6c3aff]"
          >
            فتح ملف PDF
          </a>
        </object>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="mt-3 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-100"
    >
      <Paperclip className="h-4 w-4 text-[#6c3aff]" />
      فتح المرفق
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

function DetailLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#6c3aff]" />
        <p className="text-sm font-semibold text-gray-500">
          جاري تحميل الاختبار...
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      <Icon className="mb-2 h-5 w-5 text-[#6c3aff]" />
      <p className="text-xs font-bold text-gray-400">{label}</p>
      <p className="mt-1 text-lg font-extrabold text-gray-900">{value}</p>
    </div>
  );
}

function ResultPanel({
  result,
  locale,
  onClose,
}: {
  result: ResultView;
  locale: string;
  onClose: () => void;
}) {
  const answers = result.answers ?? [];

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
            <Trophy className="h-7 w-7 text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            نتيجة المحاولة
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            تم التسليم في {formatExamDateTime(result.submittedAt, locale)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50"
        >
          <RotateCcw className="h-4 w-4" />
          رجوع للتفاصيل
        </button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatCard
          icon={Medal}
          label="الدرجة"
          value={`${result.score}/${result.totalScore}`}
        />
        <StatCard
          icon={BarChart3}
          label="النسبة"
          value={formatPercent(result.percentage, locale)}
        />
        <StatCard
          icon={ClipboardList}
          label="إظهار الإجابات"
          value={result.showResult ? "متاح" : "غير متاح"}
        />
      </div>

      {!result.showResult ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-700">
          إعدادات الاختبار لا تسمح بعرض تفاصيل الإجابات حالياً.
        </div>
      ) : answers.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm font-semibold text-gray-500">
          لا توجد تفاصيل إجابات معروضة لهذه المحاولة.
        </div>
      ) : (
        <div className="space-y-3">
          {answers.map((answer, index) => {
            const answerText =
              "answerText" in answer
                ? answer.answerText
                : `اختيار #${answer.answerId}`;
            const questionText =
              "questionText" in answer
                ? answer.questionText
                : `السؤال ${index + 1}`;

            return (
              <div
                key={answer.questionId}
                className={`rounded-2xl border p-4 ${
                  answer.isCorrect
                    ? "border-green-100 bg-green-50"
                    : "border-red-100 bg-red-50"
                }`}
              >
                <div className="mb-3 flex items-start gap-3">
                  {answer.isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                  )}
                  <div>
                    <p className="font-bold text-gray-900">{questionText}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      إجابتك: {answerText}
                    </p>
                    {!answer.isCorrect && answer.correctAnswer && (
                      <p className="mt-1 text-sm font-semibold text-green-700">
                        الإجابة الصحيحة: {answer.correctAnswer.answerText}
                      </p>
                    )}
                    {answer.explanation && (
                      <p className="mt-2 rounded-xl bg-white/70 px-3 py-2 text-xs leading-5 text-gray-600">
                        {answer.explanation}
                      </p>
                    )}
                    <AttachmentPreview url={answer.attachment ?? null} />
                    {!answer.isCorrect && answer.correctAnswer?.explanation && (
                      <p className="mt-2 rounded-xl bg-white/70 px-3 py-2 text-xs leading-5 text-green-700">
                        تفسير الإجابة الصحيحة:{" "}
                        {answer.correctAnswer.explanation}
                      </p>
                    )}
                    {!answer.isCorrect && answer.correctAnswer?.attachment && (
                      <AttachmentPreview
                        url={answer.correctAnswer.attachment}
                      />
                    )}
                  </div>
                </div>
                <p className="text-xs font-bold text-gray-500">
                  الدرجة المكتسبة: {answer.gradeEarned}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SubmitSuccessPanel({
  onBackToDetails,
}: {
  onBackToDetails: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl rounded-[2rem] border border-green-100 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-extrabold text-gray-900">
        تم تسليم الاختبار بنجاح
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
        إجاباتك اتبعتت واتحفظت. تقدر ترجع لتفاصيل الاختبار وتشوف سجل المحاولات
        والتحديثات المتاحة.
      </p>
      <button
        type="button"
        onClick={onBackToDetails}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#6c3aff] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#6c3aff]/20 transition-colors hover:bg-[#5228e8]"
      >
        <ClipboardList className="h-4 w-4" />
        العودة لتفاصيل الاختبار
      </button>
    </div>
  );
}

function AttemptWorkspace({
  attempt,
  submitting,
  onCancel,
  onSubmit,
}: {
  attempt: StartedExamAttempt;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (answers: MultiAnswerMap) => Promise<void>;
}) {
  const [selectedAnswers, setSelectedAnswers] = useState<MultiAnswerMap>({});
  const [activeQuestionId, setActiveQuestionId] = useState(
    attempt.questions[0]?.questionId,
  );
  const [secondsLeft, setSecondsLeft] = useState(
    Math.max(attempt.durationInMinutes * 60, 0),
  );
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [showIncompleteSubmitWarning, setShowIncompleteSubmitWarning] =
    useState(false);
  const [pendingExitHref, setPendingExitHref] = useState<string | null>(null);
  const allowPageUnloadRef = useRef(false);
  const hasTimer = attempt.durationInMinutes > 0;

  useEffect(() => {
    setSelectedAnswers({});
    setActiveQuestionId(attempt.questions[0]?.questionId);
    setSecondsLeft(Math.max(attempt.durationInMinutes * 60, 0));
    setShowIncompleteSubmitWarning(false);
    setShowExitWarning(false);
    setPendingExitHref(null);
    allowPageUnloadRef.current = false;
  }, [attempt]);

  useEffect(() => {
    if (!hasTimer || secondsLeft <= 0 || submitting) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [hasTimer, secondsLeft, submitting]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (submitting || allowPageUnloadRef.current) return;

      event.preventDefault();
      event.returnValue =
        "أنت داخل محاولة اختبار حالياً. لو خرجت أو عملت تحديث قبل التسليم قد تخسر المحاولة.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [submitting]);

  useEffect(() => {
    const openExitWarning = (href: string | null = null) => {
      setPendingExitHref(href);
      setShowExitWarning(true);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const isRefreshShortcut =
        event.key === "F5" ||
        ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "r");

      if (!isRefreshShortcut || submitting) return;

      event.preventDefault();
      openExitWarning();
    };

    const handleClick = (event: MouseEvent) => {
      if (
        submitting ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      const anchor =
        target instanceof Element
          ? target.closest<HTMLAnchorElement>("a[href]")
          : null;

      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      const nextUrl = new URL(anchor.href, window.location.href);
      const currentUrl = new URL(window.location.href);
      const isSameDocument =
        nextUrl.origin === currentUrl.origin &&
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search;

      if (isSameDocument) return;

      event.preventDefault();
      openExitWarning(nextUrl.href);
    };

    const handlePopState = () => {
      if (submitting) return;

      window.history.pushState(
        { examAttemptLocked: true },
        "",
        window.location.href,
      );
      openExitWarning();
    };

    window.history.pushState(
      { examAttemptLocked: true },
      "",
      window.location.href,
    );
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleClick, true);
    };
  }, [submitting]);

  const activeIndex = attempt.questions.findIndex(
    (question) => question.questionId === activeQuestionId,
  );
  const activeQuestion = attempt.questions[activeIndex] ?? attempt.questions[0];
  const answeredCount = Object.values(selectedAnswers).filter(
    (answers) => answers.length > 0,
  ).length;
  const progress = attempt.questions.length
    ? (answeredCount / attempt.questions.length) * 100
    : 0;
  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  const submitAnswers = async () => {
    setShowIncompleteSubmitWarning(false);
    await onSubmit(selectedAnswers);
  };

  const handleSubmit = async () => {
    const unansweredCount = attempt.questions.length - answeredCount;

    if (unansweredCount > 0) {
      setShowIncompleteSubmitWarning(true);
      return;
    }

    await submitAnswers();
  };

  const handleConfirmExit = () => {
    if (pendingExitHref) {
      allowPageUnloadRef.current = true;
      window.location.assign(pendingExitHref);
      return;
    }

    onCancel();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:self-start">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400">الوقت المتبقي</p>
            <p
              className={`mt-1 text-2xl font-extrabold ${secondsLeft < 120 ? "text-red-600" : "text-gray-900"}`}
            >
              {hasTimer ? `${minutes}:${seconds}` : "امتحان مفتوح"}
            </p>
          </div>
          <Clock3 className="h-8 w-8 text-[#6c3aff]" />
        </div>

        <div className="mb-5">
          <div className="mb-2 flex justify-between text-xs font-bold text-gray-500">
            <span>التقدم</span>
            <span>
              {answeredCount}/{attempt.questions.length}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#6c3aff] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {attempt.questions.map((question, index) => {
            const active = question.questionId === activeQuestion.questionId;
            const answered = selectedAnswers[question.questionId]?.length > 0;

            return (
              <button
                key={question.questionId}
                type="button"
                onClick={() => setActiveQuestionId(question.questionId)}
                className={`h-10 rounded-xl text-sm font-extrabold transition-colors ${
                  active
                    ? "bg-[#6c3aff] text-white"
                    : answered
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </aside>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold text-[#6c3aff]">
              السؤال {activeIndex + 1} من {attempt.questions.length}
            </p>
            <h2 className="text-xl font-extrabold leading-relaxed text-gray-900">
              {activeQuestion.questionText}
            </h2>
            <p className="mt-2 text-sm font-bold text-gray-400">
              الدرجة: {activeQuestion.grade}
            </p>
            {activeQuestion.isMultiAnswer && (
              <p className="mt-2 inline-flex rounded-full bg-[#ede9ff] px-3 py-1 text-xs font-bold text-[#6c3aff]">
                يمكن اختيار أكثر من إجابة
              </p>
            )}
            <AttachmentPreview url={activeQuestion.attachment} />
          </div>
          <button
            type="button"
            onClick={() => {
              setPendingExitHref(null);
              setShowExitWarning(true);
            }}
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50"
          >
            خروج من المحاولة
          </button>
        </div>

        <div className="space-y-3">
          {activeQuestion.answers.map((answer) => {
            const selected = selectedAnswers[
              activeQuestion.questionId
            ]?.includes(answer.answerId);

            return (
              <div
                key={answer.answerId}
                className={`rounded-2xl border p-4 transition-all ${
                  selected
                    ? "border-[#6c3aff] bg-[#f5f3ff] text-[#6c3aff] shadow-sm"
                    : "border-gray-100 bg-white text-gray-700 hover:border-[#d8ccff] hover:bg-[#fbfaff]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAnswers((current) => {
                      const currentQuestionAnswers =
                        current[activeQuestion.questionId] ?? [];
                      const nextAnswers = activeQuestion.isMultiAnswer
                        ? currentQuestionAnswers.includes(answer.answerId)
                          ? currentQuestionAnswers.filter(
                              (answerId) => answerId !== answer.answerId,
                            )
                          : [...currentQuestionAnswers, answer.answerId]
                        : [answer.answerId];

                      return {
                        ...current,
                        [activeQuestion.questionId]: nextAnswers,
                      };
                    });
                  }}
                  className="flex w-full items-start gap-3 text-start"
                >
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border text-xs font-extrabold ${
                      activeQuestion.isMultiAnswer
                        ? "rounded-lg"
                        : "rounded-full"
                    } ${
                      selected
                        ? "border-[#6c3aff] bg-[#6c3aff] text-white"
                        : "border-gray-200 text-gray-400"
                    }`}
                  >
                    {selected ? <CheckCircle2 className="h-4 w-4" /> : ""}
                  </span>
                  <span className="block min-w-0 flex-1 font-semibold">
                    {answer.answerText}
                  </span>
                </button>
                {(answer.explanation || answer.attachment) && (
                  <div className="mt-3 ps-10">
                    {answer.explanation && (
                      <p className="rounded-xl bg-white/70 px-3 py-2 text-xs leading-5 text-gray-500">
                        {answer.explanation}
                      </p>
                    )}
                    <AttachmentPreview url={answer.attachment} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              disabled={activeIndex <= 0}
              onClick={() =>
                setActiveQuestionId(
                  attempt.questions[activeIndex - 1].questionId,
                )
              }
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              السابق
            </button>
            <button
              type="button"
              disabled={activeIndex >= attempt.questions.length - 1}
              onClick={() =>
                setActiveQuestionId(
                  attempt.questions[activeIndex + 1].questionId,
                )
              }
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              التالي
            </button>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6c3aff] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#6c3aff]/20 transition-colors hover:bg-[#5228e8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            تسليم الاختبار
          </button>
        </div>
      </section>

      {showIncompleteSubmitWarning && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0f172a]/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="bg-linear-to-br from-amber-500 via-orange-500 to-[#6c3aff] p-6 text-white">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-extrabold">
                في أسئلة لسه من غير إجابة
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/85">
                تقدر تسلّم الاختبار دلوقتي، لكن أي سؤال مش متجاوب عليه مش هيتحسب
                لك بدرجة. الأفضل تراجع قبل التسليم النهائي.
              </p>
            </div>

            <div className="space-y-4 p-6">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-green-50 p-3">
                  <p className="text-xs font-bold text-green-700">أجبت</p>
                  <p className="mt-1 text-lg font-extrabold text-green-800">
                    {answeredCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-3">
                  <p className="text-xs font-bold text-amber-700">بدون إجابة</p>
                  <p className="mt-1 text-lg font-extrabold text-amber-800">
                    {attempt.questions.length - answeredCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-3">
                  <p className="text-xs font-bold text-gray-400">الإجمالي</p>
                  <p className="mt-1 text-lg font-extrabold text-gray-900">
                    {attempt.questions.length}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-800">
                التسليم النهائي هيبعت الإجابات المختارة فقط. راجع الأسئلة
                المتبقية لو عايز تزوّد فرصتك في الدرجة.
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setShowIncompleteSubmitWarning(false)}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-extrabold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  راجع الإجابات
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={submitAnswers}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6c3aff] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#6c3aff]/20 transition-colors hover:bg-[#5228e8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  سلّم رغم النواقص
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExitWarning && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0f172a]/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="bg-linear-to-br from-red-600 to-[#6c3aff] p-6 text-white">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-extrabold">
                أنت داخل الاختبار الآن
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/80">
                لو خرجت من المحاولة أو عملت تحديث للصفحة قبل ما تسلّم الاختبار،
                ممكن تخسر المحاولة وتتحسب عليك. كمل الحل وسلّم إجاباتك عشان
                نتيجتك تتحفظ.
              </p>
            </div>

            <div className="space-y-4 p-6">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-gray-50 p-3">
                  <p className="text-xs font-bold text-gray-400">أجبت</p>
                  <p className="mt-1 text-lg font-extrabold text-gray-900">
                    {answeredCount}/{attempt.questions.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-3">
                  <p className="text-xs font-bold text-gray-400">المتبقي</p>
                  <p className="mt-1 text-lg font-extrabold text-gray-900">
                    {hasTimer ? `${minutes}:${seconds}` : "مفتوح"}
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-3">
                  <p className="text-xs font-bold text-gray-400">الحالة</p>
                  <p className="mt-1 text-lg font-extrabold text-red-600">
                    غير مسلّم
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-800">
                النصيحة: راجع إجاباتك، ثم اضغط "تسليم الاختبار". الخروج الآن
                مخاطرة كبيرة.
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={handleConfirmExit}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-extrabold text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  الخروج رغم التحذير
                </button>
                <button
                  type="button"
                  onClick={() => setShowExitWarning(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6c3aff] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#6c3aff]/20 transition-colors hover:bg-[#5228e8]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  أكمل الاختبار
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ExamDetailPage({
  examId,
  backHref,
}: {
  examId: string;
  backHref: string;
}) {
  const locale = useLocale();
  const { isAuthenticated, isLoading } = useAuth();
  const [detail, setDetail] = useState<ExamDetail | null>(null);
  const [attempt, setAttempt] = useState<StartedExamAttempt | null>(null);
  const [result, setResult] = useState<ResultView | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resultLoadingId, setResultLoadingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const direction = locale === "ar" ? "rtl" : "ltr";
  const localizedBackHref = backHref.startsWith("/")
    ? `/${locale}${backHref}`
    : `/${locale}/${backHref}`;

  const loadDetail = useCallback(() => {
    if (isLoading || !isAuthenticated) return;

    setLoading(true);
    setError("");

    getExamById(examId)
      .then(setDetail)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [examId, isAuthenticated, isLoading]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const handleStart = async () => {
    try {
      setStarting(true);
      setError("");
      setResult(null);
      setSubmitSuccess(false);
      const nextAttempt = await startExam(examId);
      setAttempt(nextAttempt);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setStarting(false);
    }
  };

  const handleSubmit = async (answersByQuestion: MultiAnswerMap) => {
    if (!attempt) return;

    try {
      setSubmitting(true);
      setError("");
      const payload = Object.entries(answersByQuestion)
        .filter(([, answerIds]) => answerIds.length > 0)
        .map(([questionId, answerIds]) => ({
          questionId: Number(questionId),
          answerIds,
        }));
      await submitExamAttempt(attempt.attemptId, payload);
      setResult(null);
      setSubmitSuccess(true);
      setAttempt(null);
      loadDetail();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleShowAttempt = async (attemptId: number) => {
    try {
      setResultLoadingId(attemptId);
      setError("");
      const attemptResult = await getExamAttempt(attemptId);
      setResult(attemptResult);
      setSubmitSuccess(false);
      setAttempt(null);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setResultLoadingId(null);
    }
  };

  const contextLabel = useMemo(() => {
    if (!detail) return "";
    return [
      detail.category.title,
      detail.subject?.title,
      detail.unit?.title,
      detail.subUnit?.title,
    ]
      .filter(Boolean)
      .join(" · ");
  }, [detail]);

  return (
    <StudentAuthenticatedGuard>
      <main className="flex min-h-screen flex-col bg-gray-50" dir={direction}>
        <Navbar />

        <div className="grow pt-24 pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loading ? (
              <DetailLoader />
            ) : !detail ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-red-700">
                {error || "لم نتمكن من تحميل الاختبار."}
              </div>
            ) : attempt ? (
              <>
                {error && (
                  <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                    {error}
                  </div>
                )}
                <AttemptWorkspace
                  attempt={attempt}
                  submitting={submitting}
                  onCancel={() => setAttempt(null)}
                  onSubmit={handleSubmit}
                />
              </>
            ) : submitSuccess ? (
              <SubmitSuccessPanel
                onBackToDetails={() => setSubmitSuccess(false)}
              />
            ) : result ? (
              <ResultPanel
                result={result}
                locale={locale}
                onClose={() => setResult(null)}
              />
            ) : (
              <>
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <Link
                      href={localizedBackHref}
                      className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-[#6c3aff]"
                    >
                      <ArrowRight className="h-4 w-4 rotate-180" />
                      رجوع
                    </Link>
                    <p className="mb-2 text-sm font-bold text-[#6c3aff]">
                      {contextLabel}
                    </p>
                    <h1 className="text-2xl font-extrabold text-gray-900 md:text-4xl">
                      {detail.title}
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-500">
                      {detail.description ||
                        "راجع تفاصيل الاختبار، ثم ابدأ محاولة عندما تكون جاهزاً."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleStart}
                    disabled={!detail.canStart || starting}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6c3aff] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#6c3aff]/20 transition-colors hover:bg-[#5228e8] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                  >
                    {starting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    {detail.canStart ? "ابدأ الاختبار" : "غير متاح للبدء"}
                  </button>
                </div>

                {error && (
                  <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                    {error}
                  </div>
                )}

                {!detail.canStart && (
                  <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-700">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                    هذا الاختبار محدود وقد تم تسليم محاولة سابقة، لذلك لا يمكن
                    بدء محاولة جديدة.
                  </div>
                )}

                <div className="mb-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    icon={Clock3}
                    label="المدة"
                    value={formatMinutes(detail.durationInMinutes, locale)}
                  />
                  <StatCard
                    icon={ClipboardList}
                    label="عدد الأسئلة"
                    value={detail.questionsCount}
                  />
                  <StatCard
                    icon={Trophy}
                    label="الدرجة النهائية"
                    value={detail.totalMarks}
                  />
                  <StatCard
                    icon={Medal}
                    label="أفضل نتيجة"
                    value={
                      detail.myBestScore === null
                        ? "-"
                        : `${detail.myBestScore}/${detail.totalMarks}`
                    }
                  />
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                  <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-extrabold text-gray-900">
                          سجل المحاولات
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                          يمكنك مراجعة نتيجة أي محاولة تم تسليمها.
                        </p>
                      </div>
                      <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-bold text-gray-500">
                        {detail.attempts.length} محاولة
                      </span>
                    </div>

                    {detail.attempts.length === 0 ? (
                      <div className="rounded-2xl bg-gray-50 p-6 text-center text-sm font-semibold text-gray-500">
                        لم تبدأ أي محاولة بعد.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {detail.attempts.map((item) => (
                          <button
                            key={item.attemptId}
                            type="button"
                            onClick={() => handleShowAttempt(item.attemptId)}
                            className="flex w-full flex-col gap-3 rounded-2xl border border-gray-100 p-4 text-start transition-colors hover:border-[#d8ccff] hover:bg-[#fbfaff] md:flex-row md:items-center md:justify-between"
                          >
                            <div>
                              <p className="font-extrabold text-gray-900">
                                محاولة #{item.attemptId}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-gray-400">
                                {formatExamDateTime(item.submittedAt, locale)}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="rounded-full bg-[#ede9ff] px-3 py-1 text-xs font-extrabold text-[#6c3aff]">
                                {formatPercent(item.percentage, locale)}
                              </span>
                              <span className="text-sm font-extrabold text-gray-900">
                                {item.score}/{item.totalScore}
                              </span>
                              {resultLoadingId === item.attemptId ? (
                                <Loader2 className="h-4 w-4 animate-spin text-[#6c3aff]" />
                              ) : (
                                <ChevronLeft className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </section>

                  <aside className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-lg font-extrabold text-gray-900">
                      ترتيبك وأداء الاختبار
                    </h2>
                    <div className="space-y-3">
                      <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-xs font-bold text-gray-400">
                          ترتيبك
                        </p>
                        <p className="mt-1 text-2xl font-extrabold text-gray-900">
                          {detail.rank ? `#${detail.rank}` : "-"}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-xs font-bold text-gray-400">
                          المشاركون
                        </p>
                        <p className="mt-1 text-2xl font-extrabold text-gray-900">
                          {detail.totalParticipants}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-xs font-bold text-gray-400">
                          عرض النتيجة
                        </p>
                        <p className="mt-1 text-sm font-extrabold text-gray-900">
                          {detail.showResult
                            ? "بعد التسليم مباشرة"
                            : "غير متاح من إعدادات الاختبار"}
                        </p>
                      </div>
                    </div>
                  </aside>
                </div>
              </>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </StudentAuthenticatedGuard>
  );
}
