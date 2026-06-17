import ProductSaleFilter from '@/components/product/productFilters/ProductSaleFilter';
import ProductDiscountFilter from '@/components/product/productFilters/ProductDiscountFilter';
import ProductPriceFilter from '@/components/product/productFilters/ProductPriceFilter';
import type { ProductFiltersMeta } from '@/services/product/product.types';

interface ProductFiltersPanelProps {
    filtersMeta: ProductFiltersMeta;
    filteredProductsCount: number;
}

const ProductFiltersPanel = ({ filtersMeta }: ProductFiltersPanelProps) => {
    return (
        <aside className="sticky top-4 flex max-h-[calc(100vh-2rem)] flex-col gap-y-4 overflow-y-auto rounded-xl bg-gray-100 p-2">
            <ProductSaleFilter />
            <ProductDiscountFilter />
            <ProductPriceFilter
                minPrice={filtersMeta.minPrice}
                maxPrice={filtersMeta.maxPrice}
            />
        </aside>
    );
};

export default ProductFiltersPanel;
