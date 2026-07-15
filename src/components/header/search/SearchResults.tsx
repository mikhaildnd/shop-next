import Link from 'next/link';

import { SearchCategories } from '@/components/header/search/SearchCategories';
import { SearchEmpty } from '@/components/header/search/SearchEmpty';
import { SearchProducts } from '@/components/header/search/SearchProducts';
import type { SearchResponse } from '@/lib/api/search.types';
import type { SearchHistoryState } from '@/lib/search/search-history.types';
import {
    createCategoryHistoryItem,
    createProductHistoryItem,
} from '@/lib/search/search-history-items';
import type {
    ProductCategoryDto,
    ProductDto,
} from '@/services/product/product.types';
import { cn } from '@/utils/cn';

interface SearchResultsProps {
    results: SearchResponse;
    allResultsUrl: string;
    onResultSelect: () => void;
    onShowAll: () => void;
    history: SearchHistoryState;
    className?: string;
}

export function SearchResults({
    results,
    allResultsUrl,
    onResultSelect,
    onShowAll,
    history,
    className,
}: SearchResultsProps) {
    const { products, categories, productsCount } = results;

    const isEmpty = products.length === 0 && categories.length === 0;

    const handleProductSelect = (product: ProductDto) => {
        history.save(createProductHistoryItem(product));

        onResultSelect();
    };

    const handleCategorySelect = (category: ProductCategoryDto) => {
        history.save(createCategoryHistoryItem(category));

        onResultSelect();
    };

    return isEmpty ? (
        <SearchEmpty />
    ) : (
        <>
            <div className={cn('overflow-y-auto', className)}>
                <SearchCategories
                    categories={categories}
                    onSelect={handleCategorySelect}
                />

                <SearchProducts
                    products={products}
                    onSelect={handleProductSelect}
                />
            </div>

            {productsCount > 0 && (
                <div className="border-t border-gray-100">
                    <Link
                        href={allResultsUrl}
                        onClick={onShowAll}
                        className="block rounded-md p-4 text-center text-sm font-medium text-(--color-primary) transition-colors hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:ring-1 focus-visible:ring-(--color-primary) focus-visible:outline-none"
                    >
                        Показать все {productsCount} товаров
                    </Link>
                </div>
            )}
        </>
    );
}
