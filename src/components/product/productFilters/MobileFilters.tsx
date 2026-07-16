'use client';

import {
    ChevronLeft as IconClose,
    SlidersHorizontal as IconFilter,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface MobileFiltersProps {
    children: ReactNode;
}

export function MobileFilters({ children }: MobileFiltersProps) {
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

                    <main className="grow overflow-y-auto">{children}</main>
                </div>
            )}
        </>
    );
}
