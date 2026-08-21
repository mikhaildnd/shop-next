import type { ParsedProductListing } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import type { PaginationParams } from '@/lib/pagination/pagination.types';

export interface GetFavoriteProductsParams {
    userId: string;
    listing: ParsedProductListing;
    pagination: PaginationParams;
}

export interface GetFavoriteProductsByIdsParams {
    favoriteIds: string[];
    listing: ParsedProductListing;
    pagination: PaginationParams;
}
