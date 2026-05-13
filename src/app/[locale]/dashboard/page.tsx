import { useTranslations } from "next-intl";

const Page = () => {
    const t = useTranslations("Dashboard.main");
    return (
        <div>{t("title")}</div>
    )
}

export default Page;