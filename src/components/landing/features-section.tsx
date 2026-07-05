import {
  Download,
  Gauge,
  MessageCircle,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";

export function FeaturesSection() {
  const t = useTranslations("Landing.features");

  const features = [
    {
      icon: Download,
      label: "01",
      accent: "bg-[#0067b8]",
      title: t("offline.title"),
      description: t("offline.description"),
    },
    {
      icon: MessageCircle,
      label: "02",
      accent: "bg-[#00a6a6]",
      title: t("directContact.title"),
      description: t("directContact.description"),
    },
    {
      icon: Trophy,
      label: "03",
      accent: "bg-[#ffb000]",
      title: t("ranking.title"),
      description: t("ranking.description"),
    },
    {
      icon: ShieldCheck,
      label: "04",
      accent: "bg-[#101827]",
      title: t("security.title"),
      description: t("security.description"),
    },
  ];

  return (
    <section id="features" className="relative bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div data-reveal="left">
            <div className="section-kicker mb-4">
              <Gauge className="h-3.5 w-3.5" />
              {t("title").split(" ").slice(0, 3).join(" ")}
            </div>
            <h2 className="text-4xl font-black leading-tight text-[#101827] md:text-5xl">
              {t("title")}
            </h2>
          </div>

          <p
            className="max-w-3xl text-lg leading-8 text-[#5d6b7d] lg:justify-self-end"
            data-reveal="right"
          >
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 border-y border-[#d9e3ee] md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className={`group min-h-[300px] border-[#d9e3ee] bg-white p-6 transition-all duration-300 hover:bg-[#f8fbfd] ${
                  index > 0 ? "lg:border-s" : ""
                } ${index % 2 === 1 ? "md:border-s lg:border-s" : ""} ${
                  index > 1 ? "border-t lg:border-t-0" : ""
                }`}
                data-reveal="scale"
                style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center text-white ${feature.accent}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-black text-[#b5c2cf]">
                    {feature.label}
                  </span>
                </div>

                <h3 className="mt-12 text-xl font-black leading-tight text-[#101827]">
                  {feature.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#5d6b7d]">
                  {feature.description}
                </p>
                <div className="mt-8 h-1 w-10 bg-[#d9e3ee] transition-all duration-300 group-hover:w-20 group-hover:bg-[#0067b8]" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
