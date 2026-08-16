import type {
    IssueMessage,
    PaginationIssueGroup,
    ProductListingIssueGroup,
} from '@/app/(shop)/(catalog)/_components/page-issues/page-issues.types';
import {
    PRODUCT_FILTER_LISTING_ISSUES,
    PRODUCT_SORT_LISTING_ISSUES,
} from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import { PAGINATION_ISSUES } from '@/lib/pagination/pagination.constants';

const INVALID_PAGINATION_MESSAGE = {
    title: 'Некорректный параметр страницы',
    description: 'Запрошенная страница не может быть отображена',
} satisfies IssueMessage;

const INVALID_SORT_MESSAGE = {
    title: 'Некорректная сортировка',
    description: 'Указан неподдерживаемый способ сортировки',
} satisfies IssueMessage;

const INVALID_FILTER_MESSAGE = {
    title: 'Некорректные параметры фильтрации',
    description: 'Некоторые параметры фильтрации имеют недопустимые значения',
} satisfies IssueMessage;

export const PAGINATION_ISSUE_GROUPS = [
    {
        issues: [
            PAGINATION_ISSUES.INVALID_PAGE,
            PAGINATION_ISSUES.FROM_GREATER_THAN_PAGE,
            PAGINATION_ISSUES.INVALID_FROM,
            PAGINATION_ISSUES.INVALID_VIEW,
            PAGINATION_ISSUES.FROM_WITHOUT_APPEND,
        ],
        message: INVALID_PAGINATION_MESSAGE,
    },
] satisfies readonly PaginationIssueGroup[];

export const PRODUCT_LISTING_ISSUE_GROUPS = [
    {
        issues: [PRODUCT_SORT_LISTING_ISSUES.INVALID_SORT],
        message: INVALID_SORT_MESSAGE,
    },
    {
        issues: [
            PRODUCT_FILTER_LISTING_ISSUES.INVALID_SALE,
            PRODUCT_FILTER_LISTING_ISSUES.INVALID_DISCOUNT,
            PRODUCT_FILTER_LISTING_ISSUES.INVALID_PRICE_FROM,
            PRODUCT_FILTER_LISTING_ISSUES.INVALID_PRICE_TO,
            PRODUCT_FILTER_LISTING_ISSUES.INVALID_IN_STOCK,
        ],
        message: INVALID_FILTER_MESSAGE,
    },
] satisfies readonly ProductListingIssueGroup[];
