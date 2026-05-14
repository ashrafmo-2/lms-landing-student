"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";
import { Sidebar } from "@/widgets/sidebar";
import { useLocale } from "next-intl";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const locale = useLocale()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/auth/login");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-background" dir={locale === "ar" ? "rtl" : "ltr"}>
            <div className="w-66 shrink-0 sticky top-0 h-screen bg-card border-l border-border">
                <Sidebar />
            </div>
            <div className="p-5 bg-muted min-h-screen flex-1">
                {children}
            </div>
        </div>
    );
}
