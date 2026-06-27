import ProductFiltersPanel from '@/components/product/productFilters/ProductFiltersPanel';
import type { ProductFiltersMeta } from '@/services/product/product.types';
import type { ReactNode } from 'react';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';
import HorizontalScrollWrapper from '@/components/shared/HorizontalScrollWrapper';
import type { BreadcrumbItem } from '@/lib/breadcrumbs/types';
import ProductSortDropdown from '@/components/product/productFilters/ProductSortDropdown';
import type { ProductSort } from '@/lib/product-listing/sort/types';

interface ProductListingLayoutProps {
    sort: ProductSort;
    filtersMeta: ProductFiltersMeta;
    filteredProductsCount: number;
    title: string;
    breadcrumbs: BreadcrumbItem[];
    tags?: ReactNode;
    children: ReactNode;
}

function ProductListingLayout({
    sort,
    filtersMeta,
    filteredProductsCount,
    title,
    breadcrumbs,
    tags,
    children,
}: ProductListingLayoutProps) {
    return (
        <div className="page-spacing">
            <HorizontalScrollWrapper>
                <Breadcrumbs
                    items={breadcrumbs}
                    className="py-4"
                />
            </HorizontalScrollWrapper>

            <h1 className="mb-2 catalog-heading xl:mb-3">{title}</h1>

            {tags && (
                <HorizontalScrollWrapper className="mb-3">
                    {tags}
                </HorizontalScrollWrapper>
            )}

            <div className="grid grid-cols-[280px_1fr] items-start gap-4">
                <ProductFiltersPanel
                    filtersMeta={filtersMeta}
                    filteredProductsCount={filteredProductsCount}
                />
                <div className="flex flex-col">
                    <div className="mb-4 flex">
                        <ProductSortDropdown value={sort} />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default ProductListingLayout;
