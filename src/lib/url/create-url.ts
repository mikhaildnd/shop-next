import type { SearchParams } from '@/lib/url/types';

type CreateUrlParams = {
    searchParams: SearchParams;
    params: Record<string, string | number | undefined>;
};

export function createUrl({ searchParams, params }: CreateUrlParams) {
    const nextParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined) {
            nextParams.delete(key);
        } else {
            nextParams.set(key, String(value));
        }
    });

    return `?${nextParams.toString()}`;
}
