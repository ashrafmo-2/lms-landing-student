"use client";

import { BadgeList, DeadlineCallout, StatusPill } from "@/components/workshops/workshop-ui";
import { getStudentWorkshops } from "@/entities/workshops/api";
import type { StudentWorkshop } from "@/entities/workshops/api";
import { Link } from "@/shared/i18n/routing";
import { CalendarClock, CheckSquare, Presentation } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useState } from "react";

export default function DashboardWorkshopsPage() {
    const locale = useLocale();
    const isAr = locale === "ar";
    const [items, setItems] = useState<StudentWorkshop[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStudentWorkshops().then(setItems).finally(() => setLoading(false));
    }, []);

    const current = items[0];
    const nextTask = useMemo(() => {
        return current?.tasks
            .filter((task) => task.deadline)
            .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())[0];
    }, [current]);
    const nextSession = current?.workshop.sessions?.[0];

    if (loading) return <div className="w-full rounded-2xl bg-card p-8 text-center">{isAr ? "جاري التحميل..." : "Loading..."}</div>;

    if (!current) return <div className="w-full rounded-2xl bg-card p-8 text-center">{isAr ? "لا توجد ورش مشتركة حتى الآن." : "No enrolled workshops yet."}</div>;

    return (
        <div className="w-full space-y-6" dir={isAr ? "rtl" : "ltr"}>
            <div className="rounded-3xl bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-sm font-bold text-muted-foreground">{isAr ? "الوركشوب الحالي" : "Current workshop"}</p>
                        <h1 className="mt-2 text-3xl font-black text-foreground">{current.workshop.title}</h1>
                        <p className="mt-2 max-w-2xl text-muted-foreground">{current.workshop.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <StatusPill status={current.status} />
                            <StatusPill status={current.currentMilestone ? "in_progress" : "not_started"} />
                        </div>
                    </div>
                    <div className="min-w-56 rounded-2xl bg-muted p-4">
                        <div className="flex items-center justify-between text-sm font-bold">
                            <span>{isAr ? "التقدم" : "Progress"}</span>
                            <span>{current.progress}%</span>
                        </div>
                        <div className="mt-3 h-3 overflow-hidden rounded-full bg-background">
                            <div className="h-full rounded-full bg-[#0067b8]" style={{ width: `${current.progress}%` }} />
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">{isAr ? "المرحلة الحالية:" : "Current stage:"} {current.currentMilestone}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <DeadlineCallout task={nextTask} />
                <div className="rounded-2xl bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                        <CalendarClock className="h-4 w-4" />
                        {isAr ? "الجلسة القادمة" : "Next session"}
                    </div>
                    <p className="mt-2 text-lg font-black">{nextSession?.title ?? "-"}</p>
                    <p className="text-sm text-muted-foreground">{nextSession?.date} · {nextSession?.time}</p>
                </div>
                <div className="rounded-2xl bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                        <Presentation className="h-4 w-4" />
                        Badges
                    </div>
                    <div className="mt-3"><BadgeList badges={current.badges} /></div>
                </div>
            </div>

            <section className="rounded-3xl bg-card p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-[#0067b8]" />
                    <h2 className="text-2xl font-black">{isAr ? "التاسكات المطلوبة" : "Required tasks"}</h2>
                </div>
                <div className="grid gap-3">
                    {current.tasks.map((task) => (
                        <Link key={task.taskId} href={`/dashboard/tasks/${task.taskId}`} className="rounded-2xl border border-border bg-background p-4 transition hover:border-[#0067b8]">
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <p className="font-black">{task.title}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                                    <p className="mt-2 text-xs font-bold text-muted-foreground">{task.deadline ? new Date(task.deadline).toLocaleString() : "-"}</p>
                                </div>
                                <StatusPill status={task.status} />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
