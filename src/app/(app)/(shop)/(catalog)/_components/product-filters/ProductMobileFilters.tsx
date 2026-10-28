'use client';

import { ChevronLeft as IconClose } from 'lucide-react';
import { useState } from 'react';

import { ProductFiltersButton } from '@/app/(app)/(shop)/(catalog)/_components/product-filters/ProductFiltersButton';
import { ProductFiltersPanel } from '@/app/(app)/(shop)/(catalog)/_components/product-filters/ProductFiltersPanel';
import { ResetFiltersButton } from '@/app/(app)/(shop)/(catalog)/_components/product-filters/ResetFiltersButton';
import { IconButton } from '@/components/button/IconButton';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface ProductMobileFiltersProps {
    className?: string;
}

export function ProductMobileFilters({ className }: ProductMobileFiltersProps) {
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
                        <IconButton
                            className="border border-gray-100 hover:border-gray-200"
                            onClick={closeFilters}
                            aria-label="Закрыть фильтры"
                            size="md"
                            shape="rounded"
                            variant="ghost"
                        >
                            <IconClose />
                        </IconButton>

                        <h2 className="text-lg font-semibold">Фильтры</h2>
                    </header>

                    <main className="flex grow flex-col overflow-y-auto">
                        <ProductFiltersPanel />
                    </main>

                    <footer className="border border-t-gray-100 px-4 py-3">
                        <ResetFiltersButton className="w-full" />
                    </footer>
                </div>
            )}
        </div>
    );
}
