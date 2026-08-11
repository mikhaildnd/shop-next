'use client';

import { ChevronLeft as IconClose } from 'lucide-react';
import { useState } from 'react';

import { ProductFiltersButton } from '@/components/product/productFilters/ProductFiltersButton';
import { ProductFiltersPanel } from '@/components/product/productFilters/ProductFiltersPanel';
import { ResetFiltersButton } from '@/components/product/productFilters/ResetFiltersButton';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import type { ProductListingStats } from '@/services/product/product.types';

interface ProductMobileFiltersProps {
    listingStats: ProductListingStats;
    className?: string;
}

export function ProductMobileFilters({
    listingStats,
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
                        <ProductFiltersPanel listingStats={listingStats} />
                    </main>

                    <footer>
                        <ResetFiltersButton className="w-full" />
                    </footer>
                </div>
            )}
        </div>
    );
}
