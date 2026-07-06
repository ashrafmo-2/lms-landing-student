"use client";

import { StudentAuthenticatedGuard } from "@/features/auth/components/student-authenticated-guard";
import {
    getWorkshopPaymentStatus,
    submitWorkshopPaymentRequest,
} from "@/entities/workshops/api";
import type { PaymentMethod, WorkshopPaymentStatus } from "@/entities/workshops/api";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { Footer } from "@/widgets/landing-footer";
import { Navbar } from "@/widgets/landing-navbar";
import { CheckCircle2, Clipboard, FileText, Loader2, UploadCloud, XCircle } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

const paymentMethods: PaymentMethod[] = ["Vodafone Cash", "InstaPay", "Bank Transfer"];

function PaymentPageContent() {
    const { workshopSlug } = useParams<{ workshopSlug: string }>();
    const locale = useLocale();
    const router = useRouter();
    const isAr = locale === "ar";
    const [status, setStatus] = useState<WorkshopPaymentStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState("");

    useEffect(() => {
        let mounted = true;
        if (!workshopSlug) return;

        getWorkshopPaymentStatus(workshopSlug)
            .then((data) => {
                if (!mounted) return;
                if (data.isEnrolled && !data.paymentRequest) {
                    router.replace(`/${locale}/dashboard/workshops/${data.workshop.workshopId}`);
                    return;
                }
                setStatus(data);
            })
            .catch((err) => setError(getApiErrorMessage(err)))
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [workshopSlug, locale, router]);

    const copyText = async (key: string, value: string) => {
        await navigator.clipboard.writeText(value);
        setCopied(key);
        window.setTimeout(() => setCopied(""), 1600);
    };

    const refresh = async () => {
        if (!workshopSlug) return;
        const data = await getWorkshopPaymentStatus(workshopSlug);
        setStatus(data);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!workshopSlug) return;

        const form = event.currentTarget;
        const formData = new FormData(form);
        const file = formData.get("receiptFile");

        if (!(file instanceof File) || file.size === 0) {
            setError(isAr ? "ارفع صورة أو ملف الإيصال." : "Please upload the receipt file.");
            return;
        }

        try {
            setError("");
            setSubmitting(true);
            await submitWorkshopPaymentRequest(workshopSlug, formData);
            form.reset();
            await refresh();
        } catch (err) {
            setError(getApiErrorMessage(err));
            await refresh().catch(() => undefined);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 pt-32 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#0067b8]" />
            </main>
        );
    }

    if (!status) {
        return (
            <main className="min-h-screen bg-slate-50 pt-32 text-center text-red-600">
                {error || (isAr ? "تعذر تحميل بيانات الدفع." : "Could not load payment details.")}
            </main>
        );
    }

    const request = status.paymentRequest;
    const showForm = !request || request.status === "REJECTED";

    return (
        <main className="min-h-screen bg-slate-50 text-slate-950" dir={isAr ? "rtl" : "ltr"}>
            <Navbar />
            <section className="pt-28 pb-16">
                <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
                    <aside className="rounded-2xl bg-white p-6 shadow-sm">
                        <p className="text-sm font-bold text-slate-500">{isAr ? "دفع الورشة" : "Workshop payment"}</p>
                        <h1 className="mt-3 text-3xl font-black">{status.workshop.title}</h1>
                        <div className="mt-6 rounded-xl bg-[#e8f4ff] p-4">
                            <p className="text-sm font-bold text-slate-600">{isAr ? "السعر" : "Price"}</p>
                            <p className="mt-1 text-3xl font-black text-[#0067b8]">{status.amount.toLocaleString("ar-EG")} {isAr ? "جنيه" : "EGP"}</p>
                        </div>

                        <div className="mt-6 space-y-3">
                            <PaymentCopyRow label="Vodafone Cash" value={status.paymentDetails.vodafoneCashNumber} copied={copied === "vodafone"} onCopy={() => copyText("vodafone", status.paymentDetails.vodafoneCashNumber)} />
                            <PaymentCopyRow label="InstaPay" value={status.paymentDetails.instapayAccount} copied={copied === "instapay"} onCopy={() => copyText("instapay", status.paymentDetails.instapayAccount)} />
                            <PaymentCopyRow label={isAr ? "حساب البنك" : "Bank account"} value={status.paymentDetails.bankAccountDetails} copied={copied === "bank"} onCopy={() => copyText("bank", status.paymentDetails.bankAccountDetails)} />
                        </div>

                        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-7 text-amber-900">
                            بعد التحويل، ارفع صورة الإيصال وسيتم مراجعتها وتفعيل حسابك بعد الموافقة.
                        </div>
                    </aside>

                    <section className="rounded-2xl bg-white p-6 shadow-sm">
                        {request?.status === "PENDING" ? <PendingState request={request} /> : null}
                        {request?.status === "APPROVED" ? <ApprovedState workshopId={status.workshop.workshopId} locale={locale} /> : null}
                        {request?.status === "REJECTED" ? <RejectedState reason={request.rejectionReason} /> : null}

                        {showForm ? (
                            <form onSubmit={handleSubmit} className="mt-2 space-y-5">
                                <div>
                                    <label className="text-sm font-bold text-slate-700" htmlFor="paymentMethod">{isAr ? "طريقة الدفع" : "Payment method"}</label>
                                    <select id="paymentMethod" name="paymentMethod" required className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0067b8]">
                                        {paymentMethods.map((method) => <option key={method} value={method}>{method}</option>)}
                                    </select>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <Field label={isAr ? "رقم المرسل" : "Sender phone"} name="senderPhone" required />
                                    <Field label={isAr ? "اسم المرسل اختياري" : "Sender name optional"} name="senderName" />
                                </div>

                                <Field label={isAr ? "رقم العملية اختياري" : "Transaction ref optional"} name="transactionRef" />

                                <div>
                                    <label className="text-sm font-bold text-slate-700" htmlFor="receiptFile">{isAr ? "إثبات الدفع" : "Receipt file"}</label>
                                    <label className="mt-2 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 text-center text-sm font-bold text-slate-600">
                                        <UploadCloud className="mb-2 h-8 w-8 text-[#0067b8]" />
                                        {isAr ? "ارفع صورة أو PDF" : "Upload image or PDF"}
                                        <span className="mt-1 text-xs text-slate-400">jpg, jpeg, png, pdf</span>
                                        <input id="receiptFile" name="receiptFile" type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" required className="sr-only" />
                                    </label>
                                </div>

                                {error ? <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}

                                <button type="submit" disabled={submitting} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0067b8] px-6 text-sm font-black text-white transition hover:bg-[#004a86] disabled:cursor-not-allowed disabled:opacity-70">
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                    {isAr ? "تم الدفع" : "Paid"}
                                </button>
                            </form>
                        ) : null}
                    </section>
                </div>
            </section>
            <Footer />
        </main>
    );
}

export default function PaymentPage() {
    return (
        <StudentAuthenticatedGuard>
            <PaymentPageContent />
        </StudentAuthenticatedGuard>
    );
}

function PaymentCopyRow({ label, value, copied, onCopy }: { label: string; value: string; copied: boolean; onCopy: () => void }) {
    return (
        <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-500">{label}</p>
                    <p className="mt-1 break-words text-sm font-black text-slate-900" dir="ltr">{value}</p>
                </div>
                <button type="button" onClick={onCopy} className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-black text-[#0067b8] hover:bg-slate-50">
                    <Clipboard className="h-4 w-4" />
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
        </div>
    );
}

function Field({ label, name, required = false }: { label: string; name: string; required?: boolean }) {
    return (
        <div>
            <label className="text-sm font-bold text-slate-700" htmlFor={name}>{label}</label>
            <input id={name} name={name} required={required} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0067b8]" />
        </div>
    );
}

function PendingState({ request }: { request: NonNullable<WorkshopPaymentStatus["paymentRequest"]> }) {
    return (
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sky-900">
            <div className="flex items-center gap-2 font-black"><FileText className="h-5 w-5" />تم استلام إثبات الدفع، طلبك قيد المراجعة.</div>
            <div className="mt-3 grid gap-2 text-sm font-bold md:grid-cols-2">
                <p>طريقة الدفع: {request.paymentMethod}</p>
                <p>رقم المرسل: {request.senderPhone}</p>
                {request.senderName ? <p>اسم المرسل: {request.senderName}</p> : null}
                {request.transactionRef ? <p>رقم العملية: {request.transactionRef}</p> : null}
            </div>
        </div>
    );
}

function RejectedState({ reason }: { reason?: string | null }) {
    return (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            <div className="flex items-center gap-2 font-black"><XCircle className="h-5 w-5" />تم رفض إثبات الدفع</div>
            {reason ? <p className="mt-2 text-sm font-bold">السبب: {reason}</p> : null}
            <p className="mt-2 text-sm font-bold">يمكنك رفع إيصال جديد وسيعود الطلب إلى قيد المراجعة.</p>
        </div>
    );
}

function ApprovedState({ workshopId, locale }: { workshopId: number; locale: string }) {
    return (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
            <div className="flex items-center gap-2 font-black"><CheckCircle2 className="h-5 w-5" />تم تفعيل اشتراكك</div>
            <Link href={`/${locale}/dashboard/workshops/${workshopId}`} className="mt-4 inline-flex rounded-xl bg-green-700 px-5 py-3 text-sm font-black text-white hover:bg-green-800">
                دخول الورشة
            </Link>
        </div>
    );
}
