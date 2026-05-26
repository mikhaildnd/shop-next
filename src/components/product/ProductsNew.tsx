import ProductsSection from '@/components/product/productsSection/ProductsSection';
import { getProductsSection } from '@/services/product-section.service';

const ProductsNew = async () => {
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

export default ProductsNew;
