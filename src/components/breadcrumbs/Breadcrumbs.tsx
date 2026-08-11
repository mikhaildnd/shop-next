import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import type { BreadcrumbItem } from '@/lib/breadcrumbs/types';

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    // TODO мб вынести эту логику отображения в родителя
    if (items.length === 0) {
        return null;
    }

    return (
        <nav
            aria-label="Breadcrumb"
            className={className}
        >
            <ol className="flex items-center gap-2 text-xs whitespace-nowrap md:text-sm">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li
                            key={`${item.label}-${index}`}
                            className="flex items-center gap-2"
                        >
                            {isLast || !item.href ? (
                                <span
                                    aria-current="page"
                                    className="text-gray-500"
                                >
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="hover:text-primary transition-colors hover:underline"
                                >
                                    {item.label}
                                </Link>
                            )}

                            {!isLast && (
                                <ChevronRight
                                    aria-hidden="true"
                                    className="text-primary size-3 stroke-2"
                                />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
