import { useLocale } from 'use-intl';

export const LabelDir = ({ labeltitle }: { labeltitle: string }) => {
    const locale = useLocale();
    return (
        <label className="block text-sm font-medium text-[#0f172a] mb-1.5" dir={locale === "ar" ? "rtl" : "ltr"}>
            {labeltitle}
        </label>
    )
}
