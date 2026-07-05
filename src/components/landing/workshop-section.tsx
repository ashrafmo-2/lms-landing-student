"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  Presentation,
  Sparkles,
} from "lucide-react";
import { useLocale } from "next-intl";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import type { Workshop } from "@/entities/workshops/api";
import { getPublicWorkshops } from "@/entities/workshops/api";
import { Link } from "@/shared/i18n/routing";
import {
  RoadmapView,
  TasksPreview,
  WorkshopCard,
} from "../workshops/workshop-ui";

export function WorkshopSection() {
  const locale = useLocale();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);

  useEffect(() => {
    getPublicWorkshops().then((items) => setWorkshop(items[0] ?? null));
  }, []);

  if (!workshop) return null;

  const isAr = locale === "ar";

  return (
    <section
      id="workshops"
      className="relative border-y border-[#d9e3ee] bg-[#101827] py-24 text-white"
    >
      <div className="absolute inset-0 opacity-[0.12] surface-grid" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-start">
          <div data-reveal="left">
            <span className="inline-flex items-center gap-2 border border-white/15 bg-white/8 px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-[#7dd3fc]">
              <Presentation className="h-3.5 w-3.5" />
              {isAr ? "Workshop قادم" : "Upcoming Workshop"}
            </span>
            <h2 className="mt-5 max-w-3xl text-4xl font-black leading-tight md:text-5xl">
              {workshop.title}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">
              {workshop.description}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {workshop.audience.slice(0, 2).map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 border border-white/10 bg-white/8 p-3 text-sm font-bold text-white/82"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#12b76a]" />
                  {item}
                </div>
              ))}
              {workshop.outcomes.slice(0, 2).map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 border border-white/10 bg-white/8 p-3 text-sm font-bold text-white/82"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#12b76a]" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={`/workshops/${workshop.workshopId}`}
                className="focus-ring group inline-flex items-center gap-2 bg-[#ffb000] px-6 py-3 text-sm font-black text-[#101827] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffc84d]"
              >
                {isAr ? "انضم للوركشوب" : "Join workshop"}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:rotate-[-90deg]" />
              </Link>
              <Link
                href={`/workshops/${workshop.workshopId}`}
                className="focus-ring inline-flex items-center gap-2 border border-white/20 bg-white/8 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-white/14"
              >
                {isAr ? "ابدأ التحضير" : "Start preparation"}
              </Link>
            </div>
          </div>
          <div data-reveal="right">
            <WorkshopCard workshop={workshop} />
          </div>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div data-reveal>
            <div className="mb-5 flex items-center gap-2 text-2xl font-black">
              <Sparkles className="h-5 w-5 text-[#ffb000]" />
              {isAr ? "Roadmap مختصرة" : "Workshop Roadmap"}
            </div>
            <div className="[&>div>div]:border-white/10">
              <RoadmapView workshop={workshop} />
            </div>
          </div>
          <div
            data-reveal
            style={{ "--reveal-delay": "120ms" } as CSSProperties}
          >
            <h3 className="mb-5 text-2xl font-black">
              {isAr ? "Tasks Preview" : "Tasks Preview"}
            </h3>
            <div className="[&>div>div]:border-white/10">
              <TasksPreview tasks={workshop.tasks ?? []} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
