import type { ProductDto } from '@/types/product';
import { getProducts } from '@/services/product.service';
import ProductCard from '@/components/product/productCard/ProductCard';

export default async function Page() {
    let products: ProductDto[] = [];

    try {
        products = await getProducts({
            limit: 12,
            category: 'new',
        });
    } catch (error) {
        console.error(error);
    }
    return (
        <main className="mb-10 flex wrapper grow flex-col gap-y-10 md:mt-6 md:mb-20 md:gap-y-20">
            <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 sm:gap-x-3 lg:grid-cols-4 lg:gap-x-4">
                {products.map((product: ProductDto) => {
                    return (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    );
                })}
            </div>
        </main>
    );
}
