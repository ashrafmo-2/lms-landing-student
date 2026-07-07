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
  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  useEffect(() => {
    getPublicWorkshops().then(setWorkshops);
  }, []);

  if (workshops.length === 0) return null;

  const isAr = locale === "ar";

  return (
    <section
      id="workshops"
      className="relative border-y border-[#d9e3ee] bg-[#101827] py-24 text-white"
    >
      <div className="absolute inset-0 opacity-[0.12] surface-grid" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center" data-reveal="up">
          <span className="inline-flex items-center gap-2 border border-white/15 bg-white/8 px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-[#7dd3fc]">
            <Presentation className="h-3.5 w-3.5" />
            {isAr ? "الورش المتاحة" : "Available Workshops"}
          </span>
          <h2 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
            {isAr ? "طور مهاراتك مع ورشنا العملية" : "Level up with our practical workshops"}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/68">
            {isAr ? "تعلم من خلال التطبيق العملي وبناء مشاريع حقيقية مع توجيه مباشر من الخبراء." : "Learn by doing and build real projects with direct guidance from experts."}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {workshops.map((workshop, index) => (
            <div key={workshop.workshopId} data-reveal="up" style={{ transitionDelay: `${index * 100}ms` }} className="text-slate-950">
              <WorkshopCard workshop={workshop} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
