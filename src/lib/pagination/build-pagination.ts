type PageItem = number | '...';

export function buildPagination(
    currentPage: number,
    totalPages: number,
): PageItem[] {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: PageItem[] = [];

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    pages.push(1);

    if (start > 2) {
        pages.push('...');
    }

    for (let page = start; page <= end; page++) {
        pages.push(page);
    }

    if (end < totalPages - 1) {
        pages.push('...');
    }

    pages.push(totalPages);

    return pages;
}
