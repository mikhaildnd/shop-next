import { ProductCard } from '@/components/product/productCard/ProductCard';
import { routes } from '@/lib/routes';
import type { ProductDto } from '@/services/product/product.types';

interface ProductGridProps {
    products: ProductDto[];
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
