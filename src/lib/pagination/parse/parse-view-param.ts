import type { PaginationIssue, PaginationView } from '@/lib/pagination/types';
import { PAGINATION_ISSUES, PAGINATION_VIEWS } from '@/lib/pagination/consts';

type ParseViewParamResult = {
    value?: PaginationView;
    issue?: PaginationIssue;
};

export function parseViewParam(value?: string): ParseViewParamResult {
    if (value === undefined) {
        return {};
    }

    if (
        value !== PAGINATION_VIEWS.SINGLE &&
        value !== PAGINATION_VIEWS.APPEND
    ) {
        return {
            issue: PAGINATION_ISSUES.INVALID_VIEW,
        };
    }

    return {
        value,
    };
}
