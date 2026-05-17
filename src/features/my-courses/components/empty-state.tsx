import { BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";

export function EmptyState({ locale }: { locale: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 bg-[#ede9ff] rounded-full flex items-center justify-center mb-5">
        <GraduationCap className="w-10 h-10 text-[#6c3aff]" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        لا توجد كورسات مشترك بها
      </h2>
      <p className="text-gray-500 text-sm max-w-xs mb-6">
        لم تشترك في أي مسار تعليمي بعد. تصفح المسارات المتاحة وابدأ رحلتك
        التعليمية.
      </p>
      <Link
        href={`/${locale}/tracks`}
        className="flex items-center gap-2 bg-[#6c3aff] hover:bg-[#5228e8] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-lg shadow-[#6c3aff]/20"
      >
        <BookOpen className="w-4 h-4" />
        تصفح المسارات
      </Link>
    </div>
  );
}
