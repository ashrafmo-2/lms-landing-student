"use client";

import { LayoutDashboard, BookOpen, ClipboardList, Settings } from "lucide-react";
import { Link } from "@/shared/i18n/routing";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/shared/ui/language-switcher";

type NavItem = {
    icon: React.ElementType;
    labelKey: string;
    href: string;
};

const iconBase = "w-6 h-6 transition-transform duration-300 group-hover:scale-110";
const navItemBase = "group relative flex items-center gap-4 rounded-xl px-6 py-4 transition-all duration-300 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-primary";
const navItemActive = "bg-primary/10 text-primary ltr:border-l-4 rtl:border-r-4 border-primary shadow-sm";
const navItemInactive = "text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-sm hover:translate-x-1 active:scale-95";

export const Sidebar = () => {
    const t = useTranslations("Dashboard.sidebar");
    const pathname = usePathname();

    const navItems: NavItem[] = [
        { icon: LayoutDashboard, labelKey: "dashboard", href: "/dashboard" },
        { icon: BookOpen, labelKey: "myCourses", href: "/dashboard/courses" }, // Updated key and href
        { icon: ClipboardList, labelKey: "tracks", href: "/dashboard/tracks" }, // Updated key
        { icon: Settings, labelKey: "settings", href: "/dashboard/settings" },
    ];

    const isActive = (href: string) => {
        // Handle localized pathnames in isActive check
        const normalizedPathname = pathname.replace(/^\/(ar|en|it)/, "") || "/";
        return normalizedPathname === href || (href !== "/dashboard" && normalizedPathname.startsWith(href));
    };

    return (
        <div className="flex flex-col h-full">
            <nav className="flex-1 flex flex-col gap-1 px-4 py-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={[navItemBase, active ? navItemActive : navItemInactive].join(" ")}
                        >
                            {active && (
                                <span className="absolute inset-0 rounded-xl bg-primary/5 pointer-events-none" />
                            )}
                            <Icon
                                className={[iconBase, active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"].join(" ")}
                                aria-hidden="true"
                            />
                            <span className={["transition-all duration-300 text-sm", active ? "font-semibold text-primary" : "text-muted-foreground group-hover:text-foreground group-hover:font-medium"].join(" ")}>
                                {t(item.labelKey)}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* <div className="px-6 py-8 border-t border-border">
                <div className="flex flex-col gap-4">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                        {t("settings")}
                    </span>
                    <div className="px-2">
                        <LanguageSwitcher />
                    </div> 
                </div>
            </div> */}
        </div>
    );
};
