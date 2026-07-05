"use client";

import {
  ArrowUpRight,
  BookOpenCheck,
  CheckCircle2,
  Download,
  Gauge,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getHeroStats, type HeroStats } from "@/entities/hero/api";
import { Link } from "@/shared/i18n/routing";

function formatCount(n: number): string {
  if (n >= 1000) return `${Math.floor(n / 1000)}k+`;
  return `${n}+`;
}

export function HeroSection() {
  const t = useTranslations("Landing.hero");
  const [stats, setStats] = useState<HeroStats | null>(null);

  useEffect(() => {
    getHeroStats()
      .then(setStats)
      .catch(() => {
        // Keep the landing page fast even when public stats are unavailable.
      });
  }, []);

  const metricItems = [
    {
      value: stats ? formatCount(stats.totalStudents) : "15k+",
      label: t("stats.students"),
    },
    {
      value: stats ? formatCount(stats.totalCategories) : "45+",
      label: t("stats.courses"),
    },
    {
      value: "4.9",
      label: t("stats.rating"),
      icon: Star,
    },
  ];

  const initials = t.raw("dashboard.sampleInitials") as string[];
  const peerBadges = initials.map((initial, index) => ({
    color: ["#0067b8", "#00a6a6", "#ffb000"][index] ?? "#101827",
    id: ["primary", "mentor", "coach"][index] ?? initial,
    initial,
  }));

  return (
    <section
      id="hero"
      className="surface-grid relative min-h-screen overflow-hidden border-b border-[#dbe5ef] bg-[#f7f9fc] pt-20"
    >
      <div className="absolute inset-x-0 top-0 h-28 bg-white/80 backdrop-blur-xl" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-white to-transparent" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.96fr_1.04fr] lg:gap-12 lg:px-8 lg:py-20">
        <div className="max-w-3xl" data-reveal="left">
          <div className="section-kicker mb-5">
            <Sparkles className="h-3.5 w-3.5" />
            {t("title").split(" ").slice(0, 3).join(" ")}
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-[0.98] text-[#101827] sm:text-6xl lg:text-7xl">
            {t("title")}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[#5d6b7d] sm:text-xl">
            {t("subtitle")}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
            <Link
              href="/#modules"
              className="focus-ring group inline-flex items-center gap-2 bg-[#101827] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_38px_rgba(16,24,39,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0067b8]"
            >
              {t("browseCourses")}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:rotate-[-90deg]" />
            </Link>
            <Link
              href="/#how-it-works"
              className="focus-ring group inline-flex items-center gap-3 border border-[#cdd9e5] bg-white px-5 py-3 text-sm font-bold text-[#101827] shadow-[0_16px_34px_rgba(16,24,39,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0067b8]/35"
            >
              <span className="flex h-8 w-8 items-center justify-center bg-[#e8f4ff] text-[#0067b8]">
                <Play className="h-3.5 w-3.5 fill-current" />
              </span>
              {t("getStarted")}
            </Link>
          </div>

          <div className="mt-8 grid max-w-2xl grid-cols-3 border-y border-[#d9e3ee] bg-white/58 sm:mt-10">
            {metricItems.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className={`px-4 py-4 sm:py-5 ${index > 0 ? "border-s border-[#d9e3ee]" : ""}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-black text-[#101827] sm:text-3xl">
                      {metric.value}
                    </span>
                    {Icon && (
                      <Icon className="h-5 w-5 fill-[#ffb000] text-[#ffb000]" />
                    )}
                  </div>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-[#627084]">
                    {metric.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="relative min-h-[500px] sm:min-h-[620px]"
          data-reveal="right"
        >
          <div className="absolute left-0 top-8 hidden h-[520px] w-[58%] overflow-hidden border border-[#243b5a]/20 bg-[#101827] shadow-[0_28px_80px_rgba(16,24,39,0.28)] md:block">
            <Image
              src="/ashraf mohamed.png"
              alt={t("dashboard.sampleUser")}
              fill
              sizes="(min-width: 1024px) 360px, 50vw"
              className="object-cover object-center"
              priority
            />
          </div>

          <div
            className="absolute right-0 top-0 w-full max-w-[520px] border border-[#d9e3ee] bg-white shadow-[0_28px_90px_rgba(16,24,39,0.16)] md:top-20"
            style={{ animation: "float-panel 7s ease-in-out infinite" }}
          >
            <div className="flex items-center justify-between border-b border-[#edf2f7] px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 bg-[#ffb000]" />
                <span className="h-2.5 w-2.5 bg-[#00a6a6]" />
                <span className="h-2.5 w-2.5 bg-[#0067b8]" />
              </div>
              <div className="flex items-center gap-2 bg-[#f1f6fb] px-3 py-1 text-xs font-black text-[#0067b8]">
                <Trophy className="h-3.5 w-3.5" />
                {t("dashboard.rank", { rank: 3 })}
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-[1fr_0.72fr]">
                <div className="border border-[#e2ebf4] bg-[#f8fbfd] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center bg-[#0067b8] text-lg font-black text-white">
                      {initials[0]}
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#101827]">
                        {t("dashboard.sampleUser")}
                      </p>
                      <p className="text-xs font-bold text-[#627084]">
                        {t("dashboard.weeklyRank", { rank: 3 })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs font-bold text-[#627084]">
                      <span>{t("dashboard.courseProgress")}</span>
                      <span className="text-[#0067b8]">75%</span>
                    </div>
                    <div className="relative h-2 overflow-hidden bg-[#dbe5ef]">
                      <div className="h-full w-3/4 bg-linear-to-r from-[#0067b8] via-[#00a6a6] to-[#12b76a]" />
                      <div
                        className="absolute inset-y-0 w-1/2 bg-white/35"
                        style={{ animation: "scan-line 2.8s linear infinite" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="border border-[#d9e3ee] bg-white p-4">
                    <Gauge className="mb-3 h-5 w-5 text-[#00a6a6]" />
                    <p className="text-2xl font-black text-[#101827]">98/100</p>
                    <p className="text-xs font-bold text-[#627084]">
                      {t("dashboard.examResult")}
                    </p>
                  </div>
                  <div className="border border-[#d9e3ee] bg-[#101827] p-4 text-white">
                    <Download className="mb-3 h-5 w-5 text-[#ffb000]" />
                    <p className="text-sm font-black">
                      {t("dashboard.downloaded")}
                    </p>
                    <p className="text-xs text-white/65">
                      {t("dashboard.offlineAvailable")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  {
                    icon: CheckCircle2,
                    label: t("dashboard.completed"),
                    tone: "text-[#12b76a]",
                  },
                  {
                    icon: BookOpenCheck,
                    label: t("dashboard.featured"),
                    tone: "text-[#0067b8]",
                  },
                  {
                    icon: ShieldCheck,
                    label: t("dashboard.offlineAvailable"),
                    tone: "text-[#ffb000]",
                  },
                ].map(({ icon: Icon, label, tone }) => (
                  <div
                    key={label}
                    className="border border-[#e2ebf4] bg-white p-3 text-center"
                  >
                    <Icon className={`mx-auto mb-2 h-4 w-4 ${tone}`} />
                    <p className="text-[11px] font-black text-[#101827]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-3 hidden w-[250px] border border-[#d9e3ee] bg-white p-4 shadow-[0_20px_60px_rgba(16,24,39,0.14)] sm:block md:bottom-20">
            <div className="mb-3 flex -space-x-2 rtl:space-x-reverse">
              {peerBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex h-9 w-9 items-center justify-center border-2 border-white bg-[#101827] text-xs font-black text-white"
                  style={{
                    backgroundColor: badge.color,
                  }}
                >
                  {badge.initial}
                </div>
              ))}
            </div>
            <p className="text-sm font-black text-[#101827]">
              {t("stats.students")}
            </p>
            <p className="mt-1 text-xs leading-5 text-[#627084]">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
