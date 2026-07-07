"use client";

import { StudentAuthenticatedGuard } from "@/features/auth/components/student-authenticated-guard";
import { Link } from "@/shared/i18n/routing";
import { useLocale } from "next-intl";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function DashboardNoSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <StudentAuthenticatedGuard>
      <div className="min-h-screen bg-muted" dir={isAr ? "rtl" : "ltr"}>
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg px-3 py-1.5 hover:bg-muted"
            >
              {isAr ? (
                <>
                  <ArrowRight className="h-4 w-4" />
                  <span>رجوع</span>
                </>
              ) : (
                <>
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </>
              )}
            </Link>
          </div>
        </div>
        <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">{children}</main>
      </div>
    </StudentAuthenticatedGuard>
  );
}
