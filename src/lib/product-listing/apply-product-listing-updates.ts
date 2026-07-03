import type {
    ParsedProductListing,
    ProductListingUpdates,
} from '@/lib/product-listing/types';

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
