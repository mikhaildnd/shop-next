export const PAGINATION_VIEWS = {
    // `SINGLE` is the default mode and is not serialized to the URL.
    SINGLE: 'single',
    APPEND: 'append',
} as const;

export const PAGINATION_ISSUES = {
    INVALID_PAGE: 'invalid-page',
    INVALID_FROM: 'invalid-from',
    INVALID_VIEW: 'invalid-view',
    FROM_WITHOUT_APPEND: 'from-without-append',
} as const;
