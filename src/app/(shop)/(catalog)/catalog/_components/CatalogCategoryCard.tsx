import Image from 'next/image';
import Link from 'next/link';

import { routes } from '@/lib/routes';
import type { CategoryDto } from '@/services/category/category.types';

interface CatalogCategoryCardProps {
    category: CategoryDto;
}

export function CatalogCategoryCard({ category }: CatalogCategoryCardProps) {
    return (
        <Link
            href={routes.categoryPage(category.slug)}
            className="group flex h-full w-full flex-col rounded-lg transition-colors focus-visible:ring-1 focus-visible:ring-(--color-primary) focus-visible:outline-none"
        >
            <div className="relative mb-1 aspect-[140/115] w-full overflow-hidden rounded-lg bg-gray-50">
                {category.image && (
                    <Image
                        quality={100}
                        src={category.image}
                        alt={category.title}
                        fill
                        sizes="(max-width: 768px) 40vw, 160px"
                        className="object-contain transition-opacity group-hover:opacity-90 group-focus-visible:opacity-90"
                    />
                )}
            </div>

            <p className="line-clamp-2 text-center text-sm font-medium transition-colors group-hover:text-(--color-primary) group-focus-visible:text-(--color-primary)">
                {category.title}
            </p>
        </Link>
    );
}
