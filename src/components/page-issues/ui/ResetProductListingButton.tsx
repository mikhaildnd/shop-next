'use client';

import { useUpdateProductListing } from '@/hooks/useUpdateProductListing';
import { DEFAULT_PRODUCT_FILTERS } from '@/lib/product-listing/filters/consts';
import { DEFAULT_PRODUCT_SORT } from '@/lib/product-listing/sort/consts';

export function ResetProductListingButton() {
    const updateProductListing = useUpdateProductListing();

    function handleClick() {
        updateProductListing({
            filters: DEFAULT_PRODUCT_FILTERS,
            sort: DEFAULT_PRODUCT_SORT,
        });
    }

    return (
        <button
            onClick={handleClick}
            className="flex cursor-pointer items-center justify-center gap-2 bg-(--color-primary) px-4 py-3 text-white transition-opacity hover:opacity-90"
        >
            Сбросить фильтры
        </button>
    );
}
