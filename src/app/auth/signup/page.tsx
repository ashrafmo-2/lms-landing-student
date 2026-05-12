"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const signupSchema = z
    .object({
        name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
        email: z.string().email("البريد الإلكتروني غير صحيح"),
        phone: z
            .string()
            .regex(/^01[0-9]{9}$/, "رقم الهاتف غير صحيح (مثال: 01012345678)")
            .optional()
            .or(z.literal("")),
        password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "كلمتا المرور غير متطابقتين",
        path: ["confirmPassword"],
    });

type SignupFormValues = z.infer<typeof signupSchema>;

const passwordRules = [
    { label: "8 أحرف على الأقل", test: (p: string) => p.length >= 8 },
    { label: "حرف كبير", test: (p: string) => /[A-Z]/.test(p) },
    { label: "رقم", test: (p: string) => /[0-9]/.test(p) },
];

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [serverError, setServerError] = useState("");
    const { signup } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    });

    const passwordValue = watch("password", "");

    const onSubmit = async (values: SignupFormValues) => {
        try {
            setServerError("");
            await signup(values.name, values.email, values.password, values.phone || undefined);
            router.push("/dashboard/products");
        } catch {
            setServerError("حدث خطأ أثناء إنشاء الحساب، حاول مرة أخرى");
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-8">
                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-extrabold text-[#0f172a] mb-2">
                        أنشئ حسابك الآن 🚀
                    </h1>
                    <p className="text-sm text-[#64748b]">
                        انضم لآلاف الطلاب وابدأ رحلتك التعليمية
                    </p>
                </div>

                {/* Server Error */}
                {serverError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                            الاسم الكامل
                        </label>
                        <div className="relative">
                            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                            <input
                                type="text"
                                placeholder="أحمد محمد"
                                className={`w-full pr-10 pl-4 py-2.5 rounded-xl border text-sm outline-none transition-all
                  ${errors.name
                                        ? "border-red-400 focus:ring-2 focus:ring-red-200"
                                        : "border-[#e2e8f0] focus:border-[#6c3aff] focus:ring-2 focus:ring-[#6c3aff]/20"
                                    }`}
                                {...register("name")}
                            />
                        </div>
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                            البريد الإلكتروني
                        </label>
                        <div className="relative">
                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                            <input
                                type="email"
                                placeholder="example@email.com"
                                dir="ltr"
                                className={`w-full pr-10 pl-4 py-2.5 rounded-xl border text-sm outline-none transition-all
                  ${errors.email
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

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                            رقم الهاتف{" "}
                            <span className="text-[#94a3b8] font-normal">(اختياري)</span>
                        </label>
                        <div className="relative">
                            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                            <input
                                type="tel"
                                placeholder="01012345678"
                                dir="ltr"
                                className={`w-full pr-10 pl-4 py-2.5 rounded-xl border text-sm outline-none transition-all
                  ${errors.phone
                                        ? "border-red-400 focus:ring-2 focus:ring-red-200"
                                        : "border-[#e2e8f0] focus:border-[#6c3aff] focus:ring-2 focus:ring-[#6c3aff]/20"
                                    }`}
                                {...register("phone")}
                            />
                        </div>
                        {errors.phone && (
                            <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                            كلمة المرور
                        </label>
                        <div className="relative">
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className={`w-full pr-10 pl-10 py-2.5 rounded-xl border text-sm outline-none transition-all
                  ${errors.password
                                        ? "border-red-400 focus:ring-2 focus:ring-red-200"
                                        : "border-[#e2e8f0] focus:border-[#6c3aff] focus:ring-2 focus:ring-[#6c3aff]/20"
                                    }`}
                                {...register("password")}
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
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                        )}

                        {/* Password strength indicators */}
                        {passwordValue && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {passwordRules.map((rule) => (
                                    <span
                                        key={rule.label}
                                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-colors ${rule.test(passwordValue)
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

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                            تأكيد كلمة المرور
                        </label>
                        <div className="relative">
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="••••••••"
                                className={`w-full pr-10 pl-10 py-2.5 rounded-xl border text-sm outline-none transition-all
                  ${errors.confirmPassword
                                        ? "border-red-400 focus:ring-2 focus:ring-red-200"
                                        : "border-[#e2e8f0] focus:border-[#6c3aff] focus:ring-2 focus:ring-[#6c3aff]/20"
                                    }`}
                                {...register("confirmPassword")}
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
                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 bg-[#6c3aff] hover:bg-[#5228e8] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-[#6c3aff]/30 mt-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                جاري إنشاء الحساب...
                            </>
                        ) : (
                            "إنشاء الحساب"
                        )}
                    </button>
                </form>

                {/* Login link */}
                <p className="text-center text-sm text-[#64748b] mt-6">
                    عندك حساب بالفعل؟{" "}
                    <Link
                        href="/auth/login"
                        className="text-[#6c3aff] font-semibold hover:underline"
                    >
                        سجل دخولك
                    </Link>
                </p>
            </div>
        </div>
    );
}
