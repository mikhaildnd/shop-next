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

    profilePage: () => '/profile',

    signInPage: () => '/auth/sign-in',

    changeEmailPage: () => '/auth/change-email',

    changeEmailVerifyPage: () => '/auth/change-email/verify',

    signUpPage: () => '/auth/sign-up',

    verifyEmailPage: () => '/auth/verify-email',

    passwordResetPage: () => '/auth/password-reset',

    passwordResetVerifyPage: () => '/auth/password-reset/verify',

    passwordSetPage: () => '/auth/password-reset/set-password',

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
