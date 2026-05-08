import database from '@/data/database.json';
import ProductsSection from '@/components/product/productsSection/ProductsSection';

const ProductsNew = async () => {
    await new Promise((r) => setTimeout(r, 2000));

    const newProducts = database.products.filter((p) =>
        p.categories?.includes('new'),
    );

    return (
        <ProductsSection
            title="Новинки"
            link="/new-products"
            products={newProducts}
        />
    );
};

export default ProductsNew;
