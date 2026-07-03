import Link from 'next/link';

import { routes } from '@/lib/routes';
import type { CategoryDto } from '@/services/category/category.types';
import { cn } from '@/utils/cn';

interface CategoryTagsProps {
    categories: CategoryDto[];
    className?: string;
}

export function CategoryTags({ categories, className }: CategoryTagsProps) {
    if (!categories.length) {
        return null;
    }

    return (
        <div className={cn('flex gap-2 pb-1 whitespace-nowrap', className)}>
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={routes.categoryPage(category.slug)}
                    className="inline-flex h-9 shrink-0 items-center rounded-full bg-neutral-100 px-4 text-sm font-medium whitespace-nowrap text-neutral-700 transition-colors hover:bg-neutral-200"
                >
                    {category.title}
                </Link>
            ))}
        </div>
    );
}
