import Link from "next/link";
import { UserPlus, CreditCard, Rocket } from "lucide-react";

const steps = [
    {
        number: "1",
        icon: UserPlus,
        color: "bg-[#ede9ff] text-[#6c3aff]",
        borderColor: "border-[#6c3aff]",
        title: "سجل حسابك",
        description:
            "أنشئ حسابك الجديد، واربطه بجهازك المفضل لضمان الخصوصية وسرعة الدخول في المرات القادمة.",
    },
    {
        number: "2",
        icon: CreditCard,
        color: "bg-[#fff7ed] text-[#f97316]",
        borderColor: "border-[#f97316]",
        title: "اختر واشترك",
        description:
            "تصفح الكورسات المتاحة، ادفع إلكترونياً بسهولة وأمان، ليتم تفعيل الكورس في حسابك فوراً.",
    },
    {
        number: "3",
        icon: Rocket,
        color: "bg-[#ecfdf5] text-[#22c55e]",
        borderColor: "border-[#22c55e]",
        title: "ابدأ التعلم والمنافسة",
        description:
            "شاهد المحاضرات، حل الامتحانات، تابع البار الخاص بتقدمك، ونافس على قمة الترتيب!",
    },
];

export function HowItWorksSection() {
    return (
        <section
            id="how-it-works"
            className="py-24 bg-gradient-to-br from-[#f5f3ff] to-[#ede9ff]"
            dir="rtl"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mb-4">
                        رحلتك معانا أسهل مما تتخيل
                    </h2>
                    <p className="text-lg text-[#64748b]">
                        ٣ خطوات بس تفصلك عن بدء تجربة تعليمية مختلفة.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connector line (desktop) */}
                    <div className="hidden md:block absolute top-12 right-[16.5%] left-[16.5%] h-0.5 bg-gradient-to-l from-[#22c55e] via-[#f97316] to-[#6c3aff]" />

                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="relative flex flex-col items-center text-center">
                                {/* Number circle */}
                                <div
                                    className={`relative z-10 w-24 h-24 rounded-full bg-white border-4 ${step.borderColor} flex flex-col items-center justify-center mb-6 shadow-lg`}
                                >
                                    <span className="text-2xl font-extrabold text-[#0f172a]">
                                        {step.number}
                                    </span>
                                </div>

                                {/* Card */}
                                <div className="bg-white rounded-2xl p-6 shadow-md border border-[#e2e8f0] w-full">
                                    <div
                                        className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center mx-auto mb-3`}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#0f172a] mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-[#64748b] leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <Link
                        href="/auth/signup"
                        className="inline-flex items-center gap-2 bg-[#6c3aff] hover:bg-[#5228e8] text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-[#6c3aff]/30 hover:-translate-y-0.5 text-base"
                    >
                        ابدأ رحلتك الآن
                        <Rocket className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
