'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { CatalogCategoryCard } from '@/app/(shop)/(catalog)/catalog/_components/CatalogCategoryCard';
import { routes } from '@/lib/routes';
import type { CategoryDto } from '@/services/category/category.types';
import { cn } from '@/utils/cn';

interface CatalogLayoutProps {
    categories: CategoryDto[];
}

type CategoryGroup = {
    category: CategoryDto;
    childCategories: CategoryDto[];
};

function buildCategoryGroups(categories: CategoryDto[]): CategoryGroup[] {
    const childCategoriesByParentId = new Map<string, CategoryDto[]>();

    for (const category of categories) {
        if (!category.parentId) {
            continue;
        }

        const childCategories =
            childCategoriesByParentId.get(category.parentId) ?? [];

        childCategories.push(category);

        childCategoriesByParentId.set(category.parentId, childCategories);
    }

    return categories
        .filter((category) => category.parentId === null)
        .map((category) => ({
            category,
            childCategories: childCategoriesByParentId.get(category.id) ?? [],
        }));
}

export function CatalogLayout({ categories }: CatalogLayoutProps) {
    const categoryGroups = useMemo(
        () => buildCategoryGroups(categories),
        [categories],
    );

    const [activeCategoryId, setActiveCategoryId] = useState(
        categoryGroups[0]?.category.id ?? null,
    );

    const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(
        () => new Set(),
    );

    const activeGroup =
        categoryGroups.find(
            ({ category }) => category.id === activeCategoryId,
        ) ?? null;

    function toggleCategory(categoryId: string) {
        setExpandedCategoryIds((current) => {
            const next = new Set(current);

            if (next.has(categoryId)) {
                next.delete(categoryId);
            } else {
                next.add(categoryId);
            }

            return next;
        });
    }

    return (
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside>
                <ul>
                    {categoryGroups.map(({ category, childCategories }) => {
                        const expanded = expandedCategoryIds.has(category.id);

                        return (
                            <li key={category.id}>
                                <button
                                    type="button"
                                    onClick={() => toggleCategory(category.id)}
                                    onMouseEnter={() =>
                                        setActiveCategoryId(category.id)
                                    }
                                    onFocus={() =>
                                        setActiveCategoryId(category.id)
                                    }
                                    aria-expanded={expanded}
                                    className={cn(
                                        'flex w-full cursor-pointer items-center justify-between rounded-md px-4 py-2 text-left transition-colors hover:bg-(--color-primary)/5 focus-visible:ring-1 focus-visible:ring-(--color-primary) focus-visible:outline-none',
                                        activeCategoryId === category.id &&
                                            'bg-(--color-primary)/10 text-(--color-primary)',
                                    )}
                                >
                                    <span className="font-medium">
                                        {category.title}
                                    </span>

                                    <ChevronDown
                                        aria-hidden="true"
                                        className={cn(
                                            'size-4 shrink-0 transition-transform duration-200',
                                            expanded && 'rotate-180',
                                        )}
                                    />
                                </button>

                                {expanded && (
                                    <ul className="mb-2 ml-2">
                                        {childCategories.map(
                                            (childCategory) => (
                                                <li key={childCategory.id}>
                                                    <Link
                                                        href={routes.categoryPage(
                                                            childCategory.slug,
                                                        )}
                                                        className={cn(
                                                            'block rounded-md px-4 py-2 text-sm text-gray-600 transition-colors',
                                                            'hover:bg-(--color-primary)/5 hover:text-(--color-primary)',
                                                            'focus-visible:bg-(--color-primary)/5',
                                                            'focus-visible:text-(--color-primary)',
                                                            'focus-visible:ring-1 focus-visible:ring-(--color-primary)',
                                                            'focus-visible:outline-none',
                                                        )}
                                                        onMouseEnter={() =>
                                                            setActiveCategoryId(
                                                                category.id,
                                                            )
                                                        }
                                                        onFocus={() =>
                                                            setActiveCategoryId(
                                                                category.id,
                                                            )
                                                        }
                                                    >
                                                        {childCategory.title}
                                                    </Link>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </aside>

            <section>
                <h3 className="mb-4 text-xl font-semibold">
                    {activeGroup?.category.title}
                </h3>

                <ul className="flex flex-wrap gap-2">
                    {activeGroup?.childCategories.map((category) => (
                        <CatalogCategoryCard
                            key={category.id}
                            category={category}
                        />
                    ))}
                </ul>
            </section>
        </div>
    );
}
