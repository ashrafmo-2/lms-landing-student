"use client";

import { StudentAuthenticatedGuard } from "@/features/auth/components/student-authenticated-guard";
import { Sidebar } from "@/widgets/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentAuthenticatedGuard>
      <div className="flex min-h-screen bg-background" dir="inherit">
        <aside className="hidden lg:block w-66 shrink-0 sticky top-0 h-screen bg-card border-e border-border">
          <Sidebar />
        </aside>
        <main className="flex-1 min-w-0 bg-muted p-4 md:p-6">{children}</main>
      </div>
    </StudentAuthenticatedGuard>
  );
}
