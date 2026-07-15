import Link from 'next/link';

import { routes } from '@/lib/routes';
import type { ProductCategoryDto } from '@/services/product/product.types';

interface SearchCategoriesProps {
    categories: ProductCategoryDto[];
    onSelect: (category: ProductCategoryDto) => void;
}

export function SearchCategories({
    categories,
    onSelect,
}: SearchCategoriesProps) {
    if (!categories.length) {
        return null;
    }

    return (
        <section className="border-b border-gray-100 p-3">
            <h2 className="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Категории
            </h2>

            <ul className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <li key={category.id}>
                        <Link
                            onClick={() => onSelect(category)}
                            href={routes.categoryPage(category.slug)}
                            className="rounded-full bg-gray-100 px-3 py-1 text-sm transition-colors hover:bg-gray-200 focus-visible:bg-gray-200 focus-visible:ring-1 focus-visible:ring-(--color-primary) focus-visible:outline-none"
                        >
                            {category.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
