'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useRef, useState } from 'react';

import { PRODUCT_SORT_ITEMS } from '@/app/(app)/(shop)/(catalog)/_components/product-filters/product-sort-dropdown/product-sort.constants';
import { useProductListingContext } from '@/app/(app)/(shop)/(catalog)/_components/ProductListingContext';
import { useDismiss } from '@/hooks/useDismiss';
import { cn } from '@/lib/cn';
import type { ControlShape, ControlSize } from '@/lib/ui/ui-styles';
import { controlHeightClasses, controlShapeClasses } from '@/lib/ui/ui-styles';
import type { ProductSort } from '@/services/product/sort/sort.types';

interface ProductSortDropdownProps {
    size?: ControlSize;
    shape?: ControlShape;
}

export function ProductSortDropdown({
    size = 'md',
    shape = 'rounded',
}: ProductSortDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const rootRef = useRef<HTMLDivElement>(null);

    const { listing, updateListing } = useProductListingContext();

    const selectedOption =
        PRODUCT_SORT_ITEMS.find((option) => option.value === listing.sort) ??
        PRODUCT_SORT_ITEMS[0];

    const handleSelect = (nextSort: ProductSort) => {
        if (nextSort === listing.sort) {
            setIsOpen(false);
            return;
        }

        updateListing({
            sort: nextSort,
        });

        setIsOpen(false);
    };

    useDismiss({
        ref: rootRef,
        onClickOutside: () => setIsOpen(false),
        onEscape: () => setIsOpen(false),
    });

    return (
        <div
            ref={rootRef}
            className="relative"
        >
            <button
                className={cn(
                    'flex w-54 items-center justify-between border border-gray-100 bg-white px-3 whitespace-nowrap focus-ring hover:border-gray-200',
                    controlHeightClasses[size],
                    controlShapeClasses[shape],
                )}
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
            >
                <span>{selectedOption.label}</span>

                <ChevronDown
                    className={cn(
                        'size-5 transition-transform',
                        isOpen && 'rotate-180',
                    )}
                />
            </button>

            {isOpen && (
                <ul
                    className={cn(
                        'absolute z-20 mt-2 w-full overflow-hidden border border-gray-100 bg-white whitespace-nowrap shadow-lg',
                        controlShapeClasses[shape],
                    )}
                >
                    {PRODUCT_SORT_ITEMS.map((option) => (
                        <li key={option.value}>
                            <button
                                className={cn(
                                    'flex w-full items-center justify-between px-3 transition-colors outline-none',
                                    'focus-visible:bg-(--color-primary)/10',
                                    controlHeightClasses[size],
                                    option.value === listing.sort
                                        ? 'bg-(--color-primary)/20 font-semibold'
                                        : 'hover:bg-(--color-primary)/10',
                                )}
                                type="button"
                                onClick={() => handleSelect(option.value)}
                            >
                                <span>{option.label}</span>

                                {option.value === listing.sort && (
                                    <Check className="size-4 text-(--color-primary)" />
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
