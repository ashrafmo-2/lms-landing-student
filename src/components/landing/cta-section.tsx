import { ArrowUpRight, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/shared/i18n/routing";

export function CTASection() {
  const t = useTranslations("Landing.cta");

  return (
    <section className="relative overflow-hidden bg-[#f3f7fb] py-24">
      <div className="absolute inset-0 surface-grid opacity-70" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="grid gap-8 border border-[#d9e3ee] bg-white p-6 shadow-[0_28px_90px_rgba(16,24,39,0.12)] md:grid-cols-[0.72fr_1.28fr] md:items-center md:p-10"
          data-reveal="scale"
        >
          <div className="flex h-full min-h-56 items-center justify-center bg-[#101827] text-white">
            <div className="text-center">
              <Trophy className="mx-auto h-16 w-16 text-[#ffb000]" />
              <div className="mt-5 flex justify-center gap-2">
                <span className="h-2 w-10 bg-[#0067b8]" />
                <span className="h-2 w-10 bg-[#00a6a6]" />
                <span className="h-2 w-10 bg-[#ffb000]" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="max-w-3xl text-4xl font-black leading-tight text-[#101827] md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5d6b7d]">
              {t("subtitle")}
            </p>
            <Link
              href="/auth/signup"
              className="focus-ring group mt-8 inline-flex items-center gap-2 bg-[#0067b8] px-6 py-3 text-sm font-black text-white shadow-[0_18px_38px_rgba(0,103,184,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#004a86]"
            >
              {t("button")}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:rotate-[-90deg]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
