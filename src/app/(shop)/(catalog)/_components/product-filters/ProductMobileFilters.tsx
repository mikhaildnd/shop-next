'use client';

import { ChevronLeft as IconClose } from 'lucide-react';
import { useState } from 'react';

import { ProductFiltersButton } from '@/app/(shop)/(catalog)/_components/product-filters/ProductFiltersButton';
import { ProductFiltersPanel } from '@/app/(shop)/(catalog)/_components/product-filters/ProductFiltersPanel';
import { ResetFiltersButton } from '@/app/(shop)/(catalog)/_components/product-filters/ResetFiltersButton';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import type { ProductFilters } from '@/services/product/filters/filter.types';
import type { ProductListingStats } from '@/services/product/product.types';

interface ProductMobileFiltersProps {
    listingStats: ProductListingStats;
    defaultFilterOverrides?: Partial<ProductFilters>;
    className?: string;
}

export function ProductMobileFilters({
    listingStats,
    defaultFilterOverrides,
    className,
}: ProductMobileFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    const openFilters = () => setIsOpen(true);
    const closeFilters = () => setIsOpen(false);

    useLockBodyScroll(isOpen);

    return (
        <div className={className}>
            <ProductFiltersButton onClick={openFilters} />

            {isOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-white">
                    <header className="flex items-center gap-x-4 border-b border-gray-100 px-4 py-4">
                        <button
                            type="button"
                            onClick={closeFilters}
                            aria-label="Закрыть фильтры"
                            className="rounded-xl border border-gray-100 bg-white p-2 text-gray-500"
                        >
                            <IconClose className="size-6" />
                        </button>
                        <h2 className="text-lg font-semibold">Фильтры</h2>
                    </header>

                    <main className="flex grow flex-col overflow-y-auto">
                        <ProductFiltersPanel
                            listingStats={listingStats}
                            defaultFilterOverrides={defaultFilterOverrides}
                        />
                    </main>

                    <footer>
                        <ResetFiltersButton className="w-full" />
                    </footer>
                </div>
            )}
        </div>
    );
}
