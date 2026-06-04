import ProductsSection from '@/components/product/productsSection/ProductsSection';
import { getProductsSection } from '@/services/product/product-section.service';

//Пока что покупки не реализованы
const ProductsBoughtBeforeSection = async () => {
    const section = await getProductsSection({
        take: 8,
        category: 'frozen',
    });

    if (!section) {
        return null;
    }

    return (
        <ProductsSection
            title="Покупали ранее"
            link="/catalog/purchases"
            products={section.products}
        />
    );
};

export default ProductsBoughtBeforeSection;
