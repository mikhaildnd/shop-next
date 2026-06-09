import ProductsSection from '@/components/product/productsSection/ProductsSection';
import { getProductsSection } from '@/services/product/use-cases/product-section.service';

//Пока что покупки не реализованы
const ProductsBoughtBeforeSection = async () => {
    const section = await getProductsSection({
        take: 8,
        collection: 'frozen',
    });

    if (!section) {
        return null;
    }

    return (
        <ProductsSection
            title="Покупали ранее"
            link="/purchases"
            products={section.products}
        />
    );
};

export default ProductsBoughtBeforeSection;
