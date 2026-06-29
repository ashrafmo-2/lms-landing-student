"use client";

import { RoadmapView, TasksPreview } from "@/components/workshops/workshop-ui";
import { getPublicWorkshop } from "@/entities/workshops/api";
import type { Workshop } from "@/entities/workshops/api";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardWorkshopDetailsPage() {
    const { workshopId } = useParams<{ workshopId: string }>();
    const locale = useLocale();
    const isAr = locale === "ar";
    const [workshop, setWorkshop] = useState<Workshop | null>(null);

    useEffect(() => {
        if (workshopId) getPublicWorkshop(workshopId).then(setWorkshop);
    }, [workshopId]);

    if (!workshop) return <div className="w-full rounded-2xl bg-card p-8 text-center">{isAr ? "جاري التحميل..." : "Loading..."}</div>;

    return (
        <div className="w-full space-y-6" dir={isAr ? "rtl" : "ltr"}>
            <div className="rounded-3xl bg-card p-6 shadow-sm">
                <h1 className="text-3xl font-black">{workshop.title}</h1>
                <p className="mt-2 max-w-3xl text-muted-foreground">{workshop.description}</p>
            </div>
            <section className="rounded-3xl bg-card p-6 shadow-sm">
                <h2 className="mb-5 text-2xl font-black">Roadmap</h2>
                <RoadmapView workshop={workshop} />
            </section>
            <section className="rounded-3xl bg-card p-6 shadow-sm">
                <h2 className="mb-5 text-2xl font-black">Tasks</h2>
                <TasksPreview tasks={workshop.tasks ?? []} />
            </section>
        </div>
    );
}
