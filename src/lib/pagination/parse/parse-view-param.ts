import type { PaginationIssue, PaginationView } from '@/lib/pagination/types';
import { PAGINATION_ISSUES, PAGINATION_VIEWS } from '@/lib/pagination/consts';

export interface ParseViewParamResult {
    value: PaginationView;
    issue?: PaginationIssue;
}

export function parseViewParam(
    value: string | undefined,
): ParseViewParamResult {
    if (value === undefined) {
        return {
            value: PAGINATION_VIEWS.SINGLE,
        };
    }

    if (value === PAGINATION_VIEWS.APPEND) {
        return {
            value: PAGINATION_VIEWS.APPEND,
        };
    }

    return {
        value: PAGINATION_VIEWS.SINGLE,
        issue: PAGINATION_ISSUES.INVALID_VIEW,
    };
}
