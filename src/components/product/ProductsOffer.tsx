import database from '@/data/database.json';
import ProductsSection from '@/components/product/productsSection/ProductsSection';

const ProductsOffer = async () => {
    await new Promise((r) => setTimeout(r, 2000));

    const products = database.products.filter((p) =>
        p.categories.includes('actions'),
    );

    return (
        <ProductsSection
            title="Акции"
            link="/actions"
            products={products}
        />
    );
};

export default ProductsOffer;
