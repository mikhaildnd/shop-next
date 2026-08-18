'use server';

import type { ParsedProductListing } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import type { PaginationParams } from '@/lib/pagination/pagination.types';
import { getProducts } from '@/services/product/product.service';

interface GetFavoriteProductsParams {
    favoriteIds: string[];
    listing: ParsedProductListing;
    pagination: PaginationParams;
}

export async function getFavoriteProducts({
    favoriteIds,
    listing,
    pagination,
}: GetFavoriteProductsParams) {
    const result = await getProducts({
        favoriteIds,
        ...listing,
        take: pagination.take,
        skip: pagination.skip,
    });

    return {
        ...result,
        sort: listing.sort,
        currentPage: pagination.currentPage,
        startPage: pagination.startPage,
    };
}
