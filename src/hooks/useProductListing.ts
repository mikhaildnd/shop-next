import { useSearchParams } from 'next/navigation';

import { getProductSearchParams } from '@/lib/product-listing/get-product-search-params';
import { parseProductListing } from '@/lib/product-listing/parse-product-listing';

export function useProductListing() {
    const searchParams = useSearchParams();

    return parseProductListing(getProductSearchParams(searchParams));
}
