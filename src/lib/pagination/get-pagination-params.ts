import type {
    PaginationParams,
    PaginationSearchParams,
} from '@/lib/pagination/types';
import { PAGINATION_ISSUES, PAGINATION_VIEWS } from '@/lib/pagination/consts';
import { parsePageParam } from '@/lib/pagination/parse/parse-page-param';
import { parseViewParam } from '@/lib/pagination/parse/parse-view-param';
import { isDefined } from '@/utils/type-guards/is-defined';

type GetPaginationParamsOptions = {
    searchParams: PaginationSearchParams;
    limit: number;
};

export function getPaginationParams({
    searchParams,
    limit,
}: GetPaginationParamsOptions): PaginationParams {
    const currentPage = parsePageParam({
        value: searchParams.page,
        issue: PAGINATION_ISSUES.INVALID_PAGE,
    });

    const view = parseViewParam(searchParams.view);
    const isAppendMode = view.value === PAGINATION_VIEWS.APPEND;

    const fromPage = searchParams.from
        ? parsePageParam({
              value: searchParams.from,
              issue: PAGINATION_ISSUES.INVALID_FROM,
          })
        : undefined;

    const startPage = fromPage?.value ?? currentPage.value;

    const effectiveStartPage = Math.min(startPage, currentPage.value);

    const pagesToLoad = currentPage.value - effectiveStartPage + 1;
    const take = pagesToLoad * limit;
    const skip = (effectiveStartPage - 1) * limit;

    const collectedIssues = [currentPage.issue, view.issue, fromPage?.issue];

    if (!isAppendMode && fromPage !== undefined) {
        collectedIssues.push(PAGINATION_ISSUES.FROM_WITHOUT_APPEND);
    }

    const issues = [...new Set(collectedIssues.filter(isDefined))];

    return {
        currentPage: currentPage.value,
        startPage: effectiveStartPage,
        take,
        skip,
        issues,
    };
}
