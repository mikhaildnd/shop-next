import { normalizeQueryParam } from '@/app/(shop)/(catalog)/lib/product-listing/filters/normalize/normalize-query-param';
import { parseDiscountParam } from '@/app/(shop)/(catalog)/lib/product-listing/filters/parse/parse-discount-param';
import { parseInStockParam } from '@/app/(shop)/(catalog)/lib/product-listing/filters/parse/parse-in-stock-param';
import { parsePriceFromParam } from '@/app/(shop)/(catalog)/lib/product-listing/filters/parse/parse-price-from-param';
import { parsePriceToParam } from '@/app/(shop)/(catalog)/lib/product-listing/filters/parse/parse-price-to-param';
import { parseSaleParam } from '@/app/(shop)/(catalog)/lib/product-listing/filters/parse/parse-sale-param';
import type {
    ProductFilterListingIssue,
    ProductSearchParams,
} from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { SEARCH_QUERY_PARAM } from '@/lib/search/search.constants';
import { isDefined } from '@/lib/type-guards/is-defined';
import type { ProductFilters } from '@/services/product/filters/filter.types';

type ParsedProductFilters = {
    value: ProductFilters;
    issues: ProductFilterListingIssue[];
};

export function parseProductFilters(
    searchParams: ProductSearchParams,
): ParsedProductFilters {
    const query = normalizeQueryParam(searchParams[SEARCH_QUERY_PARAM]);
    const sale = parseSaleParam(searchParams.sale);
    const discount = parseDiscountParam(searchParams.discount);
    const priceFrom = parsePriceFromParam(searchParams.priceFrom);
    const priceTo = parsePriceToParam(searchParams.priceTo);
    const inStock = parseInStockParam(searchParams.inStock);

    const collectedIssues = [
        sale.issue,
        discount.issue,
        priceFrom.issue,
        priceTo.issue,
        inStock.issue,
    ];

    const issues = [...new Set(collectedIssues)].filter(isDefined);

    return {
        value: {
            query,
            sale: sale.value,
            discount: discount.value,
            priceFrom: priceFrom.value,
            priceTo: priceTo.value,
            inStock: inStock.value,
        },

        issues,
    };
}
