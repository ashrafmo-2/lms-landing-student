"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { LabelDir } from "@/shared/ui/Label-dir";

const loginSchema = z.object({
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const t = useTranslations("Auth.login");
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState("");
    const { login } = useAuth();
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
            await login(values.email, values.password);
            router.push(`/${locale}/dashboard`);
        } catch (err) {
            setServerError(getApiErrorMessage(err));
        }
    };

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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <LabelDir labeltitle={t("email")} />
                        <div className="relative">
                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                            <input
                                type="email"
                                placeholder={t("emailPlaceholder")}
                                dir="ltr"
                                className={`w-full pr-10 pl-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${errors.email
                                    ? "border-red-400 focus:ring-2 focus:ring-red-200"
                                    : "border-[#e2e8f0] focus:border-[#6c3aff] focus:ring-2 focus:ring-[#6c3aff]/20"
                                    }`}
                                {...register("email")}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
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
                                className={`w-full pr-10 pl-10 py-2.5 rounded-xl border text-sm outline-none transition-all ${errors.password
                                    ? "border-red-400 focus:ring-2 focus:ring-red-200"
                                    : "border-[#e2e8f0] focus:border-[#6c3aff] focus:ring-2 focus:ring-[#6c3aff]/20"
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
                            className="text-xs text-[#6c3aff] underline"
                        >
                            {t("forgotPassword")}
                        </Link>
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 bg-[#6c3aff] hover:bg-[#5228e8] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-[#6c3aff]/30"
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
                    <Link href={`/${locale}/auth/signup`} className="text-[#6c3aff] font-semibold hover:underline">
                        {t("signupLink")}
                    </Link>
                </p>
            </div>
        </div>
    );
}

