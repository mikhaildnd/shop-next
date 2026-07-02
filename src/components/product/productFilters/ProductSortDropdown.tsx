'use client';

import { useRef, useState } from 'react';
import { PRODUCT_SORT_ITEMS } from '@/lib/product-listing/sort/consts';
import { useDismiss } from '@/hooks/useDismiss';
import type { ProductSort } from '@/lib/product-listing/sort/types';
import { cn } from '@/utils/cn';
import { Check, ChevronDown } from 'lucide-react';
import { useUpdateProductListing } from '@/hooks/useUpdateProductListing';

interface ProductSortDropdownProps {
    value: ProductSort;
}

function ProductSortDropdown({ value }: ProductSortDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const rootRef = useRef<HTMLDivElement>(null);

    const updateProductListing = useUpdateProductListing();

    const selectedOption =
        PRODUCT_SORT_ITEMS.find((option) => option.value === value) ??
        PRODUCT_SORT_ITEMS[0];

    const handleSelect = (sort: ProductSort) => {
        if (sort === selectedOption.value) return;

        updateProductListing({
            sort,
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
                className="flex w-54 cursor-pointer items-center justify-between overflow-x-hidden rounded-xl border border-gray-100 bg-white px-4 py-2 whitespace-nowrap hover:border-gray-200"
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span>{selectedOption?.label}</span>
                <ChevronDown
                    className={cn(
                        'size-5 transition-transform',
                        isOpen && 'rotate-180',
                    )}
                />
            </button>
            {isOpen && (
                <ul
                    className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white whitespace-nowrap shadow-lg"
                    role="listbox"
                >
                    {PRODUCT_SORT_ITEMS.map((option) => (
                        <li key={option.value}>
                            <button
                                role="option"
                                aria-selected={option.value === value}
                                className={cn(
                                    'flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left transition-colors duration-50',
                                    option.value === value
                                        ? 'bg-(--color-primary)/20 font-semibold'
                                        : 'hover:bg-(--color-primary)/10',
                                )}
                                type="button"
                                onClick={() => handleSelect(option.value)}
                            >
                                <span>{option.label}</span>

                                {option.value === value && (
                                    <Check className="size-5 text-(--color-primary)" />
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ProductSortDropdown;
