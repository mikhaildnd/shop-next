import { DEFAULT_PRODUCT_SORT } from '@/lib/product-listing/sort/consts';
import { normalizeSaleParam } from '@/lib/product-listing/filters/normalize/normalize-sale-param';
import { normalizeDiscountParam } from '@/lib/product-listing/filters/normalize/normalize-discount-param';
import { normalizePriceParam } from '@/lib/product-listing/filters/normalize/normalize-price-param';
import { normalizeSortParam } from '@/lib/product-listing/sort/normalize/normalize-sort-param';
import { normalizeInStockParam } from '@/lib/product-listing/filters/normalize/normalize-in-stock-param';
import type { ProductSearchParams } from '@/lib/product-listing/types';

export function getCanonicalProductSearchParams(
    searchParams: ProductSearchParams,
): Partial<ProductSearchParams> {
    const result: Partial<ProductSearchParams> = {};

    const sort = normalizeSortParam(searchParams.sort);

    if (sort !== DEFAULT_PRODUCT_SORT) {
        result.sort = sort;
    }

    const sale = normalizeSaleParam(searchParams.sale);

    if (sale) {
        result.sale = 'true';
    }

    const inStock = normalizeInStockParam(searchParams.inStock);

    if (inStock) {
        result.inStock = 'true';
    }

    const discount = normalizeDiscountParam(searchParams.discount);

    if (discount !== null) {
        result.discount = String(discount);
    }

    let priceFrom = normalizePriceParam(searchParams.priceFrom);

    let priceTo = normalizePriceParam(searchParams.priceTo);

    if (priceFrom !== null && priceTo !== null && priceFrom > priceTo) {
        [priceFrom, priceTo] = [priceTo, priceFrom];
    }

    if (priceFrom !== null) {
        result.priceFrom = String(priceFrom);
    }

    if (priceTo !== null) {
        result.priceTo = String(priceTo);
    }

    return result;
}
