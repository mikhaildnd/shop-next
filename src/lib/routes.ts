import { SEARCH_QUERY_PARAM } from '@/lib/search/consts';
import { buildUrl } from '@/lib/url/build-url';

export const routes = {
    homePage: () => '/',

    catalogPage: () => '/catalog',

    categoryPage: (slug: string) => `/catalog/${slug}`,

    collectionPage: (slug: string) => `/collection/${slug}`,

    productPage: (slug: string) => `/product/${slug}`,

    favoritesPage: () => '/favorites',

    cartPage: () => '/cart',

    searchPage: (query?: string) => {
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
