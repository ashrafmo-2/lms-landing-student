export function SkeletonCard() {
    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
            <div className="h-40 bg-gray-200" />
            <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
                <div className="flex gap-2 pt-2">
                    <div className="h-6 bg-gray-100 rounded-full w-16" />
                    <div className="h-6 bg-gray-100 rounded-full w-20" />
                </div>
            </div>
        </div>
    );
}