'use client';

import { useEffect, useState } from 'react';

import { FilterSection } from '@/components/product/productFilters/FilterSection';
import { useProductListing } from '@/hooks/useProductListing';
import { useUpdateProductListing } from '@/hooks/useUpdateProductListing';

interface ProductPriceFilterProps {
    minPrice: number;
    maxPrice: number;
}

function normalizePriceInput(
    value: string,
    fallback: number,
    minPrice: number,
    maxPrice: number,
): string {
    const normalized = value.trim().replace(',', '.');

    const number = Number(normalized);

    if (!Number.isFinite(number)) {
        return String(fallback);
    }

    if (number < minPrice || number > maxPrice) {
        return String(fallback);
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

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPriceFrom(String(currentPriceFrom ?? minPrice));
        setPriceTo(String(currentPriceTo ?? maxPrice));
    }, [currentPriceFrom, currentPriceTo, minPrice, maxPrice]);

    const applyFilters = (nextPriceFrom: string, nextPriceTo: string) => {
        const from = Number(nextPriceFrom);
        const to = Number(nextPriceTo);

        const normalizedFrom = from === minPrice ? null : from;
        const normalizedTo = to === maxPrice ? null : to;

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
        const normalizedFrom = normalizePriceInput(
            priceFrom,
            minPrice,
            minPrice,
            maxPrice,
        );

        const normalizedTo = normalizePriceInput(
            priceTo,
            maxPrice,
            minPrice,
            maxPrice,
        );

        applyFilters(normalizedFrom, normalizedTo);
    };

    return (
        <FilterSection title="Цена">
            <div className="flex gap-4 text-sm text-gray-700">
                <input
                    autoComplete="off"
                    className="w-full rounded-xl border border-(--color-primary) bg-white px-2 py-1 transition-colors focus-visible:border-(--color-primary) focus-visible:ring-2 focus-visible:ring-(--color-primary)/30 focus-visible:ring-offset-1 focus-visible:outline-none"
                    type="text"
                    inputMode="decimal"
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
