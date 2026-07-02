"use client";

import {
  Award,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle,
  CircleCheck,
  Clock,
  Code2,
  Link as LinkIcon,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";
import type { ChangeEvent, ElementType, FormEvent, ReactNode } from "react";
import { useState } from "react";
import { sendContactMessage } from "@/entities/contact/api";
import { Footer } from "@/widgets/landing-footer";
import { Navbar } from "@/widgets/landing-navbar";

type ApplicationForm = {
  name: string;
  phone: string;
  email: string;
  level: string;
  track: string;
  experience: string;
  portfolio: string;
  cv: string;
  motivation: string;
};

const INITIAL_FORM: ApplicationForm = {
  name: "",
  phone: "",
  email: "",
  level: "basic",
  track: "fullstack",
  experience: "",
  portfolio: "",
  cv: "",
  motivation: "",
};

const teachers = [
  {
    name: "Ashraf Mohamed",
    image: "/ashraf mohamed.png",
    roleAr: "Frontend Instructor",
    roleEn: "Frontend Instructor",
    focusAr:
      "تنفيذ واجهات احترافية، تنظيم مكونات React، ومراجعة تجربة المستخدم",
    focusEn: "Professional UI implementation, React components, and UX review",
    stack: ["React", "Next.js", "TypeScript"],
  },
  {
    name: "Mahmoud Saber",
    image: "/mahmoud saber.png",
    roleAr: "Frontend Engineer",
    roleEn: "Frontend Engineer",
    focusAr: "تطبيق عملي، تحسين جودة الكود، وتجهيز مشروع Frontend قابل للعرض",
    focusEn:
      "Hands-on practice, code quality, and portfolio-ready frontend work",
    stack: ["JavaScript", "React", "UI"],
  },
];

const agenda = [
  {
    titleAr: "تجهيز بيئة العمل",
    titleEn: "Workspace setup",
    bodyAr: "تثبيت الأدوات، مراجعة الأساسيات، والتأكد إن كل طالب جاهز للتطبيق.",
    bodyEn:
      "Install tools, revise the basics, and make sure everyone is ready to build.",
  },
  {
    titleAr: "شرح عملي مباشر",
    titleEn: "Practical build session",
    bodyAr:
      "تنفيذ أجزاء حقيقية خطوة بخطوة مع توضيح طريقة التفكير قبل كتابة الكود.",
    bodyEn:
      "Build real pieces step by step while explaining the thinking behind the code.",
  },
  {
    titleAr: "المشروع النهائي",
    titleEn: "Final project",
    bodyAr: "تجميع الناتج في مشروع كامل قابل للعرض في الـ CV أو GitHub.",
    bodyEn:
      "Turn the work into a complete project that can be shown on a CV or GitHub.",
  },
];

export default function WorkshopsPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [form, setForm] = useState<ApplicationForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ApplicationForm, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const copy = isAr ? arCopy : enCopy;

  function validate(fields: ApplicationForm) {
    const nextErrors: Partial<Record<keyof ApplicationForm, string>> = {};

    if (!fields.name.trim()) nextErrors.name = copy.errors.name;
    if (!fields.phone.trim()) nextErrors.phone = copy.errors.phone;
    else if (!/^\d{10,15}$/.test(fields.phone.replace(/\s/g, ""))) {
      nextErrors.phone = copy.errors.phoneInvalid;
    }
    if (!fields.email.trim()) nextErrors.email = copy.errors.email;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      nextErrors.email = copy.errors.emailInvalid;
    }
    if (!fields.experience.trim())
      nextErrors.experience = copy.errors.experience;
    if (!fields.motivation.trim())
      nextErrors.motivation = copy.errors.motivation;
    else if (fields.motivation.trim().length < 10) {
      nextErrors.motivation = copy.errors.motivationShort;
    }

    return nextErrors;
  }

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { id, value } = event.target;
    setForm((current) => ({ ...current, [id]: value }));
    if (errors[id as keyof ApplicationForm]) {
      setErrors((current) => ({ ...current, [id]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setServerError(null);

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await sendContactMessage({
        name: form.name,
        phone: form.phone,
        email: form.email,
        subject: "Workshop application - ELMOTECH offline workshop",
        source: "workshop_application",
        metadata: {
          level: form.level,
          track: form.track,
          portfolio: form.portfolio || null,
          cv: form.cv || null,
        },
        message: [
          "Workshop application",
          `Level: ${form.level}`,
          `Track: ${form.track}`,
          `Experience: ${form.experience}`,
          `Portfolio / website: ${form.portfolio || "Not provided"}`,
          `CV: ${form.cv || "Not provided"}`,
          `Motivation: ${form.motivation}`,
        ].join("\n"),
      });
      setSuccess(true);
      setForm(INITIAL_FORM);
      setErrors({});
    } catch {
      setServerError(copy.errors.server);
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (field: keyof ApplicationForm) =>
    `w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-950 outline-none transition ${
      errors[field]
        ? "border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-400/10"
        : "border-slate-200 focus:border-[#6c3aff] focus:ring-4 focus:ring-[#6c3aff]/10"
    }`;

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
              {copy.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              {copy.hero.subtitle}
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
              <a
                href="#apply"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-black text-[#151029] shadow-xl shadow-black/20 transition hover:bg-amber-100"
              >
                {copy.hero.apply}
                <Send className="h-4 w-4" />
              </a>
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sm font-black text-[#6c3aff]">
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
                  value={copy.facts.dateValue}
                  dark
                />
                <InfoRow
                  icon={Clock}
                  label={copy.facts.modeLabel}
                  value={copy.facts.modeValue}
                  dark
                />
                <InfoRow
                  icon={BriefcaseBusiness}
                  label={copy.facts.experienceLabel}
                  value={copy.facts.experienceValue}
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
              <span className="inline-flex items-center gap-2 rounded-full bg-[#ede9ff] px-4 py-2 text-sm font-black text-[#6c3aff]">
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
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#6c3aff]/30 hover:shadow-xl hover:shadow-[#6c3aff]/10"
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
            {agenda.map((item, index) => (
              <div
                key={item.titleEn}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#151029] text-sm font-black text-white">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-lg font-black text-slate-950">
                  {isAr ? item.titleAr : item.titleEn}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {isAr ? item.bodyAr : item.bodyEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

              <a
                href="#apply"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#151029] px-6 py-4 text-sm font-black text-white transition hover:bg-[#6c3aff]"
              >
                {copy.pricing.cta}
                <Send className="h-4 w-4" />
              </a>
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
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ede9ff] px-4 py-2 text-sm font-black text-[#6c3aff]">
              <Code2 className="h-4 w-4" />
              {copy.teachers.badge}
            </span>
            <h2 className="mt-5 text-3xl font-black text-slate-950 md:text-4xl">
              {copy.teachers.title}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {teachers.map((teacher) => (
              <article
                key={teacher.name}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80"
              >
                <div className="relative h-72 bg-[#151029] sm:h-80">
                  <Image
                    src={teacher.image}
                    alt={teacher.name}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/70 to-transparent" />
                </div>
                <div className="p-7">
                  <h3 className="text-2xl font-black text-slate-950">
                    {teacher.name}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-[#6c3aff]">
                    {isAr ? teacher.roleAr : teacher.roleEn}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {isAr ? teacher.focusAr : teacher.focusEn}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {teacher.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
              <Send className="h-4 w-4" />
              {copy.apply.badge}
            </span>
            <h2 className="mt-5 text-3xl font-black text-slate-950 md:text-4xl">
              {copy.apply.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {copy.apply.subtitle}
            </p>

            <div className="mt-8 space-y-3">
              {copy.apply.notes.map((note) => (
                <div
                  key={note}
                  className="flex items-start gap-3 text-sm font-bold text-slate-700"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
            {success ? (
              <div className="flex min-h-96 flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle className="h-9 w-9" />
                </div>
                <h3 className="mt-5 text-2xl font-black text-slate-950">
                  {copy.form.success}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                  {copy.form.successBody}
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-6 rounded-lg border border-slate-200 px-5 py-3 text-sm font-black text-slate-900 hover:bg-slate-50"
                >
                  {copy.form.sendAnother}
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    htmlFor="name"
                    label={copy.form.name}
                    error={errors.name}
                  >
                    <input
                      id="name"
                      value={form.name}
                      onChange={handleChange}
                      className={inputClass("name")}
                      placeholder={copy.form.namePlaceholder}
                    />
                  </Field>
                  <Field
                    htmlFor="phone"
                    label={copy.form.phone}
                    error={errors.phone}
                  >
                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className={inputClass("phone")}
                      placeholder={copy.form.phonePlaceholder}
                      dir="ltr"
                    />
                  </Field>
                </div>

                <Field
                  htmlFor="email"
                  label={copy.form.email}
                  error={errors.email}
                >
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass("email")}
                    placeholder={copy.form.emailPlaceholder}
                    dir="ltr"
                  />
                </Field>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field htmlFor="level" label={copy.form.level}>
                    <select
                      id="level"
                      value={form.level}
                      onChange={handleChange}
                      className={inputClass("level")}
                    >
                      <option value="basic">{copy.form.levels.basic}</option>
                      <option value="intermediate">
                        {copy.form.levels.intermediate}
                      </option>
                      <option value="advanced">
                        {copy.form.levels.advanced}
                      </option>
                    </select>
                  </Field>
                  <Field htmlFor="track" label={copy.form.track}>
                    <select
                      id="track"
                      value={form.track}
                      onChange={handleChange}
                      className={inputClass("track")}
                    >
                      <option value="fullstack">
                        {copy.form.tracks.fullstack}
                      </option>
                      <option value="frontend">
                        {copy.form.tracks.frontend}
                      </option>
                      <option value="backend">
                        {copy.form.tracks.backend}
                      </option>
                    </select>
                  </Field>
                </div>

                <Field
                  htmlFor="experience"
                  label={copy.form.experience}
                  error={errors.experience}
                >
                  <textarea
                    id="experience"
                    value={form.experience}
                    onChange={handleChange}
                    className={`${inputClass("experience")} min-h-24 resize-none`}
                    placeholder={copy.form.experiencePlaceholder}
                  />
                </Field>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field htmlFor="portfolio" label={copy.form.portfolio}>
                    <div className="relative">
                      <LinkIcon className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 ltr:left-3 rtl:right-3" />
                      <input
                        id="portfolio"
                        type="url"
                        value={form.portfolio}
                        onChange={handleChange}
                        className={`${inputClass("portfolio")} ltr:pl-10 rtl:pr-10`}
                        placeholder="https://example.com"
                        dir="ltr"
                      />
                    </div>
                  </Field>
                  <Field htmlFor="cv" label={copy.form.cv}>
                    <div className="relative">
                      <LinkIcon className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 ltr:left-3 rtl:right-3" />
                      <input
                        id="cv"
                        type="url"
                        value={form.cv}
                        onChange={handleChange}
                        className={`${inputClass("cv")} ltr:pl-10 rtl:pr-10`}
                        placeholder="https://drive.google.com/..."
                        dir="ltr"
                      />
                    </div>
                  </Field>
                </div>

                <Field
                  htmlFor="motivation"
                  label={copy.form.motivation}
                  error={errors.motivation}
                >
                  <textarea
                    id="motivation"
                    value={form.motivation}
                    onChange={handleChange}
                    className={`${inputClass("motivation")} min-h-28 resize-none`}
                    placeholder={copy.form.motivationPlaceholder}
                  />
                </Field>

                {serverError && (
                  <p className="text-center text-sm font-bold text-red-500">
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6c3aff] px-6 py-4 text-sm font-black text-white shadow-lg shadow-[#6c3aff]/20 transition hover:bg-[#5228e8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      {copy.form.sending}
                    </>
                  ) : (
                    <>
                      {copy.form.submit}
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
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
  icon: ElementType;
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
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${highlight ? "bg-amber-50 text-amber-700" : "bg-[#ede9ff] text-[#6c3aff]"}`}
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

function Field({
  htmlFor,
  label,
  error,
  children,
}: {
  htmlFor: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="block">
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-black text-slate-950"
      >
        {label}
      </label>
      {children}
      {error && (
        <span className="mt-1 block text-xs font-bold text-red-500">
          {error}
        </span>
      )}
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
