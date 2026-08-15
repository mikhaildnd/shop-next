import type {
    ParsedProductListing,
    ProductListingUpdates,
} from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';

export function applyProductListingUpdates(
    listing: ParsedProductListing,
    updates: ProductListingUpdates,
): ParsedProductListing {
    return {
        ...listing,

        filters: {
            ...listing.filters,
            ...updates.filters,
        },

        sort: updates.sort ?? listing.sort,
    };
}
