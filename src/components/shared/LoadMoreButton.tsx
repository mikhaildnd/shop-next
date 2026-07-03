'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

import { createLoadMoreUrl } from '@/lib/pagination/create-pagination-url';
import { cn } from '@/utils/cn';

interface LoadMoreButtonProps {
    nextPage: number;
    from: number;
}

export function LoadMoreButton({ nextPage, from }: LoadMoreButtonProps) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isPending, startTransition] = useTransition();

    function handleClick() {
        if (isPending) {
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
            disabled={isPending}
            onClick={handleClick}
            className={cn(
                'flex w-full items-center justify-center gap-2 bg-(--color-primary) px-4 py-3 text-white transition-opacity',
                isPending
                    ? 'cursor-progress opacity-50'
                    : 'cursor-pointer hover:opacity-90',
            )}
        >
            {isPending ? (
                <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Загрузка...
                </>
            ) : (
                'Показать ещё'
            )}
        </button>
    );
}
