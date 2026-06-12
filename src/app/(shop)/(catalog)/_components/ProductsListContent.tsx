import ProductCard from '@/components/product/productCard/ProductCard';
import Pagination from '@/components/shared/Pagination';
import LoadMoreButton from '@/components/shared/LoadMoreButton';
import type { ProductDto } from '@/services/product/product.types';

interface ProductsListContentProps {
    products: ProductDto[];
    currentPage: number;
    totalPages: number;
    startPage: number;
    getProductHref: (product: ProductDto) => string;
}

export default function ProductsListContent({
    products,
    currentPage,
    totalPages,
    startPage,
    getProductHref,
}: ProductsListContentProps) {
    const hasPagination = totalPages > 1;
    const hasMore = currentPage < totalPages;

    return (
        <div className="flex flex-col gap-y-6 lg:gap-y-12">
            <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 sm:gap-x-3 lg:grid-cols-4 lg:gap-x-4">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        href={getProductHref(product)}
                    />
                ))}
            </div>

            {hasPagination && (
                <div className="flex flex-col items-center gap-y-4 lg:gap-y-8">
                    {hasMore && (
                        <LoadMoreButton
                            nextPage={currentPage + 1}
                            from={startPage}
                            hasMore={hasMore}
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
