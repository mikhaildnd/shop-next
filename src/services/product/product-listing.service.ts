import { prisma } from '@/db';
import type { Prisma } from '@/generated/prisma/client';
import { DEFAULT_PRODUCT_FILTERS } from '@/services/product/filters/filter.constants';
import type { ProductFilters } from '@/services/product/filters/filter.types';
import { getProductWhere } from '@/services/product/filters/get-product-where';
import type {
    ProductListingData,
    ProductListingStats,
} from '@/services/product/product.types';
import { getProductsByWhere } from '@/services/product/queries/get-products-by-where';
import type { ProductSort } from '@/services/product/sort/sort.types';

export type GetProductListingParams = {
    take?: number;
    skip?: number;
    query?: string | null;
    filters?: ProductFilters;
    sort?: ProductSort;
};

export async function getProductListing({
    take,
    skip,
    query,
    filters,
    sort,
}: GetProductListingParams): Promise<ProductListingData> {
    const where = getListingWhere({
        query,
        filters,
    });

    const [productsResponse, listingStats] = await Promise.all([
        getProductsByWhere({
            where,
            take,
            skip,
            sort,
            includeCount: true,
        }),

        getProductListingStats({
            query,
            filters,
        }),
    ]);

    return {
        ...productsResponse,
        listingStats,
    };
}

interface GetCategoryProductListingParams extends GetProductListingParams {
    categorySlugs: string[];
}

export async function getCategoryProductListing({
    categorySlugs,
    take,
    skip,
    query,
    filters,
    sort,
}: GetCategoryProductListingParams): Promise<ProductListingData> {
    const listingWhere = getListingWhere({
        query,
        filters,
    });

    const categoryWhere: Prisma.ProductWhereInput = {
        category: {
            slug: {
                in: categorySlugs,
            },
        },
    };

    const where: Prisma.ProductWhereInput = {
        AND: [listingWhere, categoryWhere],
    };

    const [productsResponse, listingStats] = await Promise.all([
        getProductsByWhere({
            where,
            take,
            skip,
            sort,
            includeCount: true,
        }),

        getProductListingStats({
            query,
            filters,
            additionalWhere: categoryWhere,
        }),
    ]);

    return {
        ...productsResponse,
        listingStats,
    };
}

interface GetCollectionProductListingParams extends GetProductListingParams {
    collectionSlug: string;
}

export async function getCollectionProductListing({
    collectionSlug,
    take,
    skip,
    query,
    filters,
    sort,
}: GetCollectionProductListingParams): Promise<ProductListingData> {
    const listingWhere = getListingWhere({
        query,
        filters,
    });

    const collectionWhere: Prisma.ProductWhereInput = {
        collections: {
            some: {
                collection: {
                    slug: collectionSlug,
                },
            },
        },
    };

    const where: Prisma.ProductWhereInput = {
        AND: [listingWhere, collectionWhere],
    };

    const [productsResponse, listingStats] = await Promise.all([
        getProductsByWhere({
            where,
            take,
            skip,
            sort,
            includeCount: true,
        }),

        getProductListingStats({
            query,
            filters,
            additionalWhere: collectionWhere,
        }),
    ]);

    return {
        ...productsResponse,
        listingStats,
    };
}

interface GetFavoriteProductListingParams extends GetProductListingParams {
    userId: string;
}

export async function getFavoriteProductListing({
    userId,
    take,
    skip,
    query,
    filters,
    sort,
}: GetFavoriteProductListingParams): Promise<ProductListingData> {
    const listingWhere = getListingWhere({
        query,
        filters,
    });

    const favoriteWhere: Prisma.ProductWhereInput = {
        favorites: {
            some: {
                userId,
            },
        },
    };

    const where: Prisma.ProductWhereInput = {
        AND: [listingWhere, favoriteWhere],
    };

    const [productsResponse, listingStats] = await Promise.all([
        getProductsByWhere({
            where,
            take,
            skip,
            sort,
            includeCount: true,
        }),

        getProductListingStats({
            query,
            filters,
            additionalWhere: favoriteWhere,
        }),
    ]);

    return {
        ...productsResponse,
        listingStats,
    };
}

function getListingWhere({
    query,
    filters,
}: {
    query?: string | null;
    filters?: ProductFilters;
}): Prisma.ProductWhereInput {
    const listingFilters = {
        ...DEFAULT_PRODUCT_FILTERS,
        ...filters,
    };

    return getProductWhere({
        query,
        filters: listingFilters,
    });
}

async function getProductListingStats({
    query,
    filters,
    additionalWhere,
}: {
    query?: string | null;
    filters?: ProductFilters;
    additionalWhere?: Prisma.ProductWhereInput;
}): Promise<ProductListingStats> {
    const listingFilters = {
        ...DEFAULT_PRODUCT_FILTERS,
        ...filters,
    };

    const priceStatsFilters: ProductFilters = {
        ...listingFilters,
        priceFrom: null,
        priceTo: null,
    };

    const saleStatsFilters: ProductFilters = {
        ...listingFilters,
        sale: false,
    };

    const inStockStatsFilters: ProductFilters = {
        ...listingFilters,
        inStock: false,
    };

    const priceStatsWhere = getProductWhere({
        query,
        filters: priceStatsFilters,
    });

    const saleStatsWhere = getProductWhere({
        query,
        filters: saleStatsFilters,
    });

    const inStockStatsWhere = getProductWhere({
        query,
        filters: inStockStatsFilters,
    });

    const priceWhere = additionalWhere
        ? {
              AND: [priceStatsWhere, additionalWhere],
          }
        : priceStatsWhere;

    const saleWhere = additionalWhere
        ? {
              AND: [saleStatsWhere, additionalWhere],
          }
        : saleStatsWhere;

    const inStockWhere = additionalWhere
        ? {
              AND: [inStockStatsWhere, additionalWhere],
          }
        : inStockStatsWhere;

    const [priceAggregates, saleProduct, inStockProduct] = await Promise.all([
        prisma.product.aggregate({
            where: priceWhere,
            _min: {
                effectivePrice: true,
            },
            _max: {
                effectivePrice: true,
                discountPercent: true,
            },
        }),

        prisma.product.findFirst({
            where: {
                ...saleWhere,
                salePrice: {
                    not: null,
                },
            },
            select: {
                id: true,
            },
        }),

        prisma.product.findFirst({
            where: {
                ...inStockWhere,
                stock: {
                    gt: 0,
                },
            },
            select: {
                id: true,
            },
        }),
    ]);

    return {
        minPrice: Number(priceAggregates._min.effectivePrice ?? 0),
        maxPrice: Number(priceAggregates._max.effectivePrice ?? 0),
        maxDiscount: Number(priceAggregates._max.discountPercent ?? 0),
        hasSaleProducts: saleProduct !== null,
        hasInStockProducts: inStockProduct !== null,
    };
}
