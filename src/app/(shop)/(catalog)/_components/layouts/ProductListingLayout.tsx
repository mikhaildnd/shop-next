import type { ReactNode } from 'react';

import { Breadcrumbs } from '@/components/breadcrumbs/Breadcrumbs';
import { ProductDesktopFilters } from '@/components/product/productFilters/ProductDesktopFilters';
import { ProductMobileFilters } from '@/components/product/productFilters/ProductMobileFilters';
import { ProductSortDropdown } from '@/components/product/productFilters/ProductSortDropdown';
import { HorizontalScrollWrapper } from '@/components/shared/HorizontalScrollWrapper';
import type { BreadcrumbItem } from '@/lib/breadcrumbs/types';
import type { ProductSort } from '@/lib/product-listing/sort/types';
import type { ProductListingStats } from '@/services/product/product.types';

interface ProductListingLayoutProps {
    sort: ProductSort;
    listingStats: ProductListingStats;
    title: string;
    breadcrumbs: BreadcrumbItem[];
    tags?: ReactNode;
    children: ReactNode;
}

export function ProductListingLayout({
    sort,
    listingStats,
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

            <div className="grid items-start lg:grid-cols-[280px_1fr] lg:gap-4">
                <ProductDesktopFilters
                    listingStats={listingStats}
                    className="hidden lg:flex"
                />
                <div className="flex flex-col">
                    <div className="mb-4 flex items-center justify-between">
                        <ProductSortDropdown value={sort} />
                        <ProductMobileFilters
                            className="lg:hidden"
                            listingStats={listingStats}
                        />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
