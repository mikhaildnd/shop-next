export function normalizePriceParam(value?: string): number | null {
    if (!value) {
        return null;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed)) {
        return null;
    }

    if (parsed <= 0) {
        return null;
    }

    return parsed;
}
