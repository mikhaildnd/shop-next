import ProductsSection from '@/components/product/productsSection/ProductsSection';
import type { ProductDto } from '@/types/product';
import { getProducts } from '@/services/products';

const ProductsNew = async () => {
    let products: ProductDto[] = [];

    try {
        products = await getProducts('new');
    } catch (error) {
        console.error(error);
    }

    return (
        <ProductsSection
            title="Новинки"
            link="/new-products"
            products={products}
        />
    );
};

export default ProductsNew;
