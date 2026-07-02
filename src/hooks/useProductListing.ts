import { useSearchParams } from 'next/navigation';
import { parseProductListing } from '@/lib/product-listing/parse-product-listing';
import { getProductSearchParams } from '@/lib/product-listing/get-product-search-params';

export function useProductListing() {
    const searchParams = useSearchParams();

    return parseProductListing(getProductSearchParams(searchParams));
}
