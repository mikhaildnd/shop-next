import Image from 'next/image';
import Link from 'next/link';

import { routes } from '@/lib/routes';
import type { CategoryDto } from '@/services/category/category.types';

interface CatalogCategoryCardProps {
    category: CategoryDto;
}

export function CatalogCategoryCard({ category }: CatalogCategoryCardProps) {
    return (
        <li className="w-44">
            <Link
                href={routes.categoryPage(category.slug)}
                className="group block rounded-lg transition-colors focus-visible:ring-1 focus-visible:ring-(--color-primary) focus-visible:outline-none"
            >
                <div className="space-y-1">
                    <div className="relative aspect-[140/115] overflow-hidden rounded-lg bg-gray-50">
                        {category.image && (
                            <Image
                                quality={100}
                                src={category.image}
                                alt={category.title}
                                fill
                                sizes="176px"
                                className="object-contain transition-opacity group-hover:opacity-90 group-focus-visible:opacity-90"
                            />
                        )}
                    </div>

                    <p className="line-clamp-2 min-h-10 text-center text-sm font-medium transition-colors group-hover:text-(--color-primary) group-focus-visible:text-(--color-primary)">
                        {category.title}
                    </p>
                </div>
            </Link>
        </li>
    );
}
