import database from '@/data/database.json';
import ProductsSection from '@/components/product/productsSection/ProductsSection';

const ProductsBoughtBefore = () => {
    const userPurchases = database.users[0].purchases
        .map((purchase) => {
            const product = database.products.find(
                (product) => product.id === purchase.id,
            );
            if (!product) return undefined;
            const { discountPercent, ...rest } = product;
            void discountPercent; //ignore
            return rest;
        })
        .filter((item) => item !== undefined);

    return (
        <ProductsSection
            title="Покупали ранее"
            link="/bought-earlier"
            products={userPurchases}
        />
    );
};

export default ProductsBoughtBefore;
