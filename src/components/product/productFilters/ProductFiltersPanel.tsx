import ProductSaleFilter from '@/components/product/productFilters/ProductSaleFilter';
import ProductDiscountFilter from '@/components/product/productFilters/ProductDiscountFilter';
import ProductPriceFilter from '@/components/product/productFilters/ProductPriceFilter';
import type { ProductListingStats } from '@/services/product/product.types';
import ProductInStockFilter from '@/components/product/productFilters/ProductInStockFilter';

interface ProductFiltersPanelProps {
    listingStats: ProductListingStats;
    filteredProductsCount: number;
}

function ProductFiltersPanel({ listingStats }: ProductFiltersPanelProps) {
    return (
        <aside className="sticky top-4 flex max-h-[calc(100vh-2rem)] flex-col overflow-y-auto rounded-xl border border-gray-100 bg-white">
            <ProductPriceFilter
                minPrice={listingStats.minPrice}
                maxPrice={listingStats.maxPrice}
            />
            <ProductInStockFilter />
            <ProductSaleFilter />
            <ProductDiscountFilter maxDiscount={listingStats.maxDiscount} />
        </aside>
    );
}

export default ProductFiltersPanel;
