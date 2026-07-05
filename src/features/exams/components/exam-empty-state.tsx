import { ClipboardList } from "lucide-react";

export function ExamEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f4ff]">
        <ClipboardList className="h-8 w-8 text-[#0067b8]" />
      </div>
      <h2 className="text-lg font-extrabold text-gray-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}
