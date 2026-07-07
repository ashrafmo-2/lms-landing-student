"use client";

import {
  Award,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleCheck,
  Clock,
  Code2,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { WorkshopRoadmapSection } from "@/components/landing/workshop-roadmap-section";
import { Footer } from "@/widgets/landing-footer";
import { Navbar } from "@/widgets/landing-navbar";
import { useParams, useRouter } from "next/navigation";
import { getPublicWorkshop, getWorkshopPaymentStatus } from "@/entities/workshops/api";
import type { Workshop } from "@/entities/workshops/api";
import { useAuth } from "@/contexts/auth-context";



export default function WorkshopDetailsPage() {
  const { workshopId } = useParams<{ workshopId: string }>();
  const locale = useLocale();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const isAr = locale === "ar";
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (workshopId) getPublicWorkshop(workshopId).then(setWorkshop);
  }, [workshopId]);

  const copy = isAr ? arCopy : enCopy;

  if (!workshop) {
      return <main className="min-h-screen bg-slate-50 pt-28 text-center">{isAr ? "جاري التحميل..." : "Loading..."}</main>;
  }

  const handleSubscribe = async () => {
    if (!workshopId || authLoading) return;

    const paymentPath = `/${locale}/payment/${workshopId}`;

    if (!isAuthenticated) {
        router.push(`/${locale}/auth/login?redirect=${encodeURIComponent(paymentPath)}`);
        return;
    }

    try {
        setJoining(true);
        const status = await getWorkshopPaymentStatus(workshopId);
        if (status.isEnrolled || status.paymentRequest?.status === "APPROVED") {
            router.push(`/${locale}/dashboard/workshops/${workshopId}`);
            return;
        }

        router.push(paymentPath);
    } finally {
        setJoining(false);
    }
  };



  return (
    <main className="min-h-screen bg-white" dir={isAr ? "rtl" : "ltr"}>
      <Navbar />

      <section className="relative overflow-hidden bg-[#151029] pt-28 pb-20 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(108,58,255,0.34),transparent_42%),linear-gradient(180deg,rgba(6,182,212,0.18),transparent_62%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/15" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm font-black text-emerald-200">
              <MapPin className="h-4 w-4" />
              {copy.hero.badge}
            </span>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-white md:text-6xl">
              {workshop.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              {workshop.description}
            </p>

            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {copy.hero.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="border-white/15 border-t pt-4"
                >
                  <p className="text-2xl font-black text-white">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-300">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <button
                onClick={handleSubscribe}
                disabled={joining || authLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-black text-[#151029] shadow-xl shadow-black/20 transition hover:bg-amber-100 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {joining ? <span className="h-4 w-4 rounded-full border-2 border-[#151029]/40 border-t-[#151029] animate-spin" /> : null}
                {copy.hero.apply}
                <Send className="h-4 w-4" />
              </button>
              <a
                href="#details"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-black text-white transition hover:bg-white/15"
              >
                {copy.hero.details}
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="flex items-center justify-between gap-4 border-white/10 border-b pb-5">
                <div>
                  <p className="text-sm font-black text-emerald-200">
                    {copy.hero.panelEyebrow}
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">
                    {copy.hero.panelTitle}
                  </h2>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-300 text-[#151029]">
                  <Trophy className="h-7 w-7" />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {copy.hero.timeline.map((item, index) => (
                  <div
                    key={item.title}
                    className="grid grid-cols-[2.5rem_1fr] gap-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sm font-black text-[#0067b8]">
                      {index + 1}
                    </div>
                    <div className="border-white/10 border-b pb-4 last:border-b-0 last:pb-0">
                      <p className="font-black text-white">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-300">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <InfoRow
                  icon={CalendarDays}
                  label={copy.facts.dateLabel}
                  value={workshop.startsAt ?? "-"}
                  dark
                />
                <InfoRow
                  icon={Clock}
                  label={copy.facts.modeLabel}
                  value={workshop.deliveryMode}
                  dark
                />
                <InfoRow
                  icon={BriefcaseBusiness}
                  label={copy.facts.experienceLabel}
                  value={workshop.level}
                  dark
                />
                <InfoRow
                  icon={Award}
                  label={copy.facts.certificateLabel}
                  value={copy.facts.certificateValue}
                  dark
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="details" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f4ff] px-4 py-2 text-sm font-black text-[#0067b8]">
                <Sparkles className="h-4 w-4" />
                {copy.value.badge}
              </span>
              <h2 className="mt-5 text-3xl font-black text-slate-950 md:text-4xl">
                {copy.value.title}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                {copy.value.subtitle}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {copy.value.items.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#0067b8]/30 hover:shadow-xl hover:shadow-[#0067b8]/10"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                    <CircleCheck className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-black text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {(workshop.sessions || []).map((session, index) => (
              <div
                key={session.sessionId}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#151029] text-sm font-black text-white">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-lg font-black text-slate-950">
                  {session.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {session.date} · {session.time} · {session.durationMinutes}m · {session.type}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WorkshopRoadmapSection />

      <section id="pricing" className="bg-[#f7f4ee] py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-amber-700 shadow-sm">
              <Users className="h-4 w-4" />
              {copy.pricing.badge}
            </span>
            <h2 className="mt-5 text-3xl font-black text-slate-950 md:text-5xl">
              {copy.pricing.title}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-700">
              {copy.pricing.subtitle}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-2xl shadow-amber-900/10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-black text-slate-500">
                  {copy.pricing.label}
                </p>
                <div className="mt-2 flex items-end gap-3">
                  <span className="text-6xl font-black leading-none text-slate-950">
                    {copy.pricing.amount}
                  </span>
                  <span className="pb-2 text-lg font-black text-slate-600">
                    {copy.pricing.currency}
                  </span>
                </div>
                <p className="mt-3 text-sm font-bold text-emerald-700">
                  {copy.pricing.certificate}
                </p>
              </div>

              <button
                onClick={handleSubscribe}
                disabled={joining || authLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#151029] px-6 py-4 text-sm font-black text-white transition hover:bg-[#0067b8] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {joining ? <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : null}
                {copy.pricing.cta}
                <Send className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {copy.pricing.includes.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-slate-800"
                >
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f4ff] px-4 py-2 text-sm font-black text-[#0067b8]">
              <Code2 className="h-4 w-4" />
              {copy.teachers.badge}
            </span>
            <h2 className="mt-5 text-3xl font-black text-slate-950 md:text-4xl">
              {copy.teachers.title}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {(workshop.instructors || []).map((teacher) => (
              <article
                key={teacher.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80"
              >
                <div className="relative h-72 bg-[#151029] sm:h-80">
                  {teacher.photo ? (
                    <Image
                      src={teacher.photo.startsWith('http') ? teacher.photo : `http://localhost:8000${teacher.photo}`}
                      alt={teacher.name}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover object-top"
                    />
                  ) : (
                    <Image
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=random`}
                      alt={teacher.name}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover object-top"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/70 to-transparent" />
                </div>
                <div className="p-7">
                  <h3 className="text-2xl font-black text-slate-950">
                    {teacher.name}
                  </h3>
                  {teacher.title && (
                    <p className="mt-1 text-sm font-bold text-[#0067b8]">
                      {teacher.title}
                    </p>
                  )}
                  {teacher.description && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3">
                      {teacher.description}
                    </p>
                  )}
                  {teacher.socialLinks && Object.keys(teacher.socialLinks).length > 0 && (
                    <div className="mt-4 flex gap-3">
                      {teacher.socialLinks.linkedin && (
                        <a href={teacher.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#0077b5]">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </a>
                      )}
                      {teacher.socialLinks.twitter && (
                        <a href={teacher.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#1da1f2]">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                        </a>
                      )}
                      {teacher.socialLinks.github && (
                        <a href={teacher.socialLinks.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        </a>
                      )}
                      {teacher.socialLinks.website && (
                        <a href={teacher.socialLinks.website} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>



      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-slate-950">
            {copy.faq.title}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {copy.faq.items.map((item) => (
              <div
                key={item.question}
                className="rounded-lg border border-slate-200 bg-white p-5"
              >
                <h3 className="font-black text-slate-950">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  highlight,
  dark,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
  dark?: boolean;
}) {
  if (dark) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-300">{label}</p>
          <p className="mt-1 text-sm font-black text-white">{value}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${highlight ? "bg-amber-50 text-amber-700" : "bg-[#e8f4ff] text-[#0067b8]"}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500">{label}</p>
        <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
      </div>
    </div>
  );
}


const arCopy = {
  hero: {
    badge: "ورشة Offline داخل ELMOTECH",
    title: "ورشة عملية لبناء مشروع برمجي حقيقي من البداية للتسليم",
    subtitle:
      "الورشة مخصصة للطلاب اللي عندهم خبرة بسيطة وعايزين يدخلوا في تطبيق عملي منظم مع مبرمجين ومدربين من ELMOTECH.",
    apply: "قدّم في الورشة",
    details: "تفاصيل الورشة",
    metrics: [
      { value: "Offline", label: "حضور عملي داخل الشركة" },
      { value: "Project", label: "مخرج نهائي قابل للعرض" },
      { value: "Badge", label: "شهادة موثقة من ELMOTECH" },
    ],
    panelEyebrow: "رحلة الورشة",
    panelTitle: "من أساسيات بسيطة لمشروع حقيقي",
    timeline: [
      {
        title: "تجهيز وفهم",
        body: "نراجع المطلوب ونجهز الأدوات قبل الدخول في التنفيذ.",
      },
      {
        title: "تطبيق مع المدربين",
        body: "شرح عملي مباشر وطريقة تفكير واضحة في كل خطوة.",
      },
      {
        title: "تسليم مشروع",
        body: "تطلع بمشروع نهائي يصلح للـ CV أو GitHub.",
      },
    ],
  },
  facts: {
    dateLabel: "موعد البداية",
    dateValue: "يتم الإعلان عنه قريباً",
    modeLabel: "نوع الورشة",
    modeValue: "Offline",
    experienceLabel: "المستوى المطلوب",
    experienceValue: "خبرة بسيطة على الأقل",
    certificateLabel: "الشهادة",
    certificateValue: "موثقة من ELMOTECH",
    priceLabel: "السعر",
    priceValue: "2000 جم",
  },
  value: {
    badge: "محتوى الورشة",
    title: "التركيز كله على التطبيق العملي",
    subtitle:
      "الهدف إن الطالب يخرج من الورشة فاهم طريقة بناء مشروع حقيقي، مش مجرد مشاهدة شرح.",
    items: [
      {
        title: "شرح عملي",
        body: "تنفيذ مباشر وخطوات واضحة من الفكرة لحد التسليم.",
      },
      {
        title: "مشروع نهائي",
        body: "كل طالب يشتغل على مخرج عملي يقدر يضيفه للـ CV أو GitHub.",
      },
      {
        title: "متابعة مهمة",
        body: "في متابعة بعد الورشة للحاجات الأساسية أو النقاط اللي تحتاج توضيح.",
      },
      {
        title: "تأهيل لسوق العمل",
        body: "تركيز على طريقة التفكير، تنظيم الملفات، ومراجعة الكود.",
      },
    ],
  },
  teachers: {
    badge: "المدرسين والمبرمجين",
    title: "تتعلم مع فريق عملي من ELMOTECH",
  },
  pricing: {
    badge: "سعر الورشة",
    title: "استثمار واضح مقابل تجربة عملية كاملة",
    subtitle:
      "السعر منفصل وواضح، ويشمل الحضور العملي، متابعة النقاط المهمة، ومخرج نهائي موثق.",
    label: "قيمة الاشتراك",
    amount: "2000",
    currency: "جم",
    certificate: "يشمل شهادة موثقة من ELMOTECH",
    cta: "احجز مكانك",
    includes: ["شرح Offline", "مشروع نهائي", "متابعة مهمة"],
  },
  apply: {
    badge: "فورم التقديم",
    title: "قدّم بياناتك وسيتم التواصل معك",
    subtitle:
      "الفورم بيجمع البيانات الأساسية ومستواك الحالي عشان نقدر نأكد مناسبة الورشة لك قبل الحجز.",
    notes: [
      "الورشة Offline وليست Live.",
      "وجود خبرة بسيطة مطلوب قبل الحضور.",
      "لينك الموقع الشخصي أو الـ CV اختياري.",
    ],
  },
  form: {
    name: "الاسم بالكامل",
    namePlaceholder: "مثال: أحمد محمد",
    phone: "رقم الموبايل",
    phonePlaceholder: "01xxxxxxxxx",
    email: "البريد الإلكتروني",
    emailPlaceholder: "name@example.com",
    level: "مستواك الحالي",
    levels: {
      basic: "عندي أساسيات بسيطة",
      intermediate: "اشتغلت على مشاريع صغيرة",
      advanced: "عندي خبرة جيدة",
    },
    track: "الاهتمام الأساسي",
    tracks: {
      fullstack: "Full-stack",
      frontend: "Frontend",
      backend: "Backend",
    },
    experience: "اكتب خبرتك باختصار",
    experiencePlaceholder: "مثال: درست HTML/CSS/JS وعملت مشروع بسيط...",
    portfolio: "موقعك أو GitHub (اختياري)",
    cv: "لينك CV (اختياري)",
    motivation: "ليه حابب تدخل الورشة؟",
    motivationPlaceholder: "اكتب هدفك من الورشة أو المشروع اللي نفسك تطلعه...",
    submit: "إرسال التقديم",
    sending: "جاري الإرسال...",
    success: "تم إرسال طلبك بنجاح",
    successBody: "فريق ELMOTECH هيراجع البيانات ويتواصل معك لتأكيد التفاصيل.",
    sendAnother: "إرسال طلب آخر",
  },
  faq: {
    title: "الأسئلة الشائعة",
    items: [
      { question: "هل الورشة Live؟", answer: "لا، الورشة Offline." },
      {
        question: "هل محتاج خبرة قبلها؟",
        answer: "نعم، مطلوب خبرة ولو بسيطة عشان تستفيد من التطبيق العملي.",
      },
      {
        question: "هل فيه مشروع نهائي؟",
        answer: "طبعاً، وفيه شرح عملي يساعدك تطلع بمشروع قابل للعرض.",
      },
      {
        question: "هل فيه متابعة بعد الورشة؟",
        answer: "بالطبع، في متابعة للحاجات المهمة أو النقاط اللي تحتاج توضيح.",
      },
      {
        question: "هل فيه شهادة أو Badge؟",
        answer: "نعم، شهادة موثقة من شركة ELMOTECH.",
      },
      { question: "سعر الورشة كام؟", answer: "سعر الورشة 2000 جم." },
    ],
  },
  errors: {
    name: "الاسم مطلوب",
    phone: "رقم الموبايل مطلوب",
    phoneInvalid: "رقم الموبايل يجب أن يكون بين 10 و 15 رقم",
    email: "البريد الإلكتروني مطلوب",
    emailInvalid: "البريد الإلكتروني غير صحيح",
    experience: "اكتب خبرتك الحالية باختصار",
    motivation: "اكتب سبب التقديم",
    motivationShort: "سبب التقديم يجب أن يكون 10 أحرف على الأقل",
    server: "حدث خطأ أثناء الإرسال، حاول مرة أخرى.",
  },
};

const enCopy = {
  hero: {
    badge: "Offline workshop at ELMOTECH",
    title:
      "A practical workshop for building and shipping a real software project",
    subtitle:
      "Built for students with at least basic experience who want structured hands-on practice with ELMOTECH instructors and software engineers.",
    apply: "Apply now",
    details: "Workshop details",
    metrics: [
      { value: "Offline", label: "Hands-on attendance at the company" },
      { value: "Project", label: "A final project you can present" },
      { value: "Badge", label: "Verified ELMOTECH certificate" },
    ],
    panelEyebrow: "Workshop journey",
    panelTitle: "From basic experience to a real project",
    timeline: [
      {
        title: "Prepare and align",
        body: "Review requirements and set up the tools before building.",
      },
      {
        title: "Build with instructors",
        body: "Practical explanation with clear thinking behind every step.",
      },
      {
        title: "Ship a project",
        body: "Leave with a final project suitable for your CV or GitHub.",
      },
    ],
  },
  facts: {
    dateLabel: "Start date",
    dateValue: "Announced soon",
    modeLabel: "Mode",
    modeValue: "Offline",
    experienceLabel: "Required level",
    experienceValue: "Basic experience required",
    certificateLabel: "Certificate",
    certificateValue: "Verified by ELMOTECH",
    priceLabel: "Price",
    priceValue: "2000 EGP",
  },
  value: {
    badge: "Workshop content",
    title: "Focused on practical implementation",
    subtitle:
      "The goal is for each student to leave with real project-building experience, not just watched lessons.",
    items: [
      {
        title: "Hands-on explanation",
        body: "Live implementation steps from idea to delivery.",
      },
      {
        title: "Final project",
        body: "Each student works toward a project suitable for a CV or GitHub.",
      },
      {
        title: "Important follow-up",
        body: "Follow-up after the workshop for key points that need clarification.",
      },
      {
        title: "Career workflow",
        body: "Focus on thinking, file structure, and code review habits.",
      },
    ],
  },
  teachers: {
    badge: "Instructors and engineers",
    title: "Learn with a practical ELMOTECH team",
  },
  pricing: {
    badge: "Workshop price",
    title: "A clear investment for a complete practical experience",
    subtitle:
      "The price is shown separately and includes offline practice, important follow-up, and a verified final outcome.",
    label: "Enrollment fee",
    amount: "2000",
    currency: "EGP",
    certificate: "Includes a certificate verified by ELMOTECH",
    cta: "Reserve your spot",
    includes: ["Offline explanation", "Final project", "Important follow-up"],
  },
  apply: {
    badge: "Application form",
    title: "Apply and our team will contact you",
    subtitle:
      "The form collects your basics and current level so we can confirm the workshop is a good fit before booking.",
    notes: [
      "The workshop is offline, not live.",
      "At least basic experience is required.",
      "Portfolio, website, GitHub, or CV links are optional.",
    ],
  },
  form: {
    name: "Full name",
    namePlaceholder: "Example: Ahmed Mohamed",
    phone: "Mobile number",
    phonePlaceholder: "01xxxxxxxxx",
    email: "Email",
    emailPlaceholder: "name@example.com",
    level: "Current level",
    levels: {
      basic: "I know the basics",
      intermediate: "I have built small projects",
      advanced: "I have good experience",
    },
    track: "Main interest",
    tracks: {
      fullstack: "Full-stack",
      frontend: "Frontend",
      backend: "Backend",
    },
    experience: "Briefly describe your experience",
    experiencePlaceholder:
      "Example: I studied HTML/CSS/JS and built a small project...",
    portfolio: "Website or GitHub (optional)",
    cv: "CV link (optional)",
    motivation: "Why do you want to join?",
    motivationPlaceholder:
      "Tell us your goal or the project you want to build...",
    submit: "Submit application",
    sending: "Sending...",
    success: "Application sent successfully",
    successBody:
      "The ELMOTECH team will review your details and contact you to confirm next steps.",
    sendAnother: "Send another application",
  },
  faq: {
    title: "FAQ",
    items: [
      {
        question: "Is the workshop live?",
        answer: "No, the workshop is offline.",
      },
      {
        question: "Do I need prior experience?",
        answer:
          "Yes, at least basic experience is required to benefit from the practical work.",
      },
      {
        question: "Is there a final project?",
        answer:
          "Yes, with practical explanation to help you finish a presentable project.",
      },
      {
        question: "Is there follow-up after the workshop?",
        answer: "Yes, for important points or topics that need clarification.",
      },
      {
        question: "Is there a certificate or badge?",
        answer: "Yes, a certificate verified by ELMOTECH.",
      },
      {
        question: "How much does it cost?",
        answer: "The workshop price is 2000 EGP.",
      },
    ],
  },
  errors: {
    name: "Name is required",
    phone: "Mobile number is required",
    phoneInvalid: "Mobile number must be between 10 and 15 digits",
    email: "Email is required",
    emailInvalid: "Invalid email address",
    experience: "Briefly describe your current experience",
    motivation: "Tell us why you want to join",
    motivationShort: "Motivation must be at least 10 characters",
    server: "An error occurred while sending. Please try again.",
  },
};
