export type ProductFilters = {
    query: string | null;
    sale: boolean;
    discount: number | null;
    priceFrom: number | null;
    priceTo: number | null;
    inStock: boolean;
};
