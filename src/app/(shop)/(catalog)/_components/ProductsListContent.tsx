import Pagination from '@/components/shared/Pagination';
import LoadMoreButton from '@/components/shared/LoadMoreButton';
import type { ProductDto } from '@/services/product/product.types';
import { ProductGrid } from '@/app/(shop)/(catalog)/_components/ProductGrid';

interface ProductsListContentProps {
    products: ProductDto[];
    currentPage: number;
    totalPages: number;
    startPage: number;
}

export default function ProductsListContent({
    products,
    currentPage,
    totalPages,
    startPage,
}: ProductsListContentProps) {
    const hasPagination = totalPages > 1;
    const hasMore = currentPage < totalPages;

    return (
        <div className="flex flex-col gap-y-6 lg:gap-y-12">
            <ProductGrid products={products} />

            {hasPagination && (
                <div className="flex flex-col items-center gap-y-4 lg:gap-y-8">
                    {hasMore && (
                        <LoadMoreButton
                            nextPage={currentPage + 1}
                            from={startPage}
                        />
                    )}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />
                </div>
            )}
        </div>
    );
}
