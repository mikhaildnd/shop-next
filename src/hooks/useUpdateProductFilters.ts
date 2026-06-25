'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { updateSearchParams } from '@/lib/url/update-search-params';
import { useCallback } from 'react';

type ProductFilterUpdates = {
    sale?: string;
    inStock?: string;
    discount?: string;
    priceFrom?: string;
    priceTo?: string;
    sort?: string;
    page?: undefined;
};

export function useUpdateProductFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    return useCallback(
        (params: ProductFilterUpdates) => {
            router.replace(
                `${pathname}${updateSearchParams({
                    searchParams,
                    params,
                })}`,
                {
                    scroll: false,
                },
            );
        },
        [router, pathname, searchParams],
    );
}
