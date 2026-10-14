import { ProductCardSkeleton } from '@/components/product/product-card/ProductCardSkeleton';

const SKELETON_COUNT = 8;

export function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 sm:gap-x-3 md:grid-cols-4 md:gap-x-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    );
}
