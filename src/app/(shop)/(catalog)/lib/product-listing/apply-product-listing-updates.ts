import type {
    ProductListingState,
    ProductListingUpdates,
} from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';

export function applyProductListingUpdates(
    listing: ProductListingState,
    updates: ProductListingUpdates,
): ProductListingState {
    return {
        ...listing,

        filters: {
            ...listing.filters,
            ...updates.filters,
        },

        sort: updates.sort ?? listing.sort,
    };
}
