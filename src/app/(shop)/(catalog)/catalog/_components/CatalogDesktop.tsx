'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { CatalogCategoryCard } from '@/app/(shop)/(catalog)/catalog/_components/CatalogCategoryCard';
import type { CatalogSection } from '@/app/(shop)/(catalog)/catalog/lib/catalog.types';
import { routes } from '@/lib/routes';
import { cn } from '@/utils/cn';

interface CatalogDesktopProps {
    catalogSections: CatalogSection[];
    className?: string;
}

export function CatalogDesktop({
    catalogSections,
    className,
}: CatalogDesktopProps) {
    const initialGroup = catalogSections[0];

    const [activeGroup, setActiveGroup] = useState(initialGroup);
    const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(
        () => new Set(),
    );

    if (!initialGroup) {
        return null;
    }

    const toggleCategory = (categoryId: string) => {
        setExpandedCategoryIds((current) => {
            const next = new Set(current);

            if (next.has(categoryId)) {
                next.delete(categoryId);
            } else {
                next.add(categoryId);
            }

            return next;
        });
    };

    return (
        <div className={cn('grid grid-cols-[280px_1fr] gap-8', className)}>
            <aside>
                <ul>
                    {catalogSections.map((group) => {
                        const { parentCategory, childCategories } = group;

                        const expanded = expandedCategoryIds.has(
                            parentCategory.id,
                        );

                        return (
                            <li key={parentCategory.id}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        toggleCategory(parentCategory.id)
                                    }
                                    onMouseEnter={() => setActiveGroup(group)}
                                    onFocus={() => setActiveGroup(group)}
                                    aria-expanded={expanded}
                                    className={cn(
                                        'flex w-full cursor-pointer items-center justify-between rounded-md px-4 py-2 text-left transition-colors hover:bg-(--color-primary)/5 focus-visible:ring-1 focus-visible:ring-(--color-primary) focus-visible:outline-none',
                                        activeGroup.parentCategory.id ===
                                            parentCategory.id &&
                                            'bg-(--color-primary)/10 text-(--color-primary)',
                                    )}
                                >
                                    <span className="font-medium">
                                        {parentCategory.title}
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
                                                            setActiveGroup(
                                                                group,
                                                            )
                                                        }
                                                        onFocus={() =>
                                                            setActiveGroup(
                                                                group,
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
                <Link
                    className="mb-4 flex items-center gap-x-2"
                    href={routes.categoryPage(activeGroup.parentCategory.slug)}
                >
                    <h3 className="text-xl font-semibold">
                        {activeGroup.parentCategory.title}
                    </h3>

                    <ChevronRight
                        aria-hidden="true"
                        className="text-primary size-4 stroke-2"
                    />
                </Link>

                <ul className="grid grid-cols-[repeat(auto-fill,minmax(140px,160px))] gap-6">
                    {activeGroup.childCategories.map((category) => (
                        <li
                            // className="w-44"
                            key={category.id}
                        >
                            <CatalogCategoryCard category={category} />
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
