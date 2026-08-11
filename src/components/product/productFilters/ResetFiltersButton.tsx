'use client';

import { Button } from '@/components/shared/button/Button';
import { useUpdateProductListing } from '@/hooks/useUpdateProductListing';
import { DEFAULT_PRODUCT_FILTERS } from '@/lib/product-listing/filters/consts';

export function ResetFiltersButton({ className }: { className?: string }) {
    const updateProductListing = useUpdateProductListing();

    return (
        <Button
            onClick={() =>
                updateProductListing({
                    filters: {
                        ...DEFAULT_PRODUCT_FILTERS,
                    },
                })
            }
            className={className}
        >
            Сбросить
        </Button>
    );
}
