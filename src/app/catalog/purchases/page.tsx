import type { ProductDto } from '@/types/product';
import { getProducts } from '@/services/product.service';
import ProductCard from '@/components/product/productCard/ProductCard';

export default async function Page() {
    let purchases: ProductDto[] = [];

    try {
        purchases = await getProducts({
            limit: 8,
            category: 'frozen',
        });
    } catch (error) {
        console.error(error);
    }
    return (
        <main className="mb-10 flex wrapper grow flex-col gap-y-10 md:mt-6 md:mb-20 md:gap-y-20">
            <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 sm:gap-x-3 lg:grid-cols-4 lg:gap-x-4">
                {purchases.map((purchase: ProductDto) => {
                    return (
                        <ProductCard
                            key={purchase.id}
                            product={purchase}
                        />
                    );
                })}
            </div>
        </main>
    );
}
