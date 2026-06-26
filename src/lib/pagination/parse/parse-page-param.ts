import type { PaginationIssue } from '@/lib/pagination/types';

interface ParsePageParamOptions {
    value?: string;
    issue: PaginationIssue;
}

interface ParsePageParamResult {
    value: number;
    issue?: PaginationIssue;
}

export function parsePageParam({
    value,
    issue,
}: ParsePageParamOptions): ParsePageParamResult {
    if (value === undefined) {
        return {
            value: 1,
        };
    }

    const page = Number(value);

    if (!Number.isInteger(page) || page < 1) {
        return {
            value: 1,
            issue,
        };
    }

    return {
        value: page,
    };
}
