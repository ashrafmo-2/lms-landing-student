"use client";

import { getPublicWorkshops } from "@/entities/workshops/api";
import type { Workshop } from "@/entities/workshops/api";
import { Link } from "@/shared/i18n/routing";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { RoadmapView, TasksPreview, WorkshopCard } from "../workshops/workshop-ui";

export function WorkshopSection() {
    const locale = useLocale();
    const [workshop, setWorkshop] = useState<Workshop | null>(null);

    useEffect(() => {
        getPublicWorkshops().then((items) => setWorkshop(items[0] ?? null));
    }, []);

    if (!workshop) return null;

    const isAr = locale === "ar";

    return (
        <section id="workshops" className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                    <div>
                        <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">
                            {isAr ? "Workshop قادم" : "Upcoming Workshop"}
                        </span>
                        <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-4xl">{workshop.title}</h2>
                        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{workshop.description}</p>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {workshop.audience.slice(0, 2).map((item) => (
                                <div key={item} className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    {item}
                                </div>
                            ))}
                            {workshop.outcomes.slice(0, 2).map((item) => (
                                <div key={item} className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    {item}
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href={`/workshops/${workshop.workshopId}`} className="inline-flex items-center gap-2 rounded-xl bg-[#6c3aff] px-6 py-3 text-sm font-black text-white hover:bg-[#5228e8]">
                                {isAr ? "انضم للوركشوب" : "Join workshop"}
                                <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
                            </Link>
                            <Link href={`/workshops/${workshop.workshopId}`} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-900 hover:bg-slate-50">
                                {isAr ? "ابدأ التحضير" : "Start preparation"}
                            </Link>
                        </div>
                    </div>
                    <WorkshopCard workshop={workshop} />
                </div>

                <div className="mt-14">
                    <h3 className="mb-5 text-2xl font-black text-slate-950">{isAr ? "Roadmap مختصرة" : "Workshop Roadmap"}</h3>
                    <RoadmapView workshop={workshop} />
                </div>
                <div className="mt-14">
                    <h3 className="mb-5 text-2xl font-black text-slate-950">{isAr ? "Tasks Preview" : "Tasks Preview"}</h3>
                    <TasksPreview tasks={workshop.tasks ?? []} />
                </div>
            </div>
        </section>
    );
}
