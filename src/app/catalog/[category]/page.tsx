import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProducts } from '@/services/product.service';
import { getCategoryBySlug } from '@/services/category.service';
import { getCatalogPaginationParams } from '@/lib/pagination/get-catalog-pagination-params';
import { PRODUCTS_PER_PAGE } from '@/consts/pagination';
import type { CatalogSearchParams } from '@/types/catalog-search-params';
import CatalogEmpty from '@/components/catalog/CatalogEmpty';
import CatalogPage from '@/components/catalog/CatalogPage';

const LIMIT = PRODUCTS_PER_PAGE;

type PageProps = {
    params: Promise<{
        category: string;
    }>;

    searchParams: Promise<CatalogSearchParams>;
};

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { category: slug } = await params;

    const category = await getCategoryBySlug(slug);

    if (!category) {
        return {
            title: 'Категория не найдена',
        };
    }

    return {
        title: category.title,
        description: `Каталог | ${category.title}`,
    };
}

export default async function Page({ params, searchParams }: PageProps) {
    const [{ category: slug }, query] = await Promise.all([
        params,
        searchParams,
    ]);

    const category = await getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    const { currentPage, startPage, take, skip } = getCatalogPaginationParams({
        searchParams: query,
        limit: LIMIT,
    });

    const { products, totalCount } = await getProducts({
        take,
        skip,
        category: slug,
    });

    const totalPages = Math.ceil(totalCount / LIMIT);

    // Категория пустая
    if (totalCount === 0) {
        return (
            <CatalogEmpty
                title="Товары не найдены"
                description="Попробуйте открыть другую категорию"
            />
        );
    }

    // Страница не существует
    if (currentPage > totalPages) {
        notFound();
    }

    return (
        <CatalogPage
            products={products}
            currentPage={currentPage}
            totalPages={totalPages}
            startPage={startPage}
        />
    );
}
