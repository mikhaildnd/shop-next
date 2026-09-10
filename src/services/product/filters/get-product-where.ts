import type { Prisma } from '@/generated/prisma/client';
import type { ProductFilters } from '@/services/product/filters/filter.types';

type GetProductWhereOptions = {
    query: string | null;
    filters: ProductFilters;
};

export function getProductWhere({
    query,
    filters,
}: GetProductWhereOptions): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {};

    if (query) {
        where.title = {
            contains: query,
            mode: 'insensitive',
        };
    }

    if (filters.sale) {
        where.salePrice = {
            not: null,
        };
    }

    if (filters.inStock) {
        where.stock = {
            gt: 0,
        };
    }

    if (filters.discount !== null) {
        where.discountPercent = {
            gte: filters.discount,
        };
    }

    if (filters.priceFrom !== null || filters.priceTo !== null) {
        where.effectivePrice = {};

        if (filters.priceFrom !== null) {
            where.effectivePrice.gte = filters.priceFrom;
        }

        if (filters.priceTo !== null) {
            where.effectivePrice.lte = filters.priceTo;
        }
    }

    return where;
}
