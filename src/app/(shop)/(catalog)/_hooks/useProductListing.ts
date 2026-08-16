'use client';

import { useSearchParams } from 'next/navigation';

import { getProductSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/get-product-search-params';
import { parseProductListing } from '@/app/(shop)/(catalog)/lib/product-listing/parse-product-listing';

export function useProductListing() {
    const searchParams = useSearchParams();

    return parseProductListing(getProductSearchParams(searchParams));
}
