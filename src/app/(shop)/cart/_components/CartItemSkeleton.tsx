export function CartItemSkeleton() {
    return (
        <article className="flex animate-pulse gap-4 py-4">
            <div className="size-24 shrink-0 rounded bg-gray-200" />

            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="h-5 w-3/4 rounded bg-gray-200" />

                <div className="h-5 w-1/3 rounded bg-gray-200" />

                <div className="mt-auto flex items-center gap-4">
                    <div className="h-8 w-20 rounded bg-gray-200" />
                    <div className="size-8 rounded bg-gray-200" />
                    <div className="size-8 rounded bg-gray-200" />
                </div>
            </div>
        </article>
    );
}
