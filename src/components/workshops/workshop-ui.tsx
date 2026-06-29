"use client";

import type { Workshop, WorkshopTask } from "@/entities/workshops/api";
import { Link } from "@/shared/i18n/routing";
import { CalendarDays, CheckCircle2, Clock, FileCheck2, Layers3, Radio, Trophy } from "lucide-react";
import { useLocale } from "next-intl";

export function statusLabel(status?: string) {
    const labels: Record<string, string> = {
        open: "مفتوح",
        closed: "مغلق",
        coming_soon: "قريبًا",
        upcoming: "قادمة",
        available: "متاحة",
        ended: "منتهية",
        not_started: "لم يبدأ",
        in_progress: "جاري العمل",
        submitted: "تم التسليم",
        needs_changes: "يحتاج تعديل",
        completed: "مكتمل",
        approved: "مكتمل",
    };
    return labels[status ?? ""] ?? status?.replaceAll("_", " ") ?? "-";
}

export function StatusPill({ status }: { status?: string }) {
    const positive = ["open", "available", "submitted", "approved", "completed"].includes(status ?? "");
    const warning = ["coming_soon", "upcoming", "in_progress", "needs_changes"].includes(status ?? "");
    return (
        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${positive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : warning ? "border-amber-200 bg-amber-50 text-amber-700" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
            {statusLabel(status)}
        </span>
    );
}

export function WorkshopCard({ workshop }: { workshop: Workshop }) {
    const locale = useLocale();
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
                <StatusPill status={workshop.registrationStatus} />
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">{workshop.deliveryMode}</span>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">{workshop.level}</span>
            </div>
            <h3 className="mt-4 text-2xl font-black text-slate-950">{workshop.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{workshop.description}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <Info icon={CalendarDays} label={workshop.startsAt ?? "-"} />
                <Info icon={Clock} label={workshop.duration ?? "-"} />
                <Info icon={Radio} label={workshop.deliveryMode} />
                <Info icon={Trophy} label={workshop.isFree ? (locale === "ar" ? "مجاني" : "Free") : `${workshop.price} EGP`} />
            </div>
            <Link href={`/workshops/${workshop.workshopId}`} className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#6c3aff] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5228e8]">
                {locale === "ar" ? "عرض التفاصيل" : "View details"}
            </Link>
        </article>
    );
}

export function RoadmapView({ workshop }: { workshop: Workshop }) {
    return (
        <div className="grid gap-3 md:grid-cols-5">
            {(workshop.roadmap ?? []).map((item) => (
                <div key={item.milestoneId} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#6c3aff]/10 text-[#6c3aff]">
                        <Layers3 className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-black text-slate-950">{item.title}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-600">{item.description}</p>
                    <div className="mt-3"><StatusPill status={item.status} /></div>
                </div>
            ))}
        </div>
    );
}

export function TasksPreview({ tasks }: { tasks: WorkshopTask[] }) {
    return (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
                <div key={task.taskId} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <FileCheck2 className="h-5 w-5" />
                    </div>
                    <div className="flex items-start justify-between gap-3">
                        <p className="font-black text-slate-950">{task.title}</p>
                        <StatusPill status={task.status} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{task.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                        <span>{task.submissionType}</span>
                        <span>•</span>
                        <span>{task.estimatedTime}</span>
                        <span>•</span>
                        <span>{task.difficulty}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function DeadlineCallout({ task }: { task?: WorkshopTask }) {
    if (!task) return null;
    return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <p className="text-sm font-bold">أقرب Deadline</p>
            <p className="mt-1 text-lg font-black">{task.title}</p>
            <p className="text-sm">{task.deadline ? new Date(task.deadline).toLocaleString() : "-"}</p>
        </div>
    );
}

function Info({ icon: Icon, label }: { icon: React.ElementType; label: string | number }) {
    return (
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-slate-700">
            <Icon className="h-4 w-4 text-[#6c3aff]" />
            <span className="truncate">{label}</span>
        </div>
    );
}

export function BadgeList({ badges }: { badges: string[] }) {
    return (
        <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                    <CheckCircle2 className="h-3 w-3" />
                    {badge}
                </span>
            ))}
        </div>
    );
}
