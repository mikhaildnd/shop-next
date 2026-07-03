'use client';

import { useState } from 'react';

import { FilterSection } from '@/components/product/productFilters/FilterSection';
import { useProductListing } from '@/hooks/useProductListing';
import { useUpdateProductListing } from '@/hooks/useUpdateProductListing';

interface ProductPriceFilterProps {
    minPrice: number;
    maxPrice: number;
}

function normalizePrice(
    value: string,
    fallback: number,
    minPrice: number,
    maxPrice: number,
): string {
    const digits = value.replace(/\D/g, '');

    let number = digits ? Number(digits) : fallback;

    if (number < minPrice || number > maxPrice) {
        number = fallback;
    }

    return String(number);
}

export function ProductPriceFilter({
    minPrice,
    maxPrice,
}: ProductPriceFilterProps) {
    const {
        filters: { priceFrom: currentPriceFrom, priceTo: currentPriceTo },
    } = useProductListing();

    const updateProductListing = useUpdateProductListing();

    const [priceFrom, setPriceFrom] = useState(
        String(currentPriceFrom ?? minPrice),
    );
    const [priceTo, setPriceTo] = useState(String(currentPriceTo ?? maxPrice));

    const applyFilters = (nextPriceFrom: string, nextPriceTo: string) => {
        const normalizedFrom =
            Number(nextPriceFrom) === minPrice ? null : Number(nextPriceFrom);

        const normalizedTo =
            Number(nextPriceTo) === maxPrice ? null : Number(nextPriceTo);

        if (
            currentPriceFrom === normalizedFrom &&
            currentPriceTo === normalizedTo
        ) {
            return;
        }

        updateProductListing({
            filters: {
                priceFrom: normalizedFrom,
                priceTo: normalizedTo,
            },
        });
    };

    const handleBlur = () => {
        const normalizedFrom = normalizePrice(
            priceFrom,
            minPrice,
            minPrice,
            maxPrice,
        );

        const normalizedTo = normalizePrice(
            priceTo,
            maxPrice,
            minPrice,
            maxPrice,
        );

        setPriceFrom(normalizedFrom);
        setPriceTo(normalizedTo);

        applyFilters(normalizedFrom, normalizedTo);
    };

    return (
        <FilterSection title="Цена">
            <div className="flex gap-4 text-sm text-gray-700">
                <input
                    autoComplete="off"
                    className="w-full rounded-xl border border-(--color-primary) bg-white px-2 py-1 transition-colors focus-visible:border-(--color-primary) focus-visible:ring-2 focus-visible:ring-(--color-primary)/30 focus-visible:ring-offset-1 focus-visible:outline-none"
                    type="text"
                    inputMode="numeric"
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(e.target.value)}
                    onBlur={handleBlur}
                />

                <input
                    autoComplete="off"
                    className="w-full rounded-xl border border-(--color-primary) bg-white px-2 py-1 transition-colors focus-visible:border-(--color-primary) focus-visible:ring-2 focus-visible:ring-(--color-primary)/30 focus-visible:ring-offset-1 focus-visible:outline-none"
                    type="text"
                    inputMode="numeric"
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value)}
                    onBlur={handleBlur}
                />
            </div>
        </FilterSection>
    );
}
