import { routes } from '@/lib/routes';
import type { BreadcrumbItem } from '@/lib/breadcrumbs/types';
import type { CollectionDto } from '@/services/collection/collection.types';

type BuildCollectionBreadcrumbsParams = {
    collection: Pick<CollectionDto, 'slug' | 'title'>;
};

export function buildCollectionBreadcrumbs({
    collection,
}: BuildCollectionBreadcrumbsParams): BreadcrumbItem[] {
    return [
        {
            label: 'Главная',
            href: routes.home(),
        },
        {
            label: collection.title,
            href: routes.collection(collection.slug),
        },
    ];
}
