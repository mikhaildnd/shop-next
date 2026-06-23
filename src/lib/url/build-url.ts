type BuildUrlParams = {
    pathname: string;
    params?: Record<string, string | number | boolean | undefined>;
};

export function buildUrl({ pathname, params = {} }: BuildUrlParams) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
            searchParams.set(key, String(value));
        }
    });

    const query = searchParams.toString();

    return query ? `${pathname}?${query}` : pathname;
}
