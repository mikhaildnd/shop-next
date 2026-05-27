import ProductsSection from '@/components/product/productsSection/ProductsSection';
import { getProductsSection } from '@/services/product-section.service';
import { routes } from '@/lib/routes';

const ProductsOffer = async () => {
    const section = await getProductsSection({
        category: 'promotion',
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

export default ProductsOffer;
