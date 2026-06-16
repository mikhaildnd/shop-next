import { createUrl } from '@/lib/url/create-url';
import type { ProductSearchParams } from '@/lib/product/types';
import { getCanonicalPaginationSearchParams } from '@/lib/pagination/get-canonical-pagination-search-params';
import { getCanonicalProductSearchParams } from '@/lib/product/canonical/get-canonical-product-search-params';

export function getCanonicalProductListingUrl(
    searchParams: ProductSearchParams,
): string {
    return createUrl({
        searchParams: new URLSearchParams(),
        params: {
            ...getCanonicalPaginationSearchParams(searchParams),

            ...getCanonicalProductSearchParams(searchParams),
        },
    });
}
