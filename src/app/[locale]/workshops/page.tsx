"use client";

import { getPublicWorkshops } from "@/entities/workshops/api";
import type { Workshop } from "@/entities/workshops/api";
import { Navbar } from "@/widgets/landing-navbar";
import { Footer } from "@/widgets/landing-footer";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { WorkshopCard } from "@/components/workshops/workshop-ui";

export default function WorkshopsPage() {
    const locale = useLocale();
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [loading, setLoading] = useState(true);
    const isAr = locale === "ar";

    useEffect(() => {
        getPublicWorkshops().then(setWorkshops).finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
            <Navbar />
            <section className="pt-28 pb-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10">
                        <span className="rounded-lg bg-violet-50 px-3 py-1 text-sm font-black text-violet-700">
                            {isAr ? "ورش تعليمية عملية" : "Practical workshops"}
                        </span>
                        <h1 className="mt-4 text-4xl font-black text-slate-950">
                            {isAr ? "الوركشوبات المتاحة والقادمة" : "Available and upcoming workshops"}
                        </h1>
                        <p className="mt-3 max-w-2xl text-slate-600">
                            {isAr ? "تابع الوركشوبات، اعرف المطلوب منك، وشوف الرودماب والتاسكات قبل الانضمام." : "Explore workshops, roadmap, sessions, and practical tasks before joining."}
                        </p>
                    </div>

                    {loading ? (
                        <div className="rounded-2xl bg-white p-8 text-center text-slate-600">{isAr ? "جاري التحميل..." : "Loading..."}</div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {workshops.map((workshop) => <WorkshopCard key={workshop.workshopId} workshop={workshop} />)}
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </main>
    );
}
