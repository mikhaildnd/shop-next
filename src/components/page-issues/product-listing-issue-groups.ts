import { PRODUCT_FILTER_LISTING_ISSUES } from '@/lib/product-listing/filters/consts';
import { PRODUCT_SORT_LISTING_ISSUES } from '@/lib/product-listing/sort/consts';
import type { ProductListingIssue } from '@/lib/product-listing/types';

type IssueMessage = {
    title: string;
    description: string;
};

type ProductListingIssueGroup = {
    issues: readonly ProductListingIssue[];
    message: IssueMessage;
};

const INVALID_SORT_MESSAGE = {
    title: 'Некорректная сортировка',
    description: 'Указан неподдерживаемый способ сортировки',
} satisfies IssueMessage;

const INVALID_FILTER_MESSAGE = {
    title: 'Некорректные параметры фильтрации',
    description: 'Некоторые параметры фильтрации имеют недопустимые значения',
} satisfies IssueMessage;

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
