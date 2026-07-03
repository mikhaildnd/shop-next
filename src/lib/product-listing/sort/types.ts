import type {
    PRODUCT_SORT_LISTING_ISSUES,
    PRODUCT_SORTS,
} from '@/lib/product-listing/sort/consts';

export type ProductSort = (typeof PRODUCT_SORTS)[number];

export type ProductSortListingIssue =
    (typeof PRODUCT_SORT_LISTING_ISSUES)[keyof typeof PRODUCT_SORT_LISTING_ISSUES];
