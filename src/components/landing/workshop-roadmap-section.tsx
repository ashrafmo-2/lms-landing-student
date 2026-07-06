"use client";

import { CheckCircle2, Map, Sparkles } from "lucide-react";

const SESSION_TYPE_COLORS: Record<string, string> = {
  "Theory + Discussion": "text-sky-400 border-sky-400/25 bg-sky-400/10",
  "Theory + Practice": "text-violet-400 border-violet-400/25 bg-violet-400/10",
  "Architecture Thinking": "text-amber-400 border-amber-400/25 bg-amber-400/10",
  "Theory + Hands-on": "text-emerald-400 border-emerald-400/25 bg-emerald-400/10",
  "Live Coding": "text-rose-400 border-rose-400/25 bg-rose-400/10",
  "API Architecture": "text-cyan-400 border-cyan-400/25 bg-cyan-400/10",
  "Design System": "text-pink-400 border-pink-400/25 bg-pink-400/10",
  "Architecture Basics": "text-orange-400 border-orange-400/25 bg-orange-400/10",
  "Advanced Monorepo": "text-purple-400 border-purple-400/25 bg-purple-400/10",
  "Final Integration": "text-teal-400 border-teal-400/25 bg-teal-400/10",
};

const SESSIONS = [
  {
    title: "Why Architecture Matters",
    type: "Theory + Discussion",
    desc: "نفهم ليه مشاريع الـ Frontend بتبوظ مع الوقت، وإزاي الـ structure العشوائي بيأثر على التطوير، الصيانة، والتوسع.",
    topics: ["Scalable Frontend", "Production Problems", "Architecture Mindset"],
  },
  {
    title: "Project Analysis",
    type: "Theory + Practice",
    desc: "قبل ما نكتب أي كود، هنحلل مشروع Booking SaaS ونطلع منه الـ features، الـ entities، والـ user flows.",
    topics: ["Requirements", "User Flow", "Feature Extraction", "Entity Extraction"],
  },
  {
    title: "Folder Thinking",
    type: "Architecture Thinking",
    desc: "مش بس هنعرف FSD، هنفهم إزاي ناخد قرار: ده Feature ولا Entity ولا Widget؟ وإزاي نتجنب أخطاء التقسيم المشهورة.",
    topics: ["FSD Thinking", "Folder Decisions", "Feature vs Entity", "Common Mistakes"],
  },
  {
    title: "FSD Fundamentals",
    type: "Theory + Hands-on",
    desc: "شرح Feature-Sliced Design من الصفر، مع فهم الـ layers، قواعد الاستيراد، واتجاه الاعتماديات.",
    topics: ["App Layer", "Pages", "Widgets", "Features", "Entities", "Shared Layer"],
  },
  {
    title: "Booking SaaS Structure",
    type: "Live Coding",
    desc: "نطبق FSD عمليًا على مشروع Booking SaaS ونبني structure واضح قابل للتوسع.",
    topics: ["Auth", "Booking Flow", "Dashboard", "Calendar", "User Profile"],
  },
  {
    title: "API Layer",
    type: "API Architecture",
    desc: "بدل ما الـ fetch يبقى في أي component، هنبني API Layer منظمة تفصل بين backend response والـ frontend entities.",
    topics: ["DTO", "Mappers", "Repository Pattern", "Error Handling", "Response Transformation"],
  },
  {
    title: "Design System Architecture",
    type: "Design System",
    desc: "هنبني Design System مش مجرد UI components، بداية من tokens لحد reusable components قابلة للاستخدام في أكتر من app.",
    topics: ["Design Tokens", "Colors", "Typography", "Primitive Components", "Variants", "Reusable UI"],
  },
  {
    title: "Monorepo Fundamentals",
    type: "Architecture Basics",
    desc: "نفهم يعني إيه Monorepo، الفرق بين single project و multi-project، وإمتى نستخدمه أو نتجنبه.",
    topics: ["Apps", "Packages", "Code Sharing", "Single Repo", "Multi Project"],
  },
  {
    title: "Monorepo Beyond Basics",
    type: "Advanced Monorepo",
    desc: "هندخل أعمق في shared configs، shared types، shared utils، dependency boundaries، وتنظيم packages بشكل production-ready.",
    topics: ["Shared UI", "Shared Config", "Shared Types", "Shared Utils", "Dependency Boundaries"],
  },
  {
    title: "Simple Monorepo Example",
    type: "Live Coding",
    desc: "نبني مثال بسيط فيه أكتر من app و packages مشتركة للـ UI، configs، types، والـ utilities.",
    topics: ["apps/dashboard", "apps/landing", "packages/ui", "packages/config", "packages/types"],
  },
  {
    title: "Production Ready Architecture",
    type: "Final Integration",
    desc: "نجمع FSD + API Layer + Design System + Monorepo في structure واحد لمشروع Booking SaaS قابل للتوسع.",
    topics: ["Final Structure", "Best Practices", "Architecture Review", "Production Mindset"],
  },
];

const OUTCOMES = [
  "تحليل أي مشروع Frontend قبل كتابة الكود.",
  "تحديد الفرق بين Feature, Entity, Widget و Shared.",
  "بناء FSD Structure حقيقي لمشروع SaaS.",
  "تصميم API Layer منظمة ونظيفة.",
  "بناء Design System قابل لإعادة الاستخدام.",
  "فهم واستخدام Monorepo بشكل عملي.",
  "التفكير كـ Frontend Engineer مش مجرد React Developer.",
];

export function WorkshopRoadmapSection() {
  return (
    <section className="relative overflow-hidden bg-[#080f1e] py-24 text-white">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 100%)",
        }}
      />
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span dir="ltr">Frontend Architecture Workshop</span>
          </span>
          <h2 className="mb-5 text-3xl font-black leading-tight text-white md:text-4xl">
            من{" "}
            <span className="text-blue-400">Components عشوائية</span>
            {" "}إلى{" "}
            <span className="text-purple-400">Architecture حقيقية</span>
          </h2>
          <p className="text-base leading-relaxed text-slate-400">
            هنتعلم إزاي نفكر كـ{" "}
            <span dir="ltr" className="font-semibold text-white">Frontend Engineers</span>
            ، نحلل مشروع حقيقي، نبني Structure قابل للتوسع، باستخدام{" "}
            <span dir="ltr" className="font-mono text-sm font-semibold text-purple-400">
              FSD · API Layer · Design System · Monorepo
            </span>
          </p>
        </div>

        {/* ── Timeline ── */}
        <div className="space-y-0">
          {SESSIONS.map((session, index) => {
            const typeClass =
              SESSION_TYPE_COLORS[session.type] ??
              "text-slate-400 border-slate-400/25 bg-slate-400/10";
            const isLast = index === SESSIONS.length - 1;

            return (
              <div key={index} className="flex items-stretch gap-5">

                {/* ── Dot + Line column ── always aligned, RTL-safe ── */}
                <div className="flex w-14 shrink-0 flex-col items-center">
                  {/* Numbered dot */}
                  <div className="z-10 flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-blue-500/30 bg-[#0d1a30] shadow-[0_0_20px_rgba(59,130,246,0.22)]">
                    <span className="text-[10px] font-bold leading-none text-slate-500">S</span>
                    <span className="text-lg font-black leading-tight text-blue-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {/* Connector line — stretches to fill remaining height of the row */}
                  {!isLast && (
                    <div
                      className="mt-1 w-px flex-1"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(59,130,246,0.5), rgba(139,92,246,0.25))",
                      }}
                    />
                  )}
                </div>

                {/* ── Card ── */}
                <div className={`flex-1 ${!isLast ? "pb-6" : ""}`}>
                  <div className="group rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition-all duration-300 hover:border-blue-500/20 hover:bg-white/[0.06]">
                    {/* Top row: title + type badge */}
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                      <h3 className="text-base font-black text-white" dir="ltr">
                        {session.title}
                      </h3>
                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${typeClass}`}
                        dir="ltr"
                      >
                        {session.type}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mb-4 text-sm leading-relaxed text-slate-400">
                      {session.desc}
                    </p>

                    {/* Topic chips */}
                    <div className="flex flex-wrap gap-2" dir="ltr">
                      {session.topics.map((topic, tIdx) => (
                        <span
                          key={tIdx}
                          className="rounded-lg border border-slate-700/50 bg-slate-800/50 px-2.5 py-1 font-mono text-[11px] font-medium text-slate-500"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* ── Final Outcomes ── */}
        <div className="mt-20">
          <div className="rounded-3xl border border-blue-500/15 bg-gradient-to-br from-blue-950/30 via-slate-950/50 to-purple-950/20 p-8 md:p-10">
            <div className="mb-7 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-500/25 bg-blue-500/15">
                <Map className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-black text-white md:text-2xl">
                بنهاية الورشة، المتدرب هيكون قادر على:
              </h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {OUTCOMES.map((outcome, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-colors hover:border-emerald-500/15 hover:bg-white/[0.05]"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="text-sm font-medium leading-relaxed text-slate-300">
                    {outcome}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
