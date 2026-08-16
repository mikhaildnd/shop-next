import type { ProductListingIssue } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import type { PaginationIssue } from '@/lib/pagination/pagination.types';

export type IssueMessage = {
    title: string;
    description: string;
};

export type PaginationIssueGroup = {
    issues: readonly PaginationIssue[];
    message: IssueMessage;
};

export type ProductListingIssueGroup = {
    issues: readonly ProductListingIssue[];
    message: IssueMessage;
};
