'use client';

import Link from 'next/link';
import { buildPagination } from '@/lib/pagination/build-pagination';
import { usePathname, useSearchParams } from 'next/navigation';
import { createPaginationUrl } from '@/lib/pagination/create-pagination-url';
import { cn } from '@/utils/cn';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
};

export default function Pagination({
    currentPage,
    totalPages,
}: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const pages = buildPagination(currentPage, totalPages);

    const baseStyles =
        'border border-(--color-primary) size-10 transition-colors flex items-center justify-center text-(--color-primary)';
    const disabledStyles = 'opacity-50 select-none';
    const activeStyles = 'bg-(--color-primary) text-white select-none';
    const hoverStyles = 'hover:bg-(--color-primary) hover:text-white';

    return (
        <nav className="flex items-center gap-2">
            {currentPage === 1 ? (
                <span className={cn(baseStyles, disabledStyles)}>←</span>
            ) : (
                <Link
                    href={createPaginationUrl({
                        pathname,
                        searchParams,
                        page: currentPage - 1,
                    })}
                    className={cn(baseStyles, hoverStyles)}
                >
                    ←
                </Link>
            )}

            {pages.map((page, index) => {
                if (page === '...') {
                    return (
                        <span
                            key={`dots-${index}`}
                            className="px-2 text-(--color-primary) select-none"
                        >
                            ...
                        </span>
                    );
                }

                const isActive = currentPage === page;

                if (isActive) {
                    return (
                        <span
                            key={page}
                            className={cn(baseStyles, activeStyles)}
                            aria-current="page"
                        >
                            {page}
                        </span>
                    );
                }

                return (
                    <Link
                        key={page}
                        href={createPaginationUrl({
                            pathname,
                            searchParams,
                            page,
                        })}
                        className={cn(baseStyles, hoverStyles)}
                    >
                        {page}
                    </Link>
                );
            })}

            {currentPage === totalPages ? (
                <span className={cn(baseStyles, disabledStyles)}>→</span>
            ) : (
                <Link
                    href={createPaginationUrl({
                        pathname,
                        searchParams,
                        page: currentPage + 1,
                    })}
                    className={cn(baseStyles, hoverStyles)}
                >
                    →
                </Link>
            )}
        </nav>
    );
}
