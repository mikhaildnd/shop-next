import ProductsSection from '@/components/product/productsSection/ProductsSection';
import type { ProductDto } from '@/types/product';
import { getProducts } from '@/services/product.service';

const ProductsNew = async () => {
    let products: ProductDto[] = [];

    try {
        products = await getProducts({
            limit: 8,
            category: 'new',
        });
    } catch (error) {
        console.error(error);
    }

    return (
        <ProductsSection
            title="Новинки"
            link="catalog/new-products"
            products={products}
        />
    );
};

export default ProductsNew;
