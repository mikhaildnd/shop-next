import type { SearchParams } from '@/lib/url/types';

type UpdateSearchParamsType = {
    searchParams: SearchParams;
    params: Record<string, string | number | undefined>;
};

export function updateSearchParams({
    searchParams,
    params,
}: UpdateSearchParamsType) {
    const nextParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined) {
            nextParams.delete(key);
        } else {
            nextParams.set(key, String(value));
        }
    });

    nextParams.sort();

    const query = nextParams.toString();

    return query ? `?${query}` : '';
}
