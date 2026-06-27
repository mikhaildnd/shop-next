import ProductSaleFilter from '@/components/product/productFilters/ProductSaleFilter';
import ProductDiscountFilter from '@/components/product/productFilters/ProductDiscountFilter';
import ProductPriceFilter from '@/components/product/productFilters/ProductPriceFilter';
import type { ProductFiltersMeta } from '@/services/product/product.types';
import ProductInStockFilter from '@/components/product/productFilters/ProductInStockFilter';

interface ProductFiltersPanelProps {
    filtersMeta: ProductFiltersMeta;
    filteredProductsCount: number;
}

function ProductFiltersPanel({ filtersMeta }: ProductFiltersPanelProps) {
    return (
        <aside className="sticky top-4 flex max-h-[calc(100vh-2rem)] flex-col overflow-y-auto rounded-xl border border-gray-100 bg-white">
            <ProductPriceFilter
                minPrice={filtersMeta.minPrice}
                maxPrice={filtersMeta.maxPrice}
            />
            <ProductInStockFilter />
            <ProductSaleFilter />
            <ProductDiscountFilter
                availableDiscounts={filtersMeta.availableDiscounts}
            />
        </aside>
    );
}

export default ProductFiltersPanel;
