import Link from 'next/link';

import { routes } from '@/lib/routes';
import type { ProductCategoryDto } from '@/services/product/product.types';

interface SearchCategoriesProps {
    categories: ProductCategoryDto[];
    onClose: () => void;
}

export function SearchCategories({
    categories,
    onClose,
}: SearchCategoriesProps) {
    if (!categories.length) {
        return null;
    }

    return (
        <section className="border-b border-gray-100 p-3">
            <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Категории
            </h2>

            <ul className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <li key={category.id}>
                        <Link
                            onClick={onClose}
                            href={routes.categoryPage(category.slug)}
                            className="rounded-full bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                        >
                            {category.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
