import { PAGINATION_ISSUES } from '@/lib/pagination/consts';

export type PaginationView = 'single' | 'append';

export type PaginationSearchParams = {
    page?: string;
    view?: string;
    from?: string;
};

export type PaginationIssue =
    (typeof PAGINATION_ISSUES)[keyof typeof PAGINATION_ISSUES];

export interface PaginationParams {
    currentPage: number;
    startPage: number;
    take: number;
    skip: number;
    issues: PaginationIssue[];
}
