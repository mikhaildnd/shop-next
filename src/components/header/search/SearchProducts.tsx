import { SearchProductItem } from '@/components/header/search/SearchProductItem';
import type { ProductDto } from '@/services/product/product.types';

interface SearchProductsProps {
    products: ProductDto[];
    onClose: () => void;
}

export function SearchProducts({ products, onClose }: SearchProductsProps) {
    if (!products.length) {
        return null;
    }

    return (
        <section className="p-3">
            <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Товары
            </h2>

            <ul className="space-y-1">
                {products.map((product) => (
                    <SearchProductItem
                        onClose={onClose}
                        key={product.id}
                        product={product}
                    />
                ))}
            </ul>
        </section>
    );
}
