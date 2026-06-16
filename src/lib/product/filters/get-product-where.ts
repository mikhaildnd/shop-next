import type { ProductFilters } from '@/lib/product/filters/types';
import { Prisma } from '@/generated/prisma/client';

export function getProductWhere(
    filters: ProductFilters,
): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {};

    if (filters.saleOnly) {
        where.salePrice = {
            not: null,
        };
    }

    if (filters.minDiscount !== null) {
        where.discountPercent = {
            gte: filters.minDiscount,
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
