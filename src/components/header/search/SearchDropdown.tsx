import SearchProducts from '@/components/header/search/SearchProducts';
import SearchCategories from '@/components/header/search/SearchCategories';
import Link from 'next/link';
import SearchEmpty from '@/components/header/search/SearchEmpty';
import type { SearchResponse } from '@/lib/api/search.types';

interface SearchDropdownProps {
    results: SearchResponse | null;
    allResultsUrl: string;
    onClose: () => void;
}

const SearchDropdown = ({
    results,
    allResultsUrl,
    onClose,
}: SearchDropdownProps) => {
    if (!results) return null;

    const products = results.products;
    const categories = results.categories;
    const productsCount = results.productsCount;

    const isEmpty = products.length === 0 && categories.length === 0;

    const hasMoreResults = productsCount > 0;

    return (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-lg border border-(--color-primary) bg-white shadow-lg">
            {isEmpty ? (
                <SearchEmpty />
            ) : (
                <>
                    <div className="max-h-[500px] overflow-y-auto">
                        <SearchCategories
                            categories={categories}
                            onClose={onClose}
                        />
                        <SearchProducts
                            products={products}
                            onClose={onClose}
                        />
                    </div>
                    {hasMoreResults && (
                        <div className="border-t border-gray-100 p-2">
                            <Link
                                onClick={onClose}
                                href={allResultsUrl}
                                className="block rounded-md p-2 text-center text-sm font-medium text-(--color-primary) hover:bg-gray-50"
                            >
                                Показать все {productsCount} товаров
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SearchDropdown;
