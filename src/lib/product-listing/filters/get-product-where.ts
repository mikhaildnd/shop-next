import type { ProductFilters } from '@/lib/product-listing/filters/types';
import { Prisma } from '@/generated/prisma/client';

export function getProductWhere(
    filters: ProductFilters,
): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {};

    if (filters.query) {
        where.title = {
            contains: filters.query,
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
