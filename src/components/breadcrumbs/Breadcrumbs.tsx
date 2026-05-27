import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export type BreadcrumbItem = {
    label: string;
    href?: string;
};

type BreadcrumbsProps = {
    items: BreadcrumbItem[];
    className?: string;
};

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <nav
            aria-label="Breadcrumb"
            className={className}
        >
            <ol className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
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
                                    className="text-primary h-4 w-4 stroke-[2px]"
                                />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
