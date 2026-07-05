"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/auth-context";
import {
  createSignupSchema,
  type SignupFormValues,
} from "@/features/auth/signup/schema";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { LabelDir } from "@/shared/ui/Label-dir";

function OtpInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const inputIds = ["otp-1", "otp-2", "otp-3", "otp-4"];
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
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    const next = [...value];
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    onChange(next);
    refs[Math.min(pasted.length, 3)].current?.focus();
  };

  return (
    <div className="flex gap-3 justify-center" dir="ltr">
      {refs.map((ref, i) => (
        <input
          key={inputIds[i]}
          ref={ref}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-14 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all border-[#e2e8f0] focus:border-[#0067b8] focus:ring-2 focus:ring-[#0067b8]/20"
        />
      ))}
    </div>
  );
}

export default function SignupPage() {
  const t = useTranslations("Auth.signup");
  const tOtp = useTranslations("Auth.otp");
  const [step, setStep] = useState<"register" | "otp">("register");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");

  const locale = useLocale();

  const passwordRules = [
    { label: t("passwordRules.minChars"), test: (p: string) => p.length >= 8 },
    {
      label: t("passwordRules.uppercase"),
      test: (p: string) => /[A-Z]/.test(p),
    },
    { label: t("passwordRules.number"), test: (p: string) => /[0-9]/.test(p) },
  ];

  const { register: registerUser, verifyOtp, resendOtp } = useAuth();
  const router = useRouter();

  const signupSchema = createSignupSchema(t);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  const passwordValue = watch("password", "");

  // ── Step 1: Register ────────────────────────────────────────────────────────
  const onSubmit = async (values: SignupFormValues) => {
    try {
      setServerError("");
      const data = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone || undefined,
      });
      if (data.requires_otp) {
        setRegisteredEmail(data.email);
        setVerificationToken(data.verification_token);
        setStep("otp");
      }
    } catch (err) {
      setServerError(getApiErrorMessage(err));
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
      await verifyOtp(registeredEmail, otp, verificationToken);
      router.push(`/${locale}/auth/login`);
    } catch (err) {
      setOtpError(getApiErrorMessage(err));
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!registeredEmail || !verificationToken) return;

    try {
      setOtpError("");
      setResendLoading(true);
      const data = await resendOtp(registeredEmail, verificationToken);
      setVerificationToken(data.verification_token);
    } catch (err) {
      setOtpError(getApiErrorMessage(err));
    } finally {
      setResendLoading(false);
    }
  };

  // ── OTP Step UI ─────────────────────────────────────────────────────────────
  if (step === "otp") {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#e8f4ff] flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-[#0067b8]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0f172a] mb-2">
            {tOtp("title")}
          </h1>
          <p className="text-sm text-[#64748b] mb-1">{tOtp("subtitle")}</p>
          <p
            className="text-sm font-semibold text-[#0067b8] mb-6 break-all"
            dir="ltr"
          >
            {registeredEmail}
          </p>

          <OtpInput value={otpDigits} onChange={setOtpDigits} />

          {otpError && <p className="mt-3 text-sm text-red-500">{otpError}</p>}

          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={otpLoading || otpDigits.join("").length < 4}
            className="w-full flex items-center justify-center gap-2 bg-[#0067b8] hover:bg-[#004a86] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-[#0067b8]/30 mt-6"
          >
            {otpLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {tOtp("verifying")}
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                {tOtp("confirm")}
              </>
            )}
          </button>

          <div className="mt-4 flex items-center justify-center gap-4 text-sm">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendLoading || !verificationToken}
              className="text-[#0067b8] hover:text-[#004a86] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {resendLoading ? t("creatingAccount") : tOtp("resend")}
            </button>

            <Link
              href={`/${locale}/auth/login`}
              className="text-[#64748b] hover:text-[#0067b8] transition-colors"
            >
              {t("loginLink")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-[#0f172a] mb-2">
            {t("title")}
          </h1>
          <p className="text-sm text-[#64748b]">{t("subtitle")}</p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center">
            {" "}
            {serverError}{" "}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <LabelDir labeltitle={t("name")} />

            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <input
                type="text"
                placeholder={t("namePlaceholder")}
                className={`w-full pr-10 pl-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  errors.name
                    ? "border-red-400 focus:ring-2 focus:ring-red-200"
                    : "border-[#e2e8f0] focus:border-[#0067b8] focus:ring-2 focus:ring-[#0067b8]/20"
                }`}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <LabelDir labeltitle={t("email")} />
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <input
                type="email"
                placeholder="example@email.com"
                dir="ltr"
                className={`w-full pr-10 pl-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${errors.email ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-[#e2e8f0] focus:border-[#0067b8] focus:ring-2 focus:ring-[#0067b8]/20"}`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <LabelDir labeltitle={t("phone")} />
            <span className="text-[#94a3b8] font-normal">{t("optional")}</span>

            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <input
                type="tel"
                placeholder="01012345678"
                dir="ltr"
                className={`w-full pr-10 pl-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  errors.phone
                    ? "border-red-400 focus:ring-2 focus:ring-red-200"
                    : "border-[#e2e8f0] focus:border-[#0067b8] focus:ring-2 focus:ring-[#0067b8]/20"
                }`}
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <LabelDir labeltitle={t("password")} />

            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pr-10 pl-10 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  errors.password
                    ? "border-red-400 focus:ring-2 focus:ring-red-200"
                    : "border-[#e2e8f0] focus:border-[#0067b8] focus:ring-2 focus:ring-[#0067b8]/20"
                }`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]"
                aria-label="toggle password"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
            {passwordValue && (
              <div className="mt-2 flex flex-wrap gap-2">
                {passwordRules.map((rule) => (
                  <span
                    key={rule.label}
                    className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-colors ${
                      rule.test(passwordValue)
                        ? "bg-green-100 text-green-700"
                        : "bg-[#f1f5f9] text-[#94a3b8]"
                    }`}
                  >
                    <CheckCircle className="w-3 h-3" />
                    {rule.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <LabelDir labeltitle={t("confirmPassword")} />

            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pr-10 pl-10 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  errors.confirmPassword
                    ? "border-red-400 focus:ring-2 focus:ring-red-200"
                    : "border-[#e2e8f0] focus:border-[#0067b8] focus:ring-2 focus:ring-[#0067b8]/20"
                }`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]"
                aria-label="toggle confirm password"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-[#0067b8] hover:bg-[#004a86] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-[#0067b8]/30 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("creatingAccount")}
              </>
            ) : (
              t("createAccount")
            )}
          </button>
        </form>

        <p className="text-center text-sm text-[#64748b] mt-6">
          {t("hasAccount")}{" "}
          <Link
            href={`/${locale}/auth/login`}
            className="text-[#0067b8] font-semibold hover:underline"
          >
            {t("loginLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
