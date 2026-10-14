import { cn } from '@/lib/cn';

interface ProductDesktopFiltersSkeletonProps {
    className?: string;
}

export function ProductDesktopFiltersSkeleton({
    className,
}: ProductDesktopFiltersSkeletonProps) {
    return (
        <aside
            className={cn(
                'sticky top-4 flex max-h-[calc(100vh-2rem)] flex-col overflow-y-auto rounded-xl border border-gray-100 bg-white',
                className,
            )}
        >
            <div className="flex flex-col">
                <section className="border-b border-gray-100 px-4 py-5">
                    <div className="mb-4 h-6 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-8 animate-pulse rounded bg-gray-200" />
                        <div className="h-8 animate-pulse rounded bg-gray-200" />
                    </div>
                </section>

                <section className="border-b border-gray-100 px-4 py-5">
                    <div className="mb-4 h-6 w-28 animate-pulse rounded bg-gray-200" />
                    <div className="space-y-3">
                        <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
                        <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
                    </div>
                </section>

                <section className="border-b border-gray-100 px-4 py-5">
                    <div className="mb-4 h-6 w-20 animate-pulse rounded bg-gray-200" />
                    <div className="flex gap-2">
                        <div className="h-7 w-14 animate-pulse rounded-2xl bg-gray-200" />
                        <div className="h-7 w-14 animate-pulse rounded-2xl bg-gray-200" />
                        <div className="h-7 w-14 animate-pulse rounded-2xl bg-gray-200" />
                    </div>
                </section>
            </div>

            <div className="mx-auto mt-6 mb-4 h-9 w-32 animate-pulse rounded bg-gray-200" />
        </aside>
    );
}
