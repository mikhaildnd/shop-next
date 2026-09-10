import { parseDiscountParam } from '@/app/(shop)/(catalog)/lib/product-listing/filters/parse/parse-discount-param';
import { parseInStockParam } from '@/app/(shop)/(catalog)/lib/product-listing/filters/parse/parse-in-stock-param';
import { parsePriceFromParam } from '@/app/(shop)/(catalog)/lib/product-listing/filters/parse/parse-price-from-param';
import { parsePriceToParam } from '@/app/(shop)/(catalog)/lib/product-listing/filters/parse/parse-price-to-param';
import { parseSaleParam } from '@/app/(shop)/(catalog)/lib/product-listing/filters/parse/parse-sale-param';
import { getProductFilterDefaults } from '@/app/(shop)/(catalog)/lib/product-listing/get-product-filter-defaults';
import type {
    ProductFilterListingIssue,
    ProductSearchParams,
} from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { isDefined } from '@/lib/type-guards/is-defined';
import type { ProductFilters } from '@/services/product/filters/filter.types';

type ParsedProductFilters = {
    value: ProductFilters;
    issues: ProductFilterListingIssue[];
};

export function parseProductFilters(
    searchParams: ProductSearchParams,
    defaultFilterOverrides: Partial<ProductFilters> = {},
): ParsedProductFilters {
    const defaults = getProductFilterDefaults(defaultFilterOverrides);

    const sale = parseSaleParam(searchParams.sale, defaults.sale);
    const discount = parseDiscountParam(
        searchParams.discount,
        defaults.discount,
    );
    const priceFrom = parsePriceFromParam(
        searchParams.priceFrom,
        defaults.priceFrom,
    );
    const priceTo = parsePriceToParam(searchParams.priceTo, defaults.priceTo);
    const inStock = parseInStockParam(searchParams.inStock, defaults.inStock);

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
            sale: sale.value,
            discount: discount.value,
            priceFrom: priceFrom.value,
            priceTo: priceTo.value,
            inStock: inStock.value,
        },

        issues,
    };
}
