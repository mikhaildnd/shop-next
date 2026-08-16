import type { ReactNode } from 'react';

import { ProductSortDropdown } from '@/app/(shop)/(catalog)/_components/product-filters/product-sort-dropdown/ProductSortDropdown';
import { ProductDesktopFilters } from '@/app/(shop)/(catalog)/_components/product-filters/ProductDesktopFilters';
import { ProductMobileFilters } from '@/app/(shop)/(catalog)/_components/product-filters/ProductMobileFilters';
import { HorizontalScrollWrapper } from '@/app/(shop)/(catalog)/_components/wrappers/HorizontalScrollWrapper';
import { Breadcrumbs } from '@/components/breadcrumbs/Breadcrumbs';
import type { BreadcrumbItem } from '@/components/breadcrumbs/breadcrumbs.types';
import type { ProductListingStats } from '@/services/product/product.types';
import type { ProductSort } from '@/services/product/sort/sort.types';

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
