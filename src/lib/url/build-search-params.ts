import type { SearchParams } from '@/lib/url/types';

type BuildSearchParamsType = {
    searchParams?: SearchParams;
    params: Record<string, string | number | undefined>;
};

export function buildSearchParams({
    searchParams = new URLSearchParams(),
    params,
}: BuildSearchParamsType) {
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
