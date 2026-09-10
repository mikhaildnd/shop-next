'use client';

import { useProductListing } from '@/app/(shop)/(catalog)/_hooks/useProductListing';
import { Button } from '@/components/button/Button';

export function ResetProductListingButton() {
    const { resetListing } = useProductListing();

    return <Button onClick={resetListing}>Сбросить фильтры</Button>;
}
