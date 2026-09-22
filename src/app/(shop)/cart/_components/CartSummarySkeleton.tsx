export function CartSummarySkeleton() {
    return (
        <div className="flex animate-pulse flex-col gap-8 rounded-md border border-gray-100 bg-white px-4 py-4">
            <div className="flex flex-col gap-4">
                <div className="h-7 w-40 rounded bg-gray-200" />

                <div className="flex justify-between">
                    <div className="h-5 w-36 rounded bg-gray-200" />
                    <div className="h-5 w-12 rounded bg-gray-200" />
                </div>

                <div className="flex justify-between">
                    <div className="h-5 w-24 rounded bg-gray-200" />
                    <div className="h-5 w-20 rounded bg-gray-200" />
                </div>

                <div className="flex justify-between">
                    <div className="h-5 w-16 rounded bg-gray-200" />
                    <div className="h-5 w-20 rounded bg-gray-200" />
                </div>

                <div className="mt-2 flex justify-between gap-4">
                    <div className="h-7 w-20 rounded bg-gray-200" />
                    <div className="h-6 w-28 rounded bg-gray-200" />
                </div>
            </div>

            <div className="h-10 w-full rounded bg-gray-200" />
        </div>
    );
}
