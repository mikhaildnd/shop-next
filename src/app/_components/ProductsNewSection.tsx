import ProductsSection from '@/components/product/productsSection/ProductsSection';
import { getProductsSection } from '@/services/product/product-section.service';

const ProductsNewSection = async () => {
    const section = await getProductsSection({
        category: 'new',
        take: 8,
    });

    if (!section) {
        return null;
    }

    return (
        <ProductsSection
            title={section.title}
            link={`/catalog/${section.slug}`}
            products={section.products}
        />
    );
};

export default ProductsNewSection;
