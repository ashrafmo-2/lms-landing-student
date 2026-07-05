"use client";

import { RoadmapView, StatusPill, TasksPreview } from "@/components/workshops/workshop-ui";
import { getPublicWorkshop } from "@/entities/workshops/api";
import type { Workshop } from "@/entities/workshops/api";
import { Link } from "@/shared/i18n/routing";
import { Footer } from "@/widgets/landing-footer";
import { Navbar } from "@/widgets/landing-navbar";
import { CalendarDays, Clock, Users } from "lucide-react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WorkshopDetailsPage() {
    const { workshopId } = useParams<{ workshopId: string }>();
    const locale = useLocale();
    const isAr = locale === "ar";
    const [workshop, setWorkshop] = useState<Workshop | null>(null);

    useEffect(() => {
        if (workshopId) getPublicWorkshop(workshopId).then(setWorkshop);
    }, [workshopId]);

    if (!workshop) {
        return <main className="min-h-screen bg-slate-50 pt-28 text-center">{isAr ? "جاري التحميل..." : "Loading..."}</main>;
    }

    return (
        <main className="min-h-screen bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
            <Navbar />
            <section className="pt-28 pb-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
                        <div className="rounded-3xl bg-white p-7 shadow-sm">
                            <div className="flex flex-wrap gap-2">
                                <StatusPill status={workshop.registrationStatus} />
                                <span className="rounded-full bg-[#e8f4ff] px-3 py-1 text-xs font-bold text-[#0067b8]">{workshop.deliveryMode}</span>
                            </div>
                            <h1 className="mt-5 text-4xl font-black text-slate-950">{workshop.title}</h1>
                            <p className="mt-4 text-lg leading-8 text-slate-600">{workshop.description}</p>
                            <div className="mt-7 grid gap-3 md:grid-cols-3">
                                <Info icon={CalendarDays} label={`${workshop.startsAt ?? "-"} / ${workshop.endsAt ?? "-"}`} />
                                <Info icon={Clock} label={workshop.duration ?? "-"} />
                                <Info icon={Users} label={workshop.availableSeats ? `${workshop.availableSeats} seats` : "Open seats"} />
                            </div>
                            <Link href="/auth/signup" className="mt-8 inline-flex rounded-xl bg-[#0067b8] px-6 py-3 text-sm font-black text-white hover:bg-[#004a86]">
                                {isAr ? "انضم للوركشوب" : "Join workshop"}
                            </Link>
                        </div>
                        <aside className="rounded-3xl bg-white p-6 shadow-sm">
                            <p className="text-sm font-bold text-slate-500">{isAr ? "المدرب" : "Instructor"}</p>
                            <p className="mt-2 text-xl font-black text-slate-950">{workshop.instructors?.[0]?.name ?? "-"}</p>
                            <div className="mt-6 space-y-3 text-sm text-slate-600">
                                <p>{workshop.isFree ? (isAr ? "مجاني" : "Free") : `${workshop.price} EGP`}</p>
                                <p>{workshop.level}</p>
                                <p>{workshop.language}</p>
                            </div>
                        </aside>
                    </div>

                    <section className="mt-12">
                        <h2 className="mb-5 text-2xl font-black text-slate-950">{isAr ? "Roadmap تفصيلية" : "Detailed roadmap"}</h2>
                        <RoadmapView workshop={workshop} />
                    </section>

                    <section className="mt-12 grid gap-6 lg:grid-cols-2">
                        <div className="rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-2xl font-black text-slate-950">{isAr ? "الجلسات" : "Sessions"}</h2>
                            <div className="space-y-3">
                                {(workshop.sessions ?? []).map((session) => (
                                    <div key={session.sessionId} className="rounded-2xl border border-slate-200 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="font-black text-slate-950">{session.title}</p>
                                            <StatusPill status={session.status} />
                                        </div>
                                        <p className="mt-2 text-sm text-slate-600">{session.date} · {session.time} · {session.durationMinutes}m · {session.type}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-2xl font-black text-slate-950">FAQ</h2>
                            <div className="space-y-4">
                                {workshop.faq.map((item) => (
                                    <div key={item.question}>
                                        <p className="font-black text-slate-950">{item.question}</p>
                                        <p className="mt-1 text-sm leading-6 text-slate-600">{item.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="mt-12">
                        <h2 className="mb-5 text-2xl font-black text-slate-950">{isAr ? "التاسكات" : "Tasks"}</h2>
                        <TasksPreview tasks={workshop.tasks ?? []} />
                    </section>
                </div>
            </section>
            <Footer />
        </main>
    );
}

function Info({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
            <Icon className="h-5 w-5 text-[#0067b8]" />
            {label}
        </div>
    );
}
