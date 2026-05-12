"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Loader2, ArrowRight, CheckCircle } from "lucide-react";

const forgotSchema = z.object({
    email: z.string().email("البريد الإلكتروني غير صحيح"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
    const [isSuccess, setIsSuccess] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotFormValues>({
        resolver: zodResolver(forgotSchema),
    });

    const onSubmit = async (values: ForgotFormValues) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSubmittedEmail(values.email);
        setIsSuccess(true);
    };

    if (isSuccess) {
        return (
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-8 text-center">
                    {/* Success Icon */}
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>

                    <h1 className="text-2xl font-extrabold text-[#0f172a] mb-3">
                        تم الإرسال! ✅
                    </h1>
                    <p className="text-sm text-[#64748b] mb-2">
                        لو البريد الإلكتروني مسجل عندنا، هيوصلك رابط لإعادة تعيين كلمة المرور على:
                    </p>
                    <p className="text-sm font-semibold text-[#6c3aff] mb-6 break-all" dir="ltr">
                        {submittedEmail}
                    </p>

                    <div className="bg-[#f8fafc] rounded-xl p-4 text-sm text-[#64748b] mb-6 text-right">
                        <p className="font-semibold text-[#0f172a] mb-1">لم يصلك الإيميل؟</p>
                        <ul className="space-y-1 list-disc list-inside">
                            <li>تحقق من مجلد الـ Spam</li>
                            <li>تأكد من صحة البريد الإلكتروني</li>
                            <li>انتظر بضع دقائق وحاول مرة أخرى</li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setIsSuccess(false)}
                            className="w-full text-sm font-semibold text-[#6c3aff] border border-[#6c3aff] py-2.5 rounded-xl hover:bg-[#ede9ff] transition-colors"
                        >
                            إعادة الإرسال
                        </button>
                        <Link
                            href="/auth/login"
                            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#64748b] hover:text-[#0f172a] transition-colors"
                        >
                            <ArrowRight className="w-4 h-4" />
                            العودة لتسجيل الدخول
                        </Link>
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
                    <div className="w-16 h-16 rounded-full bg-[#ede9ff] flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-[#6c3aff]" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-[#0f172a] mb-2">
                        نسيت كلمة المرور؟
                    </h1>
                    <p className="text-sm text-[#64748b]">
                        ادخل بريدك الإلكتروني وهنبعتلك رابط لإعادة تعيين كلمة المرور.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 bg-[#6c3aff] hover:bg-[#5228e8] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-[#6c3aff]/30"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                جاري الإرسال...
                            </>
                        ) : (
                            "إرسال رابط الاستعادة"
                        )}
                    </button>
                </form>

                {/* Back to login */}
                <div className="mt-6 text-center">
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-2 text-sm text-[#64748b] hover:text-[#6c3aff] transition-colors"
                    >
                        <ArrowRight className="w-4 h-4" />
                        العودة لتسجيل الدخول
                    </Link>
                </div>
            </div>
        </div>
    );
}
