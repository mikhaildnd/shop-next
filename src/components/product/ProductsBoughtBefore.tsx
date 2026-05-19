import ProductsSection from '@/components/product/productsSection/ProductsSection';
import type { ProductDto } from '@/types/product';
import { getProducts } from '@/services/product.service';

//Пока что покупки не реализованы
const ProductsBoughtBefore = async () => {
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
        <ProductsSection
            title="Покупали ранее"
            link="catalog/purchases"
            products={purchases}
        />
    );
};

export default ProductsBoughtBefore;
