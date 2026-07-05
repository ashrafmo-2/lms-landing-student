"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/contexts/auth-context";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { LabelDir } from "@/shared/ui/Label-dir";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

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

export default function LoginPage() {
  const t = useTranslations("Auth.login");
  const tOtp = useTranslations("Auth.otp");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [notice, setNotice] = useState("");
  const [step, setStep] = useState<"login" | "otp">("login");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { login, verifyOtp, resendOtp } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const locale = useLocale();

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setServerError("");
      setNotice("");
      const data = await login(values.email, values.password);

      if (data.requires_otp && data.email && data.verification_token) {
        setVerificationEmail(data.email);
        setVerificationToken(data.verification_token);
        setNotice(data.message || tOtp("subtitle"));
        setStep("otp");
        return;
      }

      router.push(`/${locale}/`);
    } catch (err) {
      setServerError(getApiErrorMessage(err));
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpDigits.join("");
    if (otp.length < 4) {
      setOtpError(tOtp("error"));
      return;
    }

    try {
      setOtpError("");
      setOtpLoading(true);
      await verifyOtp(verificationEmail, otp, verificationToken);
      setStep("login");
      setOtpDigits(["", "", "", ""]);
      setNotice(t("verifiedLoginAgain"));
    } catch (err) {
      setOtpError(getApiErrorMessage(err));
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!verificationEmail || !verificationToken) return;

    try {
      setOtpError("");
      setResendLoading(true);
      const data = await resendOtp(verificationEmail, verificationToken);
      setVerificationToken(data.verification_token);
      setNotice(t("otpSent"));
    } catch (err) {
      setOtpError(getApiErrorMessage(err));
    } finally {
      setResendLoading(false);
    }
  };

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
          <p className="text-sm text-[#64748b] mb-1">
            {notice || t("otpSent")}
          </p>
          <p
            className="text-sm font-semibold text-[#0067b8] mb-6 break-all"
            dir="ltr"
          >
            {verificationEmail}
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
              {resendLoading ? t("loggingIn") : tOtp("resend")}
            </button>

            <button
              type="button"
              onClick={() => setStep("login")}
              className="text-[#64748b] hover:text-[#0067b8] transition-colors"
            >
              {t("loginButton")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-[#0f172a] mb-2">
            {t("title")}
          </h1>
          <p className="text-sm text-[#64748b]">{t("subtitle")}</p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center">
            {serverError}
          </div>
        )}

        {notice && !serverError && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 text-center">
            {notice}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <LabelDir labeltitle={t("email")} />
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                dir="ltr"
                className={`w-full pr-10 pl-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  errors.email
                    ? "border-red-400 focus:ring-2 focus:ring-red-200"
                    : "border-[#e2e8f0] focus:border-[#0067b8] focus:ring-2 focus:ring-[#0067b8]/20"
                }`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <LabelDir labeltitle={t("password")} />
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("passwordPlaceholder")}
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
                aria-label="toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <Link
              href={`/${locale}/auth/forgot-password`}
              className="text-xs text-[#0067b8] underline"
            >
              {t("forgotPassword")}
            </Link>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-[#0067b8] hover:bg-[#004a86] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-[#0067b8]/30"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("loggingIn")}
              </>
            ) : (
              t("loginButton")
            )}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#e2e8f0]" />
          <span className="text-xs text-[#94a3b8]">{t("or")}</span>
          <div className="flex-1 h-px bg-[#e2e8f0]" />
        </div>

        <p className="text-center text-sm text-[#64748b]">
          {t("noAccount")}{" "}
          <Link
            href={`/${locale}/auth/signup`}
            className="text-[#0067b8] font-semibold hover:underline"
          >
            {t("signupLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
