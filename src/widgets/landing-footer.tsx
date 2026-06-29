import { GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/shared/i18n/routing";

export function Footer() {
  const t = useTranslations("Landing.footer");
  const tNav = useTranslations("Landing.navbar");
  const tCommon = useTranslations("Common");

  return (
    <footer className="bg-[#0f172a] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#6c3aff] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">{tCommon("brandName")}</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              {t("description")}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-base mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/#hero" className="hover:text-white transition-colors">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/#modules" className="hover:text-white transition-colors">
                  {tNav("courses")}
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  {tNav("features")}
                </Link>
              </li>
              <li>
                <Link href="/workshops" className="hover:text-white transition-colors">
                  Workshops
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-white transition-colors">
                  {tNav("contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base mb-4">{t("support")}</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/auth/login" className="hover:text-white transition-colors">
                  {t("faq")}
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-white transition-colors">
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-white transition-colors">
                  {t("privacy")}
                </Link>
              </li>
            </ul>
          </div>

          <div />
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-sm text-white/60">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
