import ProductsSection from '@/components/product/productsSection/ProductsSection';
import { getProductsSection } from '@/services/product/use-cases/product-section.service';
import { routes } from '@/lib/routes';

const ProductsNewSection = async () => {
    const section = await getProductsSection({
        collection: 'new',
        take: 8,
    });

    if (!section) {
        return null;
    }

    return (
        <ProductsSection
            title={section.title}
            link={routes.category(section.slug)}
            products={section.products}
        />
    );
};

export default ProductsNewSection;
