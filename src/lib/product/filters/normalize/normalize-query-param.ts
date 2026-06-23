export function normalizeQueryParam(value?: string): string | null {
    const query = value?.trim();

    return query ? query : null;
}
