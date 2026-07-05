import {
  ArrowUpRight,
  CreditCard,
  Rocket,
  Route,
  UserPlus,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { Link } from "@/shared/i18n/routing";

export function HowItWorksSection() {
  const t = useTranslations("Landing.howItWorks");

  const steps = [
    {
      number: "01",
      icon: UserPlus,
      tone: "bg-[#0067b8]",
      title: t("step1.title"),
      description: t("step1.description"),
    },
    {
      number: "02",
      icon: CreditCard,
      tone: "bg-[#00a6a6]",
      title: t("step2.title"),
      description: t("step2.description"),
    },
    {
      number: "03",
      icon: Rocket,
      tone: "bg-[#ffb000]",
      title: t("step3.title"),
      description: t("step3.description"),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="surface-grid relative border-y border-[#d9e3ee] bg-[#f3f7fb] py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center" data-reveal="scale">
          <div className="section-kicker mb-4">
            <Route className="h-3.5 w-3.5" />
            {t("subtitle")}
          </div>
          <h2 className="text-4xl font-black leading-tight text-[#101827] md:text-5xl">
            {t("title")}
          </h2>
        </div>

        <div className="relative mt-16 grid gap-5 lg:grid-cols-3">
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-linear-to-r from-[#0067b8] via-[#00a6a6] to-[#ffb000] lg:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article
                key={step.number}
                className="relative border border-[#d9e3ee] bg-white p-6 shadow-[0_22px_60px_rgba(16,24,39,0.08)]"
                data-reveal="scale"
                style={
                  { "--reveal-delay": `${index * 120}ms` } as CSSProperties
                }
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-16 w-16 items-center justify-center text-white ${step.tone}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="text-5xl font-black text-[#e2ebf4]">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-10 text-2xl font-black text-[#101827]">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#5d6b7d]">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-12 text-center" data-reveal>
          <Link
            href="/auth/signup"
            className="focus-ring group inline-flex items-center gap-2 bg-[#0067b8] px-6 py-3 text-sm font-black text-white shadow-[0_18px_38px_rgba(0,103,184,0.26)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#004a86]"
          >
            {t("cta")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:rotate-[-90deg]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
