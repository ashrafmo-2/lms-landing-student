import { Link } from "@/shared/i18n/routing";
import { Trophy } from "lucide-react";
import { useTranslations } from "next-intl";

export function CTASection() {
    const t = useTranslations("Landing.cta");

    return (
        <section className="py-24 bg-gradient-to-br from-[#6c3aff] to-[#5228e8] relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-32 h-32 border-4 border-white rounded-full" />
                <div className="absolute bottom-10 left-10 w-40 h-40 border-4 border-white rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-white rounded-full" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <Trophy className="w-16 h-16 text-white mx-auto mb-6" />
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                    {t("title")}
                </h2>
                <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                    {t("subtitle")}
                </p>
                <Link
                    href="/auth/signup"
                    className="inline-flex items-center gap-2 bg-white text-[#6c3aff] hover:bg-[#f8fafc] font-bold px-8 py-4 rounded-xl transition-all shadow-xl hover:-translate-y-0.5 text-base"
                >
                    {t("button")}
                </Link>
            </div>
        </section>
    );
}

