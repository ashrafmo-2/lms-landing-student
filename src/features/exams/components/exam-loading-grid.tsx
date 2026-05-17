const SKELETON_IDS = [
  "exam-skeleton-1",
  "exam-skeleton-2",
  "exam-skeleton-3",
  "exam-skeleton-4",
  "exam-skeleton-5",
  "exam-skeleton-6",
];

export function ExamLoadingGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {SKELETON_IDS.map((id) => (
        <div
          key={id}
          className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="mb-5 flex justify-between">
            <div className="space-y-2">
              <div className="h-5 w-44 rounded bg-gray-200" />
              <div className="h-3 w-28 rounded bg-gray-100" />
            </div>
            <div className="h-8 w-20 rounded-full bg-gray-100" />
          </div>
          <div className="mb-5 h-3 w-full rounded bg-gray-100" />
          <div className="mb-5 h-3 w-5/6 rounded bg-gray-100" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-14 rounded-xl bg-gray-100" />
            <div className="h-14 rounded-xl bg-gray-100" />
            <div className="h-14 rounded-xl bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
