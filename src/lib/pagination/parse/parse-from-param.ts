import type { PaginationIssue } from '@/lib/pagination/types';
import { PAGINATION_ISSUES } from '@/lib/pagination/consts';

type ParseFromParamResult = {
    value?: number;
    issue?: PaginationIssue;
};

export function parseFromParam(value?: string): ParseFromParamResult {
    if (value === undefined) {
        return {};
    }

    const page = Number(value);

    if (!Number.isInteger(page) || page < 1) {
        return {
            issue: PAGINATION_ISSUES.INVALID_FROM,
        };
    }

    return {
        value: page,
    };
}
