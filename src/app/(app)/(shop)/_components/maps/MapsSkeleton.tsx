export function MapsSkeleton() {
    return (
        <section>
            <div className="flex flex-col">
                <div className="mb-4 h-8 w-56 animate-pulse rounded bg-gray-200 md:mb-8 xl:mb-10 xl:h-10 xl:w-72" />

                <div className="mb-5 flex flex-wrap gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-8 w-24 animate-pulse rounded bg-gray-200"
                        />
                    ))}
                </div>

                <div className="h-[354px] w-full animate-pulse rounded-2xl bg-gray-200" />
            </div>
        </section>
    );
}
