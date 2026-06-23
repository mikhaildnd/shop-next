import ProductFiltersPanel from '@/components/product/productFilters/ProductFiltersPanel';
import type { ProductFiltersMeta } from '@/services/product/product.types';
import type { ReactNode } from 'react';

interface ProductsListingLayoutProps {
    filtersMeta: ProductFiltersMeta;
    filteredProductsCount: number;
    children: ReactNode;
}

function ProductsListingLayout({
    filtersMeta,
    filteredProductsCount,
    children,
}: ProductsListingLayoutProps) {
    return (
        <div className="grid grid-cols-[280px_1fr] items-start gap-4">
            <ProductFiltersPanel
                filtersMeta={filtersMeta}
                filteredProductsCount={filteredProductsCount}
            />
            {children}
        </div>
    );
}

export default ProductsListingLayout;
