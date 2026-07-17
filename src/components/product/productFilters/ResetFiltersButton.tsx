'use client';

import { useUpdateProductListing } from '@/hooks/useUpdateProductListing';
import { DEFAULT_PRODUCT_FILTERS } from '@/lib/product-listing/filters/consts';
import { cn } from '@/utils/cn';

export function ResetFiltersButton({ className }: { className?: string }) {
    const updateProductListing = useUpdateProductListing();

    return (
        <button
            onClick={() =>
                updateProductListing({
                    filters: {
                        ...DEFAULT_PRODUCT_FILTERS,
                    },
                })
            }
            type="button"
            className={cn(
                'flex cursor-pointer items-center justify-center rounded-md bg-(--color-primary) px-4 py-2 text-white transition-opacity hover:opacity-90 focus-visible:opacity-90',
                className,
            )}
        >
            Сбросить
        </button>
    );
}
