export const routes = {
    home: () => '/',

    catalog: () => '/catalog',

    category: (slug: string) => `/catalog/${slug}`,

    collection: (slug: string) => `/collection/${slug}`,

    product: (slug: string) => `/product/${slug}`,

    productInCategory: (productSlug: string, categorySlug: string) => {
        const params = new URLSearchParams({
            category: categorySlug,
        });

        return `${routes.product(productSlug)}?${params}`;
    },

    search: (query: string) => {
        const params = new URLSearchParams({
            q: query,
        });

        return `/search?${params}`;
    },
};
