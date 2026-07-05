import { GraduationCap, Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/shared/i18n/routing";

export function Footer() {
  const t = useTranslations("Landing.footer");
  const tNav = useTranslations("Landing.navbar");
  const tCommon = useTranslations("Common");

  return (
    <footer className="border-t border-white/10 bg-[#101827] py-14 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.25fr_0.75fr_0.75fr_0.9fr]">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-[#0067b8]">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black">{tCommon("brandName")}</span>
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/66">
              {t("description")}
            </p>
            <div className="mt-6 flex gap-2">
              <span className="h-1.5 w-10 bg-[#0067b8]" />
              <span className="h-1.5 w-10 bg-[#00a6a6]" />
              <span className="h-1.5 w-10 bg-[#ffb000]" />
            </div>
          </div>

          <FooterColumn
            title={t("quickLinks")}
            links={[
              { href: "/#hero", label: t("home") },
              { href: "/#modules", label: tNav("courses") },
              { href: "/#features", label: tNav("features") },
              { href: "/workshops", label: "Workshops" },
              { href: "/#contact", label: tNav("contact") },
            ]}
          />

          <FooterColumn
            title={t("support")}
            links={[
              { href: "/auth/login", label: t("faq") },
              { href: "/auth/login", label: t("terms") },
              { href: "/auth/login", label: t("privacy") },
            ]}
          />

          <div>
            <h3 className="mb-4 text-base font-black">{tNav("contact")}</h3>
            <div className="space-y-3 text-sm font-bold text-white/66">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#7dd3fc]" />
                <span dir="ltr">+20 123 456 7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#7dd3fc]" />
                <span>support@edustar.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm font-bold text-white/52">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h3 className="mb-4 text-base font-black">{title}</h3>
      <ul className="space-y-2 text-sm font-bold text-white/66">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
