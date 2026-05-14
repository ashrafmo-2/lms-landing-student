"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Mail, Loader2, ArrowRight, CheckCircle,
    ShieldCheck, Lock, Eye, EyeOff,
} from "lucide-react";
import {
    sendForgotPasswordOtp,
    verifyForgotPasswordOtp,
    resetPassword,
} from "@/entities/auth/api";
import { getApiErrorMessage } from "@/shared/lib/api-error";

type Step = "email" | "otp" | "reset" | "success";

// ─── Schemas ──────────────────────────────────────────────────────────────────
const emailSchema = z.object({
    email: z.string().email("البريد الإلكتروني غير صحيح"),
});

const resetSchema = z
    .object({
        password: z
            .string()
            .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
            .regex(/[A-Za-z]/, "يجب أن تحتوي على حروف")
            .regex(/[0-9]/, "يجب أن تحتوي على أرقام"),
        confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "كلمتا المرور غير متطابقتين",
        path: ["confirmPassword"],
    });

type EmailFormValues = z.infer<typeof emailSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

// ─── OTP Input ────────────────────────────────────────────────────────────────
function OtpInput({
    value,
    onChange,
}: {
    value: string[];
    onChange: (v: string[]) => void;
}) {
    const refs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const handleChange = (index: number, val: string) => {
        if (!/^\d*$/.test(val)) return;
        const next = [...value];
        next[index] = val.slice(-1);
        onChange(next);
        if (val && index < 3) refs[index + 1].current?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !value[index] && index > 0) {
            refs[index - 1].current?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
        const next = [...value];
        pasted.split("").forEach((char, i) => { next[i] = char; });
        onChange(next);
        refs[Math.min(pasted.length, 3)].current?.focus();
    };

    return (
        <div className="flex gap-3 justify-center" dir="ltr">
            {refs.map((ref, i) => (
                <input
                    key={i}
                    ref={ref}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[i] || ""}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className="w-14 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all border-[#e2e8f0] focus:border-[#6c3aff] focus:ring-2 focus:ring-[#6c3aff]/20"
                />
            ))}
        </div>
    );
}

import { useLocale, useTranslations } from "next-intl";

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ForgotPasswordPage() {
    const t = useTranslations("Auth.forgotPassword");
    const tReset = useTranslations("Auth.resetPassword");
    const tOtp = useTranslations("Auth.otp");
    const tSignup = useTranslations("Auth.signup");

    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
    const [otpError, setOtpError] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const locale = useLocale();

    // ── Schemas ──────────────────────────────────────────────────────────────────
    const emailSchema = z.object({
        email: z.string().email(tSignup("errors.emailInvalid")),
    });

    const resetSchema = z
        .object({
            password: z
                .string()
                .min(8, tSignup("errors.passwordMin"))
                .regex(/[A-Za-z]/, tSignup("errors.passwordLetter"))
                .regex(/[0-9]/, tSignup("errors.passwordNumber")),
            confirmPassword: z.string(),
        })
        .refine((d) => d.password === d.confirmPassword, {
            message: tSignup("errors.passwordsMismatch"),
            path: ["confirmPassword"],
        });

    type EmailFormValues = z.infer<typeof emailSchema>;
    type ResetFormValues = z.infer<typeof resetSchema>;

    // ── Step 1: Email form ──────────────────────────────────────────────────────
    const emailForm = useForm<EmailFormValues>({
        resolver: zodResolver(emailSchema),
    });

    const onSendOtp = async (values: EmailFormValues) => {
        try {
            await sendForgotPasswordOtp(values.email);
            setEmail(values.email);
            setStep("otp");
        } catch (err) {
            emailForm.setError("email", { message: getApiErrorMessage(err) });
        }
    };

    // ── Step 2: Verify OTP ──────────────────────────────────────────────────────
    const handleVerifyOtp = async () => {
        const otp = otpDigits.join("");
        if (otp.length < 4) {
            setOtpError(tOtp("error"));
            return;
        }
        try {
            setOtpError("");
            setOtpLoading(true);
            await verifyForgotPasswordOtp({ email, otp });
            setStep("reset");
        } catch (err) {
            setOtpError(getApiErrorMessage(err));
        } finally {
            setOtpLoading(false);
        }
    };

    // ── Step 3: Reset password form ─────────────────────────────────────────────
    const resetForm = useForm<ResetFormValues>({
        resolver: zodResolver(resetSchema),
    });

    const onResetPassword = async (values: ResetFormValues) => {
        try {
            const otp = otpDigits.join("");
            await resetPassword({ email, otp, password: values.password });
            setStep("success");
        } catch (err) {
            resetForm.setError("password", { message: getApiErrorMessage(err) });
        }
    };

    // ── Step indicator ──────────────────────────────────────────────────────────
    const steps = ["email", "otp", "reset"] as const;
    const currentStepIndex = steps.indexOf(step as typeof steps[number]);

    const StepIndicator = () => (
        <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < currentStepIndex
                            ? "bg-[#22c55e] text-white"
                            : i === currentStepIndex
                                ? "bg-[#6c3aff] text-white"
                                : "bg-[#f1f5f9] text-[#94a3b8]"
                            }`}
                    >
                        {i < currentStepIndex ? <CheckCircle className="w-4 h-4" /> : i + 1}
                    </div>
                    {i < steps.length - 1 && (
                        <div
                            className={`w-8 h-0.5 transition-all ${i < currentStepIndex ? "bg-[#22c55e]" : "bg-[#e2e8f0]"
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );

    // ── Success screen ──────────────────────────────────────────────────────────
    if (step === "success") {
        return (
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-[#0f172a] mb-3">
                        {tReset("successTitle")}
                    </h1>
                    <p className="text-sm text-[#64748b] mb-8">
                        {tReset("successDesc")}
                    </p>
                    <button onClick={() => router.push(`${locale}/auth/login`)} className="w-full bg-[#6c3aff] hover:bg-[#5228e8] text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-[#6c3aff]/30">
                        {tReset("loginLink") || tSignup("loginLink")}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-8">

                {/* ── Step 1: Email ─────────────────────────────────────────────────── */}
                {step === "email" && (
                    <>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-[#ede9ff] flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-[#6c3aff]" />
                            </div>
                            <h1 className="text-2xl font-extrabold text-[#0f172a] mb-2">
                                {t("title")}
                            </h1>
                            <p className="text-sm text-[#64748b]">
                                {t("subtitle")}
                            </p>
                        </div>

                        <StepIndicator />

                        <form onSubmit={emailForm.handleSubmit(onSendOtp)} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                                    {tSignup("email")}
                                </label>
                                <div className="relative">
                                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                                    <input
                                        type="email"
                                        placeholder="example@email.com"
                                        dir="ltr"
                                        className={`w-full pr-10 pl-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${emailForm.formState.errors.email
                                            ? "border-red-400 focus:ring-2 focus:ring-red-200"
                                            : "border-[#e2e8f0] focus:border-[#6c3aff] focus:ring-2 focus:ring-[#6c3aff]/20"
                                            }`}
                                        {...emailForm.register("email")}
                                    />
                                </div>
                                {emailForm.formState.errors.email && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {emailForm.formState.errors.email.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={emailForm.formState.isSubmitting}
                                className="w-full flex items-center justify-center gap-2 bg-[#6c3aff] hover:bg-[#5228e8] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-[#6c3aff]/30"
                            >
                                {emailForm.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {t("sending")}
                                    </>
                                ) : (
                                    t("sendOtp")
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                href={`${locale}/auth/login`}
                                className="inline-flex items-center gap-2 text-sm text-[#64748b] hover:text-[#6c3aff] transition-colors"
                            >
                                <ArrowRight className="w-4 h-4 ltr:rotate-180" />
                                {t("backToLogin")}
                            </Link>
                        </div>
                    </>
                )}

                {/* ── Step 2: OTP ───────────────────────────────────────────────────── */}
                {step === "otp" && (
                    <>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-[#ede9ff] flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="w-8 h-8 text-[#6c3aff]" />
                            </div>
                            <h1 className="text-2xl font-extrabold text-[#0f172a] mb-2">
                                {tOtp("confirm")}
                            </h1>
                            <p className="text-sm text-[#64748b] mb-1">
                                {tOtp("subtitle")}
                            </p>
                            <p className="text-sm font-semibold text-[#6c3aff] break-all" dir="ltr">
                                {email}
                            </p>
                        </div>

                        <StepIndicator />

                        <OtpInput value={otpDigits} onChange={setOtpDigits} />

                        {otpError && (
                            <p className="mt-3 text-sm text-red-500 text-center">{otpError}</p>
                        )}

                        <button
                            onClick={handleVerifyOtp}
                            disabled={otpLoading || otpDigits.join("").length < 4}
                            className="w-full flex items-center justify-center gap-2 bg-[#6c3aff] hover:bg-[#5228e8] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-[#6c3aff]/30 mt-6"
                        >
                            {otpLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {tOtp("verifying")}
                                </>
                            ) : (
                                tOtp("confirm")
                            )}
                        </button>

                        <div className="mt-4 flex items-center justify-between text-sm">
                            <button
                                onClick={() => setStep("email")}
                                className="text-[#64748b] hover:text-[#6c3aff] transition-colors"
                            >
                                {tOtp("editEmail")}
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        await sendForgotPasswordOtp(email);
                                    } catch {
                                        setOtpError(tOtp("resendError"));
                                    }
                                }}
                                className="text-[#6c3aff] hover:underline"
                            >
                                {tOtp("resend")}
                            </button>
                        </div>
                    </>
                )}

                {/* ── Step 3: Reset Password ────────────────────────────────────────── */}
                {step === "reset" && (
                    <>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-[#ede9ff] flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-8 h-8 text-[#6c3aff]" />
                            </div>
                            <h1 className="text-2xl font-extrabold text-[#0f172a] mb-2">
                                {tReset("title")}
                            </h1>
                            <p className="text-sm text-[#64748b]">
                                {tReset("subtitle")}
                            </p>
                        </div>

                        <StepIndicator />

                        <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-4">
                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                                    {tReset("newPassword")}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className={`w-full pr-10 pl-10 py-2.5 rounded-xl border text-sm outline-none transition-all ${resetForm.formState.errors.password
                                            ? "border-red-400 focus:ring-2 focus:ring-red-200"
                                            : "border-[#e2e8f0] focus:border-[#6c3aff] focus:ring-2 focus:ring-[#6c3aff]/20"
                                            }`}
                                        {...resetForm.register("password")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]"
                                        aria-label="toggle password"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {resetForm.formState.errors.password && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {resetForm.formState.errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                                    {tReset("confirmPassword")}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="••••••••"
                                        className={`w-full pr-10 pl-10 py-2.5 rounded-xl border text-sm outline-none transition-all ${resetForm.formState.errors.confirmPassword
                                            ? "border-red-400 focus:ring-2 focus:ring-red-200"
                                            : "border-[#e2e8f0] focus:border-[#6c3aff] focus:ring-2 focus:ring-[#6c3aff]/20"
                                            }`}
                                        {...resetForm.register("confirmPassword")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]"
                                        aria-label="toggle confirm password"
                                    >
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {resetForm.formState.errors.confirmPassword && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {resetForm.formState.errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={resetForm.formState.isSubmitting}
                                className="w-full flex items-center justify-center gap-2 bg-[#6c3aff] hover:bg-[#5228e8] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-[#6c3aff]/30"
                            >
                                {resetForm.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {tReset("saving")}
                                    </>
                                ) : (
                                    tReset("savePassword")
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

