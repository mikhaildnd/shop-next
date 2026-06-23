import { SEARCH_QUERY_PARAM } from '@/lib/search/consts';
import { buildUrl } from '@/lib/url/build-url';

export const routes = {
    home: () => '/',

    catalog: () => '/catalog',

    category: (slug: string) => `/catalog/${slug}`,

    collection: (slug: string) => `/collection/${slug}`,

    product: (slug: string) => `/product/${slug}`,

    productInCategory: (productSlug: string, categorySlug: string) => {
        return buildUrl({
            pathname: routes.product(productSlug),
            params: { category: categorySlug },
        });
    },

    search: (query: string) => {
        return buildUrl({
            pathname: '/search',
            params: {
                [SEARCH_QUERY_PARAM]: query,
            },
        });
    },

    api: {
        search: (query: string) => {
            return buildUrl({
                pathname: '/api/search',
                params: {
                    [SEARCH_QUERY_PARAM]: query,
                },
            });
        },
    },
};
