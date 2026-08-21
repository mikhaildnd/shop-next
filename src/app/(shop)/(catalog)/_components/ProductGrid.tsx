import { ProductCard } from '@/components/product/product-card/ProductCard';
import { routes } from '@/routes';
import type { ProductListingItemDto } from '@/services/product/product.types';

interface ProductGridProps {
    products: ProductListingItemDto[];
}

export function ProductGrid({ products }: ProductGridProps) {
    return (
        <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 sm:gap-x-3 md:grid-cols-4 md:gap-x-4">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    href={routes.productPage(product.slug)}
                />
            ))}
        </div>
    );
}
