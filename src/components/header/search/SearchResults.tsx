import Link from 'next/link';

import { SearchCategories } from '@/components/header/search/SearchCategories';
import { SearchEmpty } from '@/components/header/search/SearchEmpty';
import { SearchProducts } from '@/components/header/search/SearchProducts';
import type { SearchResponse } from '@/lib/api/search.types';
import { cn } from '@/utils/cn';

interface SearchResultsProps {
    results: SearchResponse;
    allResultsUrl: string;
    onClose: () => void;
    className?: string;
}

export function SearchResults({
    results,
    allResultsUrl,
    onClose,
    className,
}: SearchResultsProps) {
    const { products, categories, productsCount } = results;

    const isEmpty = products.length === 0 && categories.length === 0;

    return isEmpty ? (
        <SearchEmpty />
    ) : (
        <>
            <div className={cn('overflow-y-auto', className)}>
                <SearchCategories
                    categories={categories}
                    onClose={onClose}
                />

                <SearchProducts
                    products={products}
                    onClose={onClose}
                />
            </div>

            {productsCount > 0 && (
                <div className="border-t border-gray-100 p-2">
                    <Link
                        href={allResultsUrl}
                        onClick={onClose}
                        className="block rounded-md p-2 text-center text-sm font-medium text-(--color-primary) hover:bg-gray-50"
                    >
                        Показать все {productsCount} товаров
                    </Link>
                </div>
            )}
        </>
    );
}
