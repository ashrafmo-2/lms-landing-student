import { Download, MessageCircle, Trophy, Shield } from "lucide-react";
import { useTranslations } from "next-intl";

export function FeaturesSection() {
    const t = useTranslations("Landing.features");

    const features = [
        {
            icon: Download,
            color: "bg-[#ede9ff] text-[#6c3aff]",
            title: t("offline.title"),
            description: t("offline.description"),
        },
        {
            icon: MessageCircle,
            color: "bg-[#fff7ed] text-[#f97316]",
            title: t("directContact.title"),
            description: t("directContact.description"),
        },
        {
            icon: Trophy,
            color: "bg-[#ecfdf5] text-[#22c55e]",
            title: t("ranking.title"),
            description: t("ranking.description"),
        },
        {
            icon: Shield,
            color: "bg-[#eff6ff] text-[#3b82f6]",
            title: t("security.title"),
            description: t("security.description"),
        },
    ];

    return (
        <section id="features" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mb-4">
                        {t("title")}
                    </h2>
                    <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="group bg-white border border-[#e2e8f0] rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div
                                    className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}
                                >
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-[#0f172a] mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-[#64748b] leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

