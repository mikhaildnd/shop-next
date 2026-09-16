import { CatalogPageLayout } from '@/app/(shop)/(catalog)/_components/CatalogPageLayout';
import type { ProductListingSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { SearchPageContent } from '@/app/(shop)/(catalog)/search/_components/SearchPageContent';
import type { BreadcrumbItem } from '@/components/breadcrumbs/breadcrumbs.types';
import { routes } from '@/routes';

interface SearchPageProps {
    searchParams: Promise<ProductListingSearchParams>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            label: 'Главная',
            href: routes.homePage(),
        },
        {
            label: 'Поиск',
        },
    ];

    return (
        <CatalogPageLayout
            title="Результаты поиска"
            breadcrumbs={breadcrumbs}
        >
            <SearchPageContent params={params} />
        </CatalogPageLayout>
    );
}
