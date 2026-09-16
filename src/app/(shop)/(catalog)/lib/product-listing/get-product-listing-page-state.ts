import type { ProductListingPageState } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';

interface GetProductListingPageStateParams {
    currentPage: number;
    totalPages: number;
    totalProductsCount: number;
}

export function getProductListingPageState({
    currentPage,
    totalPages,
    totalProductsCount,
}: GetProductListingPageStateParams): ProductListingPageState {
    if (totalProductsCount > 0 && currentPage > totalPages) {
        return 'invalid-page';
    }

    if (totalProductsCount === 0) {
        return 'empty';
    }

    return 'listing';
}
