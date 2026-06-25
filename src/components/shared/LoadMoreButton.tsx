'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createLoadMoreUrl } from '@/lib/pagination/create-pagination-url';

type LoadMoreButtonProps = {
    nextPage: number;
    from: number;
    hasMore: boolean;
};

export default function LoadMoreButton({
    nextPage,
    from,
    hasMore,
}: LoadMoreButtonProps) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isPending, startTransition] = useTransition();

    function handleClick() {
        if (!hasMore || isPending) {
            return;
        }

        startTransition(() => {
            router.push(
                createLoadMoreUrl({
                    pathname,
                    searchParams,
                    page: nextPage,
                    from,
                }),
                { scroll: false },
            );
        });
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={!hasMore || isPending}
            className={`flex w-full items-center justify-center gap-2 bg-(--color-primary) px-4 py-3 text-white transition-opacity ${
                !hasMore || isPending
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer hover:opacity-90'
            }`}
        >
            {isPending ? (
                <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Загрузка...
                </>
            ) : hasMore ? (
                'Показать ещё'
            ) : (
                'Товаров больше нет'
            )}
        </button>
    );
}
