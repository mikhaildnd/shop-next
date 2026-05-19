import ProductsSection from '@/components/product/productsSection/ProductsSection';
import type { ProductDto } from '@/types/product';
import { getProducts } from '@/services/product.service';

const ProductsOffer = async () => {
    let products: ProductDto[] = [];

    try {
        products = await getProducts({
            limit: 8,
            promotion: true,
        });
    } catch (error) {
        console.error(error);
    }

    return (
        <ProductsSection
            title="Акции"
            link="catalog/promotion"
            products={products}
        />
    );
};

export default ProductsOffer;
