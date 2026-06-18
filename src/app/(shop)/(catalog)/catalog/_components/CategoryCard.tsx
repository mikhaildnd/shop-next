import Link from 'next/link';
import { routes } from '@/lib/routes';
import type { CategoryDto } from '@/services/category/category.types';

interface CategoryCardProps {
    category: CategoryDto;
    childCategories?: CategoryDto[];
}

export default function CategoryCard({
    category,
    childCategories,
}: CategoryCardProps) {
    return (
        <div className="flex flex-col rounded-2xl border border-gray-200 p-2">
            <h2 className="font-medium">
                <Link
                    href={routes.category(category.slug)}
                    className=""
                >
                    {category.title}
                </Link>
            </h2>

            {childCategories && childCategories.length > 0 && (
                <div className="">
                    {childCategories.map((child: CategoryDto) => (
                        <Link
                            key={child.id}
                            href={routes.category(child.slug)}
                            className="block"
                        >
                            {child.title}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
