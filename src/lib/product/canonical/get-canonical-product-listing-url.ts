import { updateSearchParams } from '@/lib/url/update-search-params';
import type { ProductSearchParams } from '@/lib/product/types';
import { getCanonicalPaginationSearchParams } from '@/lib/pagination/get-canonical-pagination-search-params';
import { getCanonicalProductSearchParams } from '@/lib/product/canonical/get-canonical-product-search-params';

export function getCanonicalProductListingUrl(
    searchParams: ProductSearchParams,
): string {
    return updateSearchParams({
        searchParams: new URLSearchParams(),
        params: {
            ...getCanonicalPaginationSearchParams(searchParams),

            ...getCanonicalProductSearchParams(searchParams),
        },
    });
}
