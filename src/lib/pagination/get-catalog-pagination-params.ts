import type { CatalogSearchParams } from '@/types/catalog-search-params';
import { parsePageParam } from '@/utils/parsePageParam';

type GetPaginationParamsOptions = {
    searchParams: CatalogSearchParams;
    limit: number;
};

export function getCatalogPaginationParams({
    searchParams,
    limit,
}: GetPaginationParamsOptions) {
    const currentPage = parsePageParam(searchParams.page);

    const isAppendMode = searchParams.view === 'append';

    const startPage = isAppendMode
        ? parsePageParam(searchParams.from)
        : currentPage;

    const normalizedStartPage =
        startPage > currentPage ? currentPage : startPage;

    const pagesToLoad = currentPage - normalizedStartPage + 1;

    const take = pagesToLoad * limit;

    const skip = (normalizedStartPage - 1) * limit;

    return {
        currentPage,
        startPage,
        take,
        skip,
    };
}
