import type { ProductFilters } from '@/lib/product/filters/types';
import type { ProductSearchParams } from '@/lib/product/types';
import { normalizeSaleParam } from '@/lib/product/filters/normalize/normalize-sale-param';
import { normalizeDiscountParam } from '@/lib/product/filters/normalize/normalize-discount-param';
import { normalizePriceParam } from '@/lib/product/filters/normalize/normalize-price-param';

export function getProductFilters(
    searchParams: ProductSearchParams,
): ProductFilters {
    return {
        saleOnly: normalizeSaleParam(searchParams.sale),

        minDiscount: normalizeDiscountParam(searchParams.discount),

        priceFrom: normalizePriceParam(searchParams.priceFrom),

        priceTo: normalizePriceParam(searchParams.priceTo),
    };
}
