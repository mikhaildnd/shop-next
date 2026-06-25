'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUpdateProductFilters } from '@/hooks/useUpdateProductFilters';
import FilterSection from '@/components/product/productFilters/FilterSection';

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

const ProductPriceFilter = ({
    minPrice,
    maxPrice,
}: ProductPriceFilterProps) => {
    const searchParams = useSearchParams();
    const updateFilters = useUpdateProductFilters();

    const urlPriceFrom = searchParams.get('priceFrom') ?? String(minPrice);
    const urlPriceTo = searchParams.get('priceTo') ?? String(maxPrice);

    const [priceFrom, setPriceFrom] = useState(urlPriceFrom);
    const [priceTo, setPriceTo] = useState(urlPriceTo);

    const applyFilters = (nextPriceFrom: string, nextPriceTo: string) => {
        const normalizedFrom =
            Number(nextPriceFrom) === minPrice ? undefined : nextPriceFrom;

        const normalizedTo =
            Number(nextPriceTo) === maxPrice ? undefined : nextPriceTo;

        const currentFrom = searchParams.get('priceFrom') ?? undefined;

        const currentTo = searchParams.get('priceTo') ?? undefined;

        if (currentFrom === normalizedFrom && currentTo === normalizedTo) {
            return;
        }

        updateFilters({
            priceFrom: normalizedFrom,
            priceTo: normalizedTo,
            page: undefined,
        });
    };

    const handlePriceFromBlur = () => {
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

    const handlePriceToBlur = () => {
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
            <div className="mb-2 text-xs text-gray-500">
                От {minPrice} до {maxPrice}
            </div>

            <div className="flex gap-4 text-sm">
                <input
                    autoComplete="off"
                    className="w-full rounded-xl border border-(--color-primary) bg-white px-2 py-1 transition-colors focus-visible:border-(--color-primary) focus-visible:ring-2 focus-visible:ring-(--color-primary)/30 focus-visible:ring-offset-1 focus-visible:outline-none"
                    type="text"
                    inputMode="numeric"
                    value={priceFrom}
                    onChange={(e) => {
                        setPriceFrom(e.target.value);
                    }}
                    onBlur={handlePriceFromBlur}
                />

                <input
                    autoComplete="off"
                    className="w-full rounded-xl border border-(--color-primary) bg-white px-2 py-1 transition-colors focus-visible:border-(--color-primary) focus-visible:ring-2 focus-visible:ring-(--color-primary)/30 focus-visible:ring-offset-1 focus-visible:outline-none"
                    type="text"
                    inputMode="numeric"
                    value={priceTo}
                    onChange={(e) => {
                        setPriceTo(e.target.value);
                    }}
                    onBlur={handlePriceToBlur}
                />
            </div>
        </FilterSection>
    );
};

export default ProductPriceFilter;
