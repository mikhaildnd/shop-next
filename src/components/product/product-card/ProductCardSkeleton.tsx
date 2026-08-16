export function ProductCardSkeleton() {
    return (
        <div className="flex flex-col overflow-hidden rounded bg-white">
            {/* Image */}
            <div className="relative aspect-square w-full animate-pulse bg-gray-200"></div>

            <div className="flex flex-col gap-y-2 p-2">
                {/* Prices */}
                <div className="flex items-end justify-between gap-x-2">
                    <div className="flex grow flex-col gap-1">
                        <div className="h-5 w-16 animate-pulse rounded bg-gray-200 sm:w-20" />
                        <div className="h-3 w-12 animate-pulse rounded bg-gray-200 sm:w-12" />
                    </div>

                    <div className="flex flex-col items-end gap-1">
                        <div className="h-4 w-12 animate-pulse rounded bg-gray-200 sm:w-16" />
                        <div className="h-3 w-10 animate-pulse rounded bg-gray-200 sm:w-14" />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                    <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
                </div>

                {/* Rating */}
                <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-4 w-4 animate-pulse rounded bg-gray-200"
                        />
                    ))}
                </div>

                {/* Button */}
                <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
            </div>
        </div>
    );
}
