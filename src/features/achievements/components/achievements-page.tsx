"use client";

import {
  Award,
  BarChart3,
  BookOpenCheck,
  Crown,
  Medal,
  Sparkles,
  Star,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  type AchievementsData,
  type BestExamAchievement,
  getAchievements,
  type TopCategoryAchievement,
} from "@/entities/achievements";
import { StudentAuthenticatedGuard } from "@/features/auth/components/student-authenticated-guard";
import { Footer } from "@/widgets/landing-footer";
import { Navbar } from "@/widgets/landing-navbar";
import {
  formatAchievementDate,
  formatAchievementNumber,
  formatAchievementPercent,
} from "../lib/format";
import { AchievementLoading } from "./achievement-loading";
import { CelebrationConfetti } from "./celebration-confetti";

const PORTRAIT_BURST_PIECES = [
  { x: -84, y: -58, color: "#facc15", delay: 0.05, size: "h-4 w-2" },
  { x: -112, y: 4, color: "#14b8a6", delay: 0.18, size: "h-3 w-3" },
  { x: -76, y: 72, color: "#fb7185", delay: 0.28, size: "h-2 w-8" },
  { x: -22, y: -94, color: "#f97316", delay: 0.12, size: "h-2 w-7" },
  { x: 44, y: -92, color: "#ffffff", delay: 0.2, size: "h-3 w-3" },
  { x: 104, y: -38, color: "#38bdf8", delay: 0.09, size: "h-2 w-8" },
  { x: 118, y: 38, color: "#a7f3d0", delay: 0.24, size: "h-4 w-2" },
  { x: 42, y: 92, color: "#fef08a", delay: 0.16, size: "h-3 w-3" },
  { x: -28, y: 108, color: "#c084fc", delay: 0.32, size: "h-2 w-9" },
  { x: 92, y: 88, color: "#f43f5e", delay: 0.38, size: "h-3 w-3" },
];

function UserPortrait({
  name,
  avatar,
}: {
  name: string;
  avatar?: string | null;
}) {
  if (avatar) {
    return (
      <div
        role="img"
        aria-label={name}
        className="h-28 w-28 rounded-[2rem] bg-cover bg-center ring-4 ring-white shadow-2xl"
        style={{ backgroundImage: `url("${avatar}")` }}
      />
    );
  }

  return (
    <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-linear-to-br from-[#0067b8] via-[#8b5cf6] to-[#f97316] text-4xl font-extrabold text-white ring-4 ring-white shadow-2xl">
      {name?.[0] ?? <UserRound className="h-10 w-10" />}
    </div>
  );
}

function PortraitCelebrationFrame({
  name,
  avatar,
}: {
  name: string;
  avatar?: string | null;
}) {
  return (
    <div className="relative isolate flex h-44 w-44 items-center justify-center">
      <style>
        {`
          @keyframes portrait-burst-pop {
            0% {
              transform: translate3d(0, 0, 0) scale(.2) rotate(0deg);
              opacity: 0;
            }
            18% {
              opacity: 1;
            }
            72% {
              opacity: 1;
            }
            100% {
              transform: translate3d(var(--x), var(--y), 0) scale(1) rotate(var(--rotate));
              opacity: 0;
            }
          }
          @keyframes portrait-pulse-ring {
            0% {
              transform: scale(.72);
              opacity: .85;
            }
            100% {
              transform: scale(1.45);
              opacity: 0;
            }
          }
          @keyframes portrait-ray-spin {
            0% {
              transform: rotate(0deg) scale(.8);
              opacity: .45;
            }
            100% {
              transform: rotate(26deg) scale(1.08);
              opacity: .8;
            }
          }
        `}
      </style>

      <span className="absolute inset-3 -z-20 rounded-full bg-amber-300/30 blur-2xl" />
      <span
        className="absolute inset-4 -z-10 rounded-full border-2 border-white/60"
        style={{ animation: "portrait-pulse-ring 1.7s ease-out .1s both" }}
      />
      <span
        className="absolute inset-0 -z-20 rounded-full opacity-70"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg 12deg, rgba(255,255,255,.75) 12deg 20deg, transparent 20deg 42deg, rgba(250,204,21,.75) 42deg 50deg, transparent 50deg 75deg, rgba(20,184,166,.65) 75deg 82deg, transparent 82deg 360deg)",
          animation: "portrait-ray-spin 1.2s ease-out .05s both",
        }}
      />

      {PORTRAIT_BURST_PIECES.map((piece, index) => (
        <span
          key={`${piece.x}-${piece.y}-${piece.color}`}
          className={`absolute rounded-full ${piece.size}`}
          style={
            {
              backgroundColor: piece.color,
              animation: `portrait-burst-pop 1.65s cubic-bezier(.2,.9,.18,1) ${piece.delay}s both`,
              "--x": `${piece.x}px`,
              "--y": `${piece.y}px`,
              "--rotate": `${(index + 1) * 72}deg`,
            } as React.CSSProperties
          }
        />
      ))}

      <div className="relative z-10">
        <UserPortrait name={name} avatar={avatar} />
      </div>
    </div>
  );
}

function ProgressRing({ value, locale }: { value: number; locale: string }) {
  const safeValue = Math.max(0, Math.min(value, 100));

  return (
    <div
      className="relative flex h-32 w-32 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(#0067b8 ${safeValue * 3.6}deg, #e8f4ff 0deg)`,
      }}
    >
      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
        <span className="text-2xl font-extrabold text-gray-900">
          {formatAchievementPercent(safeValue, locale)}
        </span>
        <span className="text-xs font-bold text-gray-400">اكتمال</span>
      </div>
    </div>
  );
}

function EmptyAchievement({
  icon: Icon,
  title,
  description,
  href,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
        <Icon className="h-8 w-8 text-gray-300" />
      </div>
      <h3 className="text-lg font-extrabold text-gray-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
        {description}
      </p>
      <Link
        href={href}
        className="mt-5 inline-flex rounded-xl bg-[#0067b8] px-5 py-2.5 text-sm font-extrabold text-white transition-colors hover:bg-[#004a86]"
      >
        {action}
      </Link>
    </div>
  );
}

function TopCategoryCard({
  achievement,
  locale,
}: {
  achievement: TopCategoryAchievement;
  locale: string;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="bg-linear-to-br from-[#0067b8] to-[#14b8a6] p-6 text-white">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-white/70">أفضل مسار</p>
            <h2 className="mt-1 text-2xl font-extrabold">
              {achievement.title}
            </h2>
          </div>
          <BookOpenCheck className="h-10 w-10 text-white/80" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
            <p className="text-xs text-white/70">الدروس المشاهدة</p>
            <p className="mt-1 text-xl font-extrabold">
              {formatAchievementNumber(achievement.watchedLessons, locale)}
            </p>
          </div>
          <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
            <p className="text-xs text-white/70">الترتيب</p>
            <p className="mt-1 text-xl font-extrabold">#{achievement.rank}</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
            <p className="text-xs text-white/70">المنافسون</p>
            <p className="mt-1 text-xl font-extrabold">
              {formatAchievementNumber(achievement.totalStudents, locale)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
        <ProgressRing
          value={achievement.completionPercentage}
          locale={locale}
        />
        <div className="flex-1">
          <div className="mb-2 flex justify-between text-sm font-bold text-gray-500">
            <span>تقدم المسار</span>
            <span>
              {formatAchievementNumber(achievement.watchedLessons, locale)} /{" "}
              {formatAchievementNumber(achievement.totalLessons, locale)} درس
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#0067b8]"
              style={{
                width: `${Math.max(0, Math.min(achievement.completionPercentage, 100))}%`,
              }}
            />
          </div>
          <p className="mt-4 text-sm leading-7 text-gray-500">
            المسار ده هو أكثر مسار حققت فيه تقدم. كل درس بتخلصه بيقربك من ترتيب
            أعلى وشارة أقوى.
          </p>
        </div>
      </div>
    </section>
  );
}

function BestExamCard({
  achievement,
  locale,
}: {
  achievement: BestExamAchievement;
  locale: string;
}) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#0067b8]">أفضل اختبار</p>
          <h2 className="mt-1 text-2xl font-extrabold text-gray-900">
            {achievement.title}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            تم التسليم في{" "}
            {formatAchievementDate(achievement.submittedAt, locale)}
          </p>
        </div>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-50">
          <Trophy className="h-8 w-8 text-amber-500" />
        </div>
      </div>

      <div className="mb-6 rounded-[2rem] bg-linear-to-br from-amber-50 to-[#f8fbfd] p-6 text-center">
        <p className="text-sm font-bold text-gray-500">نسبة النجاح</p>
        <p className="mt-2 text-5xl font-black text-gray-900">
          {formatAchievementPercent(achievement.percentage, locale)}
        </p>
        <p className="mt-2 text-sm font-bold text-[#0067b8]">
          {achievement.score} / {achievement.totalScore} درجة
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-gray-50 p-4">
          <Medal className="mb-2 h-5 w-5 text-[#0067b8]" />
          <p className="text-xs font-bold text-gray-400">ترتيب الاختبار</p>
          <p className="mt-1 text-2xl font-extrabold text-gray-900">
            #{achievement.rank}
          </p>
        </div>
        <div className="rounded-2xl bg-gray-50 p-4">
          <Users className="mb-2 h-5 w-5 text-[#0067b8]" />
          <p className="text-xs font-bold text-gray-400">المشاركون</p>
          <p className="mt-1 text-2xl font-extrabold text-gray-900">
            {formatAchievementNumber(achievement.totalParticipants, locale)}
          </p>
        </div>
      </div>
    </section>
  );
}

export function AchievementsPage() {
  const locale = useLocale();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [achievements, setAchievements] = useState<AchievementsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const direction = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    let ignore = false;

    if (isLoading || !isAuthenticated) {
      return () => {
        ignore = true;
      };
    }

    setLoading(true);
    getAchievements()
      .then((data) => {
        if (!ignore) setAchievements(data);
      })
      .catch(() => {
        if (!ignore) setAchievements({ topCategory: null, bestExam: null });
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, isLoading]);

  return (
    <StudentAuthenticatedGuard>
      <CelebrationConfetti />
      <main className="min-h-screen bg-gray-50" dir={direction}>
        <Navbar />

        <div className="pt-24 pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loading ? (
              <AchievementLoading />
            ) : (
              <>
                <section className="relative mb-8 overflow-hidden rounded-[2rem] bg-linear-to-br from-[#0f172a] via-[#3b216f] to-[#0067b8] p-6 text-white shadow-2xl md:p-10">
                  <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_24%),radial-gradient(circle_at_80%_30%,#f97316_0,transparent_20%),radial-gradient(circle_at_50%_90%,#14b8a6_0,transparent_22%)]" />
                  <div className="relative grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                    <PortraitCelebrationFrame
                      name={user?.name ?? "طالب"}
                      avatar={user?.avatar}
                    />

                    <div>
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white/80 backdrop-blur">
                        <Sparkles className="h-4 w-4 text-amber-300" />
                        لوحة الإنجازات
                      </div>
                      <h1 className="text-3xl font-black md:text-5xl">
                         {user?.name} يا بطل
                      </h1>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
                        هنا بنجمع أفضل تقدم حققته في المسارات وأقوى نتيجة وصلت
                        لها في الاختبارات. كل رقم هنا هو خطوة حقيقية في رحلتك.
                      </p>
                    </div>
                  </div>
                </section>

                <div className="mb-8 grid gap-4 md:grid-cols-3">
                  {[
                    {
                      icon: Award,
                      label: "أفضل ترتيب مسار",
                      value: achievements?.topCategory
                        ? `#${achievements.topCategory.rank}`
                        : "-",
                    },
                    {
                      icon: Star,
                      label: "أفضل نتيجة اختبار",
                      value: achievements?.bestExam
                        ? formatAchievementPercent(
                            achievements.bestExam.percentage,
                            locale,
                          )
                        : "-",
                    },
                    {
                      icon: BarChart3,
                      label: "اشتراكاتك",
                      value: user?.totalCategorySubscription ?? 0,
                    },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
                    >
                      <Icon className="mb-3 h-6 w-6 text-[#0067b8]" />
                      <p className="text-xs font-bold text-gray-400">{label}</p>
                      <p className="mt-1 text-2xl font-extrabold text-gray-900">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {achievements?.topCategory ? (
                    <TopCategoryCard
                      achievement={achievements.topCategory}
                      locale={locale}
                    />
                  ) : (
                    <EmptyAchievement
                      icon={BookOpenCheck}
                      title="لسه مفيش مسار متصدر"
                      description="ابدأ مشاهدة الدروس داخل كورساتك، وأول ما يبقى عندك تقدم هنعلقه هنا كإنجاز."
                      href={`/${locale}/courses`}
                      action="اذهب إلى كورساتي"
                    />
                  )}

                  {achievements?.bestExam ? (
                    <BestExamCard
                      achievement={achievements.bestExam}
                      locale={locale}
                    />
                  ) : (
                    <EmptyAchievement
                      icon={Trophy}
                      title="لسه مفيش نتيجة اختبار"
                      description="حل أول اختبار لك، وهنعرض أفضل نتيجة وترتيبك بين المشاركين هنا."
                      href={`/${locale}/exams`}
                      action="ابدأ اختبار"
                    />
                  )}
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
