import ProductsSection from '@/components/product/productsSection/ProductsSection';
import type { ProductDto } from '@/types/product';
import { getProductsByUserEmail } from '@/services/products';

const ProductsBoughtBefore = async () => {
    let purchases: ProductDto[] = [];

    try {
        purchases = await getProductsByUserEmail();
    } catch (error) {
        console.error(error);
    }

    return (
        <ProductsSection
            title="Покупали ранее"
            link="/bought-earlier"
            products={purchases}
        />
    );
};

export default ProductsBoughtBefore;
