export function ProductsSectionHeaderSkeleton() {
    return (
        <div className="mb-4 flex gap-x-5 md:mb-8 md:gap-x-10">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200 xl:h-10 xl:w-64" />

            <div className="ml-auto flex items-center gap-x-2">
                <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="hidden items-center gap-2 md:flex">
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
            </div>
        </div>
    );
}
