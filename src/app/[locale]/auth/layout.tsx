import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function AuthLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#f5f3ff] via-white to-[#ede9ff] flex flex-col" dir="rtl">
      <header className="p-4 sm:p-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#6c3aff] flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#0f172a]">إديوستار</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <AuthGuard>{children}</AuthGuard>
      </div>

      <footer className="p-4 text-center text-sm text-[#64748b]">
        جميع الحقوق محفوظة © 2026 منصة إديوستار التعليمية.
      </footer>
    </div>
  );
}
