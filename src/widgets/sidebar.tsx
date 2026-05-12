import { LayoutDashboard, BookOpen, ClipboardList, Settings } from "lucide-react";

type NavItem = {
    icon: React.ElementType;
    label: string;
    href: string;
    active?: boolean;
};

const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: "الرئيسية", href: "#", active: true },
    { icon: BookOpen, label: "دروسي", href: "#" },
    { icon: ClipboardList, label: "الاختبارات", href: "#" },
    { icon: Settings, label: "الإعدادات", href: "#" },
];

const navItemBase =
    "group relative flex flex-row-reverse items-center gap-4 rounded-xl px-6 py-4 transition-all duration-300 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-primary";

const navItemActive =
    "bg-primary-container text-on-primary-container border-r-4 border-primary shadow-sm active:scale-95";

const navItemInactive =
    "text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-inverse-surface hover:text-on-surface hover:shadow-sm hover:translate-x-1 active:scale-95";

const iconBase =
    "w-6 h-6 transition-transform duration-300 group-hover:scale-110";

const iconActive = "text-primary";
const iconInactive = "text-on-surface-variant group-hover:text-on-surface";

export const Sidebar = () => {
    return (
        <nav className="flex-1 flex flex-col gap-1 px-2">
            {navItems.map((item) => {
                const Icon = item.icon;
                return (
                    <a
                        key={item.label}
                        href={item.href}
                        className={[
                            navItemBase,
                            item.active ? navItemActive : navItemInactive,
                        ].join(" ")}
                    >
                        {item.active && (
                            <span className="absolute inset-0 rounded-xl bg-primary/5 pointer-events-none" />
                        )}
                        <Icon
                            className={[iconBase, item.active ? iconActive : iconInactive].join(" ")}
                            aria-hidden="true"
                        />
                        <span
                            className={[
                                "transition-all duration-300",
                                item.active
                                    ? "font-headline-md text-headline-md"
                                    : "font-body-md text-body-md group-hover:font-medium",
                            ].join(" ")}
                        >
                            {item.label}
                        </span>
                    </a>
                );
            })}
        </nav>
    );
};
