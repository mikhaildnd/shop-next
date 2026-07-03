import { PAGINATION_ISSUES } from '@/lib/pagination/consts';
import type { PaginationIssue } from '@/lib/pagination/types';

type ParsePageParamResult = {
    value?: number;
    issue?: PaginationIssue;
};

export function parsePageParam(value?: string): ParsePageParamResult {
    if (value === undefined) {
        return {};
    }

    const page = Number(value);

    if (!Number.isInteger(page) || page < 1) {
        return {
            issue: PAGINATION_ISSUES.INVALID_PAGE,
        };
    }

    return {
        value: page,
    };
}
