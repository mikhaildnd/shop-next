import type {
    PaginationIssue,
    PaginationParams,
    PaginationSearchParams,
} from '@/lib/pagination/types';
import { PAGINATION_ISSUES, PAGINATION_VIEWS } from '@/lib/pagination/consts';
import { parsePageParam } from '@/lib/pagination/parse/parse-page-param';
import { parseViewParam } from '@/lib/pagination/parse/parse-view-param';
import { isDefined } from '@/utils/type-guards/is-defined';
import { parseFromParam } from '@/lib/pagination/parse/parse-from-param';

type GetPaginationParamsOptions = {
    searchParams: PaginationSearchParams;
    limit: number;
};

export function getPaginationParams({
    searchParams,
    limit,
}: GetPaginationParamsOptions): PaginationParams {
    const page = parsePageParam(searchParams.page);
    const view = parseViewParam(searchParams.view);
    const fromPage = parseFromParam(searchParams.from);

    const collectedIssues: PaginationIssue[] = [];

    if (page.issue) {
        collectedIssues.push(page.issue);
    }

    if (fromPage.issue) {
        collectedIssues.push(fromPage.issue);
    }

    if (view.issue) {
        collectedIssues.push(view.issue);
    }

    const currentPage = page.value ?? 1;

    const viewMode = view.value ?? PAGINATION_VIEWS.SINGLE;
    const isAppendMode = viewMode === PAGINATION_VIEWS.APPEND;

    const startPage = fromPage.value ?? currentPage;

    const hasFromAfterPage = startPage > currentPage;

    if (fromPage.value !== undefined && !isAppendMode) {
        collectedIssues.push(PAGINATION_ISSUES.FROM_WITHOUT_APPEND);
    }

    if (hasFromAfterPage) {
        collectedIssues.push(PAGINATION_ISSUES.FROM_GREATER_THAN_PAGE);
    }

    const issues = [...new Set(collectedIssues.filter(isDefined))];

    const pagesToLoad = Math.max(0, currentPage - startPage + 1);

    const take = pagesToLoad * limit;
    const skip = Math.max(0, (startPage - 1) * limit);

    return {
        currentPage,
        startPage,
        view: viewMode,
        take,
        skip,
        issues,
    };
}
