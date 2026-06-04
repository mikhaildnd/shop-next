'use client';

import Link from 'next/link';
import { buildPagination } from '@/lib/pagination/build-pagination';
import { useSearchParams } from 'next/navigation';
import { createCatalogPageUrl } from '@/lib/url/create-catalog-url';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
};

export default function Pagination({
    currentPage,
    totalPages,
}: PaginationProps) {
    const searchParams = useSearchParams();
    const pages = buildPagination(currentPage, totalPages);

    return (
        <nav className="flex items-center gap-2">
            <Link
                href={createCatalogPageUrl({
                    searchParams,
                    page: currentPage - 1,
                })}
                aria-disabled={currentPage === 1}
                className={`border border-(--color-primary) px-3 py-2 text-(--color-primary) transition-colors ${
                    currentPage === 1
                        ? 'pointer-events-none opacity-50'
                        : 'hover:bg-(--color-primary) hover:text-white'
                }`}
            >
                ←
            </Link>

            {pages.map((page, index) => {
                if (page === '...') {
                    return (
                        <span
                            key={`dots-${index}`}
                            className="px-2 text-(--color-primary)"
                        >
                            ...
                        </span>
                    );
                }

                const isActive = currentPage === page;

                return (
                    <Link
                        key={page}
                        href={createCatalogPageUrl({
                            searchParams,
                            page,
                        })}
                        className={`border border-(--color-primary) px-4 py-2 transition-colors ${
                            isActive
                                ? 'bg-(--color-primary) text-white'
                                : 'text-(--color-primary) hover:bg-(--color-primary) hover:text-white'
                        }`}
                    >
                        {page}
                    </Link>
                );
            })}

            <Link
                href={createCatalogPageUrl({
                    searchParams,
                    page: currentPage + 1,
                })}
                aria-disabled={currentPage === totalPages}
                className={`border border-(--color-primary) px-3 py-2 text-(--color-primary) transition-colors ${
                    currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'hover:bg-(--color-primary) hover:text-white'
                }`}
            >
                →
            </Link>
        </nav>
    );
}
