import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { CatalogCategoryCard } from '@/app/(shop)/(catalog)/catalog/_components/CatalogCategoryCard';
import type { CatalogSection } from '@/app/(shop)/(catalog)/catalog/lib/catalog.types';
import { routes } from '@/lib/routes';
import { cn } from '@/utils/cn';

interface CatalogMobileProps {
    catalogSections: CatalogSection[];
    className?: string;
}

export function CatalogMobile({
    catalogSections,
    className,
}: CatalogMobileProps) {
    return (
        <section className={cn('flex flex-col gap-y-6', className)}>
            {catalogSections.map(({ parentCategory, childCategories }) => {
                return (
                    <div key={parentCategory.id}>
                        <Link
                            className="mb-4 flex items-center gap-x-2"
                            href={routes.categoryPage(parentCategory.slug)}
                            key={parentCategory.id}
                        >
                            <h3 className="text-xl font-semibold">
                                {parentCategory.title}
                            </h3>

                            <ChevronRight
                                aria-hidden="true"
                                className="text-primary size-4 stroke-2"
                            />
                        </Link>

                        <ul className="flex gap-4 overflow-x-auto pb-2">
                            {childCategories.map((category) => (
                                <li
                                    key={category.id}
                                    className="w-32 shrink-0"
                                >
                                    <CatalogCategoryCard category={category} />
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </section>
    );
}
