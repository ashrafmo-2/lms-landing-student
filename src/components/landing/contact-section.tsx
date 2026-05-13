"use client";

import { Mail, MessageCircle, MapPin, Phone, Send, CheckCircle } from "lucide-react";
import { useState } from "react";
import { sendContactMessage, type ContactPayload } from "@/entities/contact/api";
import { useTranslations } from "next-intl";

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL_FORM: ContactPayload = {
	name: "",
	email: "",
	phone: "",
	subject: "general", // Use key instead of translated string
	message: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ContactSection() {
	const t = useTranslations("Landing.contact");
	const [form, setForm] = useState<ContactPayload>(INITIAL_FORM);
	const [errors, setErrors] = useState<Partial<Record<keyof ContactPayload, string>>>({});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);

	function validate(fields: ContactPayload): Partial<Record<keyof ContactPayload, string>> {
		const errs: Partial<Record<keyof ContactPayload, string>> = {};

		if (!fields.name.trim()) errs.name = t("errors.nameRequired");
		else if (fields.name.length > 255) errs.name = t("errors.nameTooLong");

		if (!fields.email.trim()) errs.email = t("errors.emailRequired");
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
			errs.email = t("errors.emailInvalid");

		if (!fields.phone.trim()) errs.phone = t("errors.phoneRequired");
		else if (!/^\d{10,15}$/.test(fields.phone.replace(/\s/g, "")))
			errs.phone = t("errors.phoneInvalid");

		if (!fields.subject.trim()) errs.subject = t("errors.subjectRequired");

		if (!fields.message.trim()) errs.message = t("errors.messageRequired");
		else if (fields.message.trim().length < 10)
			errs.message = t("errors.messageTooShort");

		return errs;
	}

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) {
		const { id, value } = e.target;
		setForm((prev) => ({ ...prev, [id]: value }));
		// clear field error on change
		if (errors[id as keyof ContactPayload]) {
			setErrors((prev) => ({ ...prev, [id]: undefined }));
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setServerError(null);

		const validationErrors = validate(form);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setLoading(true);
		try {
			// Map key back to meaningful string if API expects it, or keep key if API handles it
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
		`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm ${errors[field]
			? "border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-400/10"
			: "border-[#e2e8f0] focus:border-[#6c3aff] focus:ring-4 focus:ring-[#6c3aff]/10"
		}`;

	return (
		<section id="contact" className="py-24 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-16 items-start">
					{/* ── Contact Info ── */}
					<div>
						<div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-bold mb-3">
							{t("badge")}
						</div>
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
							{t("title")}
						</h2>
						<p className="text-lg text-gray-600 mb-10">
							{t("subtitle")}
						</p>

						<div className="space-y-8">
							<div className="flex items-start gap-4">
								<div className="w-12 h-12 rounded-2xl bg-[#ede9ff] flex items-center justify-center shrink-0">
									<Phone className="w-6 h-6 text-[#6c3aff]" />
								</div>
								<div>
									<h4 className="font-bold text-[#0f172a] mb-1">{t("info.call")}</h4>
									<p className="text-[#64748b]" dir="ltr">+20 123 456 7890</p>
									<p className="text-[#64748b]" dir="ltr">+20 111 222 3333</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="w-12 h-12 rounded-2xl bg-[#ede9ff] flex items-center justify-center shrink-0">
									<Mail className="w-6 h-6 text-[#6c3aff]" />
								</div>
								<div>
									<h4 className="font-bold text-[#0f172a] mb-1">{t("info.email")}</h4>
									<p className="text-[#64748b]">support@edustar.com</p>
									<p className="text-[#64748b]">info@edustar.com</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="w-12 h-12 rounded-2xl bg-[#ede9ff] flex items-center justify-center shrink-0">
									<MapPin className="w-6 h-6 text-[#6c3aff]" />
								</div>
								<div>
									<h4 className="font-bold text-[#0f172a] mb-1">{t("info.location")}</h4>
									<p className="text-[#64748b]">{t("info.locationDesc")}</p>
								</div>
							</div>
						</div>

						<div className="mt-12 p-6 bg-[#f8fafc] rounded-3xl border border-[#e2e8f0] flex items-center gap-4">
							<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
								<MessageCircle className="w-5 h-5 text-green-600" />
							</div>
							<div>
								<p className="text-sm font-bold text-[#0f172a]">{t("info.whatsapp")}</p>
								<p className="text-xs text-[#64748b]">{t("info.whatsappDesc")}</p>
							</div>
						</div>
					</div>

					{/* ── Contact Form ── */}
					<div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
						<div className="absolute -top-10 -left-10 w-40 h-40 bg-[#6c3aff]/5 rounded-full blur-3xl" />
						<div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#6c3aff]/5 rounded-full blur-3xl" />

						{/* ── Success state ── */}
						{success ? (
							<div className="relative z-10 flex flex-col items-center justify-center py-16 text-center gap-4">
								<div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
									<CheckCircle className="w-8 h-8 text-green-600" />
								</div>
								<h3 className="text-xl font-bold text-[#0f172a]">{t("form.success")}</h3>
								<p className="text-[#64748b] text-sm">{t("form.successDesc")}</p>
								<button
									type="button"
									onClick={() => setSuccess(false)}
									className="mt-4 text-sm text-[#6c3aff] font-bold hover:underline"
								>
									{t("form.sendAnother")}
								</button>
							</div>
						) : (
							<form className="space-y-5 relative z-10" onSubmit={handleSubmit} noValidate>
								<div className="grid sm:grid-cols-2 gap-5">
									{/* Name */}
									<div>
										<label htmlFor="name" className="block text-sm font-bold text-[#0f172a] mb-2">
											{t("form.name")}
										</label>
										<input
											id="name"
											type="text"
											placeholder={t("form.namePlaceholder")}
											value={form.name}
											onChange={handleChange}
											className={inputClass("name")}
										/>
										{errors.name && (
											<p className="text-red-500 text-xs mt-1">{errors.name}</p>
										)}
									</div>

									{/* Phone */}
									<div>
										<label htmlFor="phone" className="block text-sm font-bold text-[#0f172a] mb-2">
											{t("form.phone")}
										</label>
										<input
											id="phone"
											type="tel"
											placeholder={t("form.phonePlaceholder")}
											value={form.phone}
											onChange={handleChange}
											className={inputClass("phone")}
											dir="ltr"
										/>
										{errors.phone && (
											<p className="text-red-500 text-xs mt-1">{errors.phone}</p>
										)}
									</div>
								</div>

								{/* Email */}
								<div>
									<label htmlFor="email" className="block text-sm font-bold text-[#0f172a] mb-2">
										{t("form.email")}
									</label>
									<input
										id="email"
										type="email"
										placeholder={t("form.emailPlaceholder")}
										value={form.email}
										onChange={handleChange}
										className={inputClass("email")}
										dir="ltr"
									/>
									{errors.email && (
										<p className="text-red-500 text-xs mt-1">{errors.email}</p>
									)}
								</div>

								{/* Subject */}
								<div>
									<label htmlFor="subject" className="block text-sm font-bold text-[#0f172a] mb-2">
										{t("form.subject")}
									</label>
									<select
										id="subject"
										value={form.subject}
										onChange={handleChange}
										className={`${inputClass("subject")} appearance-none bg-white`}
									>
										<option value="general">{t("form.subjects.general")}</option>
										<option value="support">{t("form.subjects.support")}</option>
										<option value="complaint">{t("form.subjects.complaint")}</option>
										<option value="subscription">{t("form.subjects.subscription")}</option>
									</select>
									{errors.subject && (
										<p className="text-red-500 text-xs mt-1">{errors.subject}</p>
									)}
								</div>

								{/* Message */}
								<div>
									<label htmlFor="message" className="block text-sm font-bold text-[#0f172a] mb-2">
										{t("form.message")}
									</label>
									<textarea
										id="message"
										rows={4}
										placeholder={t("form.messagePlaceholder")}
										value={form.message}
										onChange={handleChange}
										className={`${inputClass("message")} resize-none`}
									/>
									{errors.message && (
										<p className="text-red-500 text-xs mt-1">{errors.message}</p>
									)}
								</div>

								{/* Server error */}
								{serverError && (
									<p className="text-red-500 text-sm text-center">{serverError}</p>
								)}

								<button
									type="submit"
									disabled={loading}
									className="w-full bg-[#6c3aff] hover:bg-[#5228e8] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#6c3aff]/20 flex items-center justify-center gap-2 group"
								>
									{loading ? (
										<>
											<span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
											{t("form.sending")}
										</>
									) : (
										<>
											{t("form.submit")}
											<Send className="w-4 h-4 ltr:rotate-180 group-hover:-translate-x-1 group-hover:translate-y-1 transition-transform" />
										</>
									)}
								</button>
							</form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

