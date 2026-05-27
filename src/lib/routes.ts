export const routes = {
    home: () => '/',

    catalog: () => '/catalog',

    category: (slug: string) => `/catalog/${slug}`,

    product: (slug: string) => `/catalog/product/${slug}`,
};
