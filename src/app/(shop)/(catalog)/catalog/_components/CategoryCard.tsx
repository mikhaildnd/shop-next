import Link from 'next/link';

import { routes } from '@/lib/routes';
import type { CategoryDto } from '@/services/category/category.types';

interface CategoryCardProps {
    category: CategoryDto;
    childCategories?: CategoryDto[];
}

export function CategoryCard({ category, childCategories }: CategoryCardProps) {
    const linkStyles =
        'block px-5 py-1 transition-colors duration-100 hover:text-(--color-primary) focus:text-(--color-primary)';

    return (
        <div className="flex flex-col rounded-2xl border border-(--color-primary) bg-white py-3">
            <h2 className="font-semibold">
                <Link
                    href={routes.categoryPage(category.slug)}
                    className={linkStyles}
                >
                    {category.title}
                </Link>
            </h2>

            {childCategories && childCategories.length > 0 && (
                <ul className="flex flex-col">
                    {childCategories.map((child: CategoryDto) => (
                        <li key={child.id}>
                            <Link
                                href={routes.categoryPage(child.slug)}
                                className={linkStyles}
                            >
                                {child.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
