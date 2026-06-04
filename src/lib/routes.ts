export const routes = {
    home: () => '/',

    catalog: () => '/catalog',

    category: (slug: string) => `/catalog/${slug}`,

    product: (slug: string) => `/catalog/product/${slug}`,

    productInCategory: (productSlug: string, categorySlug: string) => {
        const params = new URLSearchParams({
            category: categorySlug,
        });

        return `${routes.product(productSlug)}?${params.toString()}`;
    },
};
