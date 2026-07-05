"use client";

import {
  CheckCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { ChangeEvent, FormEvent, InputHTMLAttributes } from "react";
import { useState } from "react";
import {
  type ContactPayload,
  sendContactMessage,
} from "@/entities/contact/api";

const INITIAL_FORM: ContactPayload = {
  name: "",
  email: "",
  phone: "",
  subject: "general",
  message: "",
};

export function ContactSection() {
  const t = useTranslations("Landing.contact");
  const [form, setForm] = useState<ContactPayload>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactPayload, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function validate(
    fields: ContactPayload,
  ): Partial<Record<keyof ContactPayload, string>> {
    const errs: Partial<Record<keyof ContactPayload, string>> = {};

    if (!fields.name.trim()) errs.name = t("errors.nameRequired");
    else if (fields.name.length > 255) errs.name = t("errors.nameTooLong");

    if (!fields.email.trim()) errs.email = t("errors.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errs.email = t("errors.emailInvalid");
    }

    if (!fields.phone.trim()) errs.phone = t("errors.phoneRequired");
    else if (!/^\d{10,15}$/.test(fields.phone.replace(/\s/g, ""))) {
      errs.phone = t("errors.phoneInvalid");
    }

    if (!fields.subject.trim()) errs.subject = t("errors.subjectRequired");

    if (!fields.message.trim()) errs.message = t("errors.messageRequired");
    else if (fields.message.trim().length < 10)
      errs.message = t("errors.messageTooShort");

    return errs;
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (errors[id as keyof ContactPayload]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await sendContactMessage({
        ...form,
        subject: t(`form.subjects.${form.subject}`),
      });
      setSuccess(true);
      setForm(INITIAL_FORM);
      setErrors({});
    } catch {
      setServerError(t("errors.serverError"));
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (field: keyof ContactPayload) =>
    `focus-ring w-full border bg-white px-4 py-3 text-sm text-[#101827] outline-none transition-all ${
      errors[field]
        ? "border-[#d92d20] focus:border-[#d92d20]"
        : "border-[#d9e3ee] focus:border-[#0067b8]"
    }`;

  const infoItems = [
    {
      icon: Phone,
      title: t("info.call"),
      lines: ["+20 123 456 7890", "+20 111 222 3333"],
      dir: "ltr" as const,
    },
    {
      icon: Mail,
      title: t("info.email"),
      lines: ["support@edustar.com", "info@edustar.com"],
    },
    {
      icon: MapPin,
      title: t("info.location"),
      lines: [t("info.locationDesc")],
    },
  ];

  return (
    <section id="contact" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div data-reveal="left">
            <div className="section-kicker mb-4">
              <MessageCircle className="h-3.5 w-3.5" />
              {t("badge")}
            </div>
            <h2 className="max-w-xl text-4xl font-black leading-tight text-[#101827] md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#5d6b7d]">
              {t("subtitle")}
            </p>

            <div className="mt-10 divide-y divide-[#d9e3ee] border-y border-[#d9e3ee]">
              {infoItems.map(({ icon: Icon, title, lines, dir }) => (
                <div key={title} className="flex gap-4 py-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#e8f4ff] text-[#0067b8]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-[#101827]">{title}</h4>
                    {lines.map((line) => (
                      <p
                        key={line}
                        className="mt-1 text-sm font-bold text-[#627084]"
                        dir={dir}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border border-[#d9e3ee] bg-[#f8fbfd] p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center bg-[#ecfdf3] text-[#12b76a]">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#101827]">
                    {t("info.whatsapp")}
                  </p>
                  <p className="text-xs font-bold text-[#627084]">
                    {t("info.whatsappDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="border border-[#d9e3ee] bg-[#f8fbfd] p-4 shadow-[0_24px_70px_rgba(16,24,39,0.1)] sm:p-6"
            data-reveal="right"
          >
            <div className="border border-[#e2ebf4] bg-white p-5 sm:p-7">
              {success ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center bg-[#ecfdf3] text-[#12b76a]">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-black text-[#101827]">
                    {t("form.success")}
                  </h3>
                  <p className="max-w-sm text-sm leading-6 text-[#627084]">
                    {t("form.successDesc")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="focus-ring mt-2 border border-[#d9e3ee] px-4 py-2 text-sm font-black text-[#0067b8] transition-colors hover:bg-[#f8fbfd]"
                  >
                    {t("form.sendAnother")}
                  </button>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      id="name"
                      label={t("form.name")}
                      placeholder={t("form.namePlaceholder")}
                      value={form.name}
                      onChange={handleChange}
                      className={inputClass("name")}
                      error={errors.name}
                    />
                    <Field
                      id="phone"
                      type="tel"
                      label={t("form.phone")}
                      placeholder={t("form.phonePlaceholder")}
                      value={form.phone}
                      onChange={handleChange}
                      className={inputClass("phone")}
                      error={errors.phone}
                      dir="ltr"
                    />
                  </div>

                  <Field
                    id="email"
                    type="email"
                    label={t("form.email")}
                    placeholder={t("form.emailPlaceholder")}
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass("email")}
                    error={errors.email}
                    dir="ltr"
                  />

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-black text-[#101827]"
                    >
                      {t("form.subject")}
                    </label>
                    <select
                      id="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className={`${inputClass("subject")} appearance-none`}
                    >
                      <option value="general">
                        {t("form.subjects.general")}
                      </option>
                      <option value="support">
                        {t("form.subjects.support")}
                      </option>
                      <option value="complaint">
                        {t("form.subjects.complaint")}
                      </option>
                      <option value="subscription">
                        {t("form.subjects.subscription")}
                      </option>
                    </select>
                    {errors.subject && (
                      <p className="mt-1 text-xs font-bold text-[#d92d20]">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-black text-[#101827]"
                    >
                      {t("form.message")}
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder={t("form.messagePlaceholder")}
                      value={form.message}
                      onChange={handleChange}
                      className={`${inputClass("message")} resize-none`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs font-bold text-[#d92d20]">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {serverError && (
                    <p className="text-center text-sm font-bold text-[#d92d20]">
                      {serverError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="focus-ring group flex w-full items-center justify-center gap-2 bg-[#101827] py-4 text-sm font-black text-white shadow-[0_18px_38px_rgba(16,24,39,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0067b8] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin border-2 border-white/40 border-t-white" />
                        {t("form.sending")}
                      </>
                    ) : (
                      <>
                        {t("form.submit")}
                        <Send className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:rotate-180" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  id: keyof ContactPayload;
  label: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-black text-[#101827]"
      >
        {label}
      </label>
      <input id={id} {...props} />
      {error && (
        <p className="mt-1 text-xs font-bold text-[#d92d20]">{error}</p>
      )}
    </div>
  );
}
