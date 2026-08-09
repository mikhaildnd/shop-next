'use client';

import { Button } from '@/components/shared/button/Button';
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

    return <Button onClick={handleClick}>Сбросить фильтры</Button>;
}
