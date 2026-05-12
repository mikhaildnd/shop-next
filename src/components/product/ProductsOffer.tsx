import ProductsSection from '@/components/product/productsSection/ProductsSection';
import type { ProductDto } from '@/types/product';
import { getProducts } from '@/services/products';

const ProductsOffer = async () => {
    let products: ProductDto[] = [];

    try {
        products = await getProducts('actions');
    } catch (error) {
        console.error(error);
    }

    return (
        <ProductsSection
            title="Акции"
            link="/actions"
            products={products}
        />
    );
};

export default ProductsOffer;
