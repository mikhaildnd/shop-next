import ProductCard from '@/components/product/productCard/ProductCard';
import Pagination from '@/components/Pagination';
import LoadMoreButton from '@/components/LoadMoreButton';
import type { ProductDto } from '@/types/product';

type CatalogPageProps = {
    products: ProductDto[];
    currentPage: number;
    totalPages: number;
    startPage: number;
};

export default function CatalogPage({
    products,
    currentPage,
    totalPages,
    startPage,
}: CatalogPageProps) {
    const hasPagination = totalPages > 1;
    const hasMore = currentPage < totalPages;

    return (
        <>
            <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 sm:gap-x-3 lg:grid-cols-4 lg:gap-x-4">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>

            {hasPagination && (
                <div className="flex flex-col items-center gap-4">
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
        </>
    );
}
