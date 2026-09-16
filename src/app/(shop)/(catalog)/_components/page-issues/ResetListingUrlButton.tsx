'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import { removeProductListingSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/remove-product-listing-search-params';
import { ButtonLink } from '@/components/button/ButtonLink';
import { removePaginationSearchParams } from '@/lib/pagination/remove-pagination-search-params';
import { buildSearchParams } from '@/lib/url/build-search-params';

export function ResetListingUrlButton() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const params = new URLSearchParams(searchParams);

    removeProductListingSearchParams(params);
    removePaginationSearchParams(params);

    const href = `${pathname}${buildSearchParams(params)}`;

    return <ButtonLink href={href}>Сбросить фильтры</ButtonLink>;
}
