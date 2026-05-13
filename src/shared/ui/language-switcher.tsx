"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing, usePathname, useRouter } from "@/shared/i18n/routing";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export function LanguageSwitcher() {
    const t = useTranslations("Common");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    function handleLocaleChange(newLocale: string) {
        // @ts-ignore
        router.replace({ pathname, params }, { locale: newLocale });
    }

    return (
        <div className="flex gap-2">
            {routing.locales.map((cur) => (
                <Button
                    key={cur}
                    variant={locale === cur ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLocaleChange(cur)}
                >
                    {cur.toUpperCase()}
                </Button>
            ))}
        </div>
    );
}
