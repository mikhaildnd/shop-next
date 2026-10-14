'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ComponentProps } from 'react';
import { useTransition } from 'react';

import { LoadingButton } from '@/components/button/LoadingButton';
import { createLoadMoreUrl } from '@/lib/pagination/create-pagination-url';

interface LoadMoreButtonProps extends Omit<
    ComponentProps<typeof LoadingButton>,
    'children' | 'onClick' | 'isLoading' | 'type'
> {
    nextPage: number;
    from: number;
}

export function LoadMoreButton({
    nextPage,
    from,
    ...props
}: LoadMoreButtonProps) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isPending, startTransition] = useTransition();

    function handleClick() {
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
        <LoadingButton
            {...props}
            type="button"
            isLoading={isPending}
            onClick={handleClick}
        >
            Показать ещё
        </LoadingButton>
    );
}
