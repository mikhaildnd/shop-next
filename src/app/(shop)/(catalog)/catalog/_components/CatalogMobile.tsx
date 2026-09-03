import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { HorizontalScrollWrapper } from '@/app/(shop)/(catalog)/_components/wrappers/HorizontalScrollWrapper';
import { CatalogCategoryCard } from '@/app/(shop)/(catalog)/catalog/_components/CatalogCategoryCard';
import type { CatalogSection } from '@/app/(shop)/(catalog)/catalog/catalog.types';
import { cn } from '@/lib/cn';
import { routes } from '@/routes';

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
                            className="mb-4 flex items-center gap-x-2 transition-colors hover:text-(--color-primary)"
                            href={routes.categoryPage(parentCategory.slug)}
                        >
                            <h3 className="text-xl font-semibold">
                                {parentCategory.title}
                            </h3>

                            <ChevronRight
                                aria-hidden="true"
                                className="size-4 stroke-2"
                            />
                        </Link>

                        <HorizontalScrollWrapper>
                            <ul className="flex gap-4 pb-2">
                                {childCategories.map((category) => (
                                    <li
                                        key={category.id}
                                        className="w-32 shrink-0"
                                    >
                                        <CatalogCategoryCard
                                            category={category}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </HorizontalScrollWrapper>
                    </div>
                );
            })}
        </section>
    );
}
