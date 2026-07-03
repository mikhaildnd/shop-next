import type { PAGINATION_ISSUES, PAGINATION_VIEWS } from '@/lib/pagination/consts';

export type PaginationView =
    (typeof PAGINATION_VIEWS)[keyof typeof PAGINATION_VIEWS];

export type PaginationSearchParams = {
    page?: string;
    view?: string;
    from?: string;
};

export type PaginationIssue =
    (typeof PAGINATION_ISSUES)[keyof typeof PAGINATION_ISSUES];

export type PaginationState = {
    currentPage: number;
    startPage: number;
    view: PaginationView;
};

export type PaginationParams = PaginationState & {
    take: number;
    skip: number;
    issues: PaginationIssue[];
};
