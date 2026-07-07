"use client";

import { Presentation } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import type { Workshop } from "@/entities/workshops/api";
import { getPublicWorkshops } from "@/entities/workshops/api";
import { WorkshopCard } from "@/components/workshops/workshop-ui";
import { Footer } from "@/widgets/landing-footer";
import { Navbar } from "@/widgets/landing-navbar";

export default function WorkshopsDirectoryPage() {
  const locale = useLocale();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const isAr = locale === "ar";

  useEffect(() => {
    getPublicWorkshops().then(setWorkshops);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
      <Navbar />

      <section className="relative overflow-hidden bg-[#151029] pt-32 pb-20 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(108,58,255,0.34),transparent_42%),linear-gradient(180deg,rgba(6,182,212,0.18),transparent_62%)]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm font-black text-emerald-200">
            <Presentation className="h-4 w-4" />
            {isAr ? "الورش العملية" : "Practical Workshops"}
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight text-white md:text-6xl">
            {isAr ? "طور مهاراتك من خلال التطبيق العملي" : "Develop your skills through hands-on practice"}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-200">
            {isAr ? "انضم لورشنا العملية وابنِ مشاريع حقيقية خطوة بخطوة مع توجيه مباشر ومتابعة مستمرة من خبرائنا." : "Join our practical workshops and build real projects step by step with direct guidance and continuous feedback from our experts."}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-950">
              {isAr ? "جميع الورش المتاحة" : "All available workshops"}
            </h2>
            <p className="mt-2 text-lg text-slate-600">
              {isAr ? "تصفح قائمة ورش العمل واختر ما يناسب مسارك" : "Browse our list of workshops and choose what fits your path"}
            </p>
          </div>
          
          {workshops.length === 0 ? (
             <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
               <p className="font-bold text-slate-500">{isAr ? "جاري تحميل الورش..." : "Loading workshops..."}</p>
             </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workshops.map((workshop) => (
                <div key={workshop.workshopId} className="text-slate-950">
                  <WorkshopCard workshop={workshop} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
