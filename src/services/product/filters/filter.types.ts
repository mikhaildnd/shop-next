export type ProductFilters = {
    sale: boolean;
    discount: number | null;
    priceFrom: number | null;
    priceTo: number | null;
    inStock: boolean;
};
