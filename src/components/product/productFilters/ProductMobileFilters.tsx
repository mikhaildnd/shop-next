'use client';

import {
    ChevronLeft as IconClose,
    SlidersHorizontal as IconFilter,
} from 'lucide-react';
import { useState } from 'react';

import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { ResetFiltersButton } from '@/components/product/productFilters/ResetFiltersButton';
import type { ProductListingStats } from '@/services/product/product.types';
import { ProductFiltersPanel } from '@/components/product/productFilters/ProductFiltersPanel';

interface ProductMobileFiltersProps {
    listingStats: ProductListingStats;
}

export function ProductMobileFilters({
    listingStats,
}: ProductMobileFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    const openFilters = () => setIsOpen(true);
    const closeFilters = () => setIsOpen(false);

    useLockBodyScroll(isOpen);

    return (
        <>
            <button
                type="button"
                aria-label="Открыть фильтры"
                className="rounded-xl border border-gray-100 bg-white p-2 lg:hidden"
                onClick={openFilters}
            >
                <IconFilter className="size-6" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
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
                        <ProductFiltersPanel listingStats={listingStats} />
                    </main>

                    <footer>
                        <ResetFiltersButton className="w-full" />
                    </footer>
                </div>
            )}
        </>
    );
}
