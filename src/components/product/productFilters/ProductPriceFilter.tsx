'use client';

import { useEffect, useState } from 'react';

import { FilterSection } from '@/components/product/productFilters/FilterSection';
import { useProductListing } from '@/hooks/useProductListing';
import { useUpdateProductListing } from '@/hooks/useUpdateProductListing';

interface ProductPriceFilterProps {
    minPrice: number;
    maxPrice: number;
}

function parsePrice(value: string): number | null {
    const normalized = value.trim().replace(',', '.');

    const number = Number(normalized);

    if (!Number.isFinite(number)) {
        return null;
    }

    return number;
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

        const priceFromFilter = from === minPrice ? null : from;
        const priceToFilter = to === maxPrice ? null : to;

        if (
            currentPriceFrom === priceFromFilter &&
            currentPriceTo === priceToFilter
        ) {
            return;
        }

        updateProductListing({
            filters: {
                priceFrom: priceFromFilter,
                priceTo: priceToFilter,
            },
        });
    };

    const handlePriceFromBlur = () => {
        const value = parsePrice(priceFrom);

        const nextPriceFrom =
            value === null || value < minPrice || value > maxPrice
                ? String(minPrice)
                : String(value);

        setPriceFrom(nextPriceFrom);

        applyFilters(nextPriceFrom, priceTo);
    };

    const handlePriceToBlur = () => {
        const value = parsePrice(priceTo);

        const nextPriceTo =
            value === null || value < minPrice || value > maxPrice
                ? String(maxPrice)
                : String(value);

        setPriceTo(nextPriceTo);

        applyFilters(priceFrom, nextPriceTo);
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
                    onBlur={handlePriceFromBlur}
                />

                <input
                    autoComplete="off"
                    className="w-full rounded-xl border border-(--color-primary) bg-white px-2 py-1 transition-colors focus-visible:border-(--color-primary) focus-visible:ring-2 focus-visible:ring-(--color-primary)/30 focus-visible:ring-offset-1 focus-visible:outline-none"
                    type="text"
                    inputMode="numeric"
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value)}
                    onBlur={handlePriceToBlur}
                />
            </div>
        </FilterSection>
    );
}
