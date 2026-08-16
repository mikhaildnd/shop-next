'use client';

import { useUpdateProductListing } from '@/app/(shop)/(catalog)/_hooks/useUpdateProductListing';
import { Button } from '@/components/button/Button';
import { DEFAULT_PRODUCT_FILTERS } from '@/services/product/filters/filter.constants';
import { DEFAULT_PRODUCT_SORT } from '@/services/product/sort/sort.constants';

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
