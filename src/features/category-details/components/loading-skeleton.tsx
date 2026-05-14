export function Skeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="h-56 bg-gray-200 rounded-3xl" />
            <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded-2xl" />
                ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-48 bg-gray-200 rounded-2xl" />
                ))}
            </div>
        </div>
    );
}
