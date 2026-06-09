import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProducts } from '@/services/product/product.service';
import {
    getCategoryBySlug,
    getCategories,
} from '@/services/category/category.service';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import { PRODUCTS_PER_PAGE } from '@/consts/pagination';
import type { PaginationSearchParams } from '@/lib/pagination/types';
import ProductsListEmpty from '@/app/(shop)/(catalog)/_components/ProductsListEmpty';
import ProductsListContent from '@/app/(shop)/(catalog)/_components/ProductsListContent';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';
import { buildCatalogBreadcrumbs } from '@/lib/breadcrumbs/buildCatalogBreadcrumbs';
import { routes } from '@/lib/routes';
import { getDescendantCategorySlugs } from '@/lib/category/get-descendant-category-slugs';
import { getCategoryPath } from '@/lib/category/get-category-path';
import { getChildCategories } from '@/lib/category/get-child-categories';
import CategoryTags from '@/components/shared/CategoryTags';
import HorizontalScrollWrapper from '@/components/shared/HorizontalSrollWrapper';

const LIMIT = PRODUCTS_PER_PAGE;

type PageProps = {
    params: Promise<{
        categorySlug: string;
    }>;

    searchParams: Promise<PaginationSearchParams>;
};

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { categorySlug: slug } = await params;

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
    const [{ categorySlug: slug }, query] = await Promise.all([
        params,
        searchParams,
    ]);

    const categories = await getCategories();

    const category = categories.find((category) => category.slug === slug);

    // Страница не существует
    if (!category) {
        notFound();
    }

    const categoryPath = getCategoryPath(categories, category.id);

    const categorySlugs = getDescendantCategorySlugs(categories, category.id);

    const childCategories = getChildCategories(categories, category.id);

    const { currentPage, startPage, take, skip } = getPaginationParams({
        searchParams: query,
        limit: LIMIT,
    });

    const { products, totalCount } = await getProducts({
        take,
        skip,
        categorySlugs,
    });

    const totalPages = Math.ceil(totalCount / LIMIT);

    // Страница не существует
    if (currentPage > totalPages) {
        notFound();
    }

    const breadcrumbs = buildCatalogBreadcrumbs({
        categoryPath,
    });

    return (
        <div className="page-spacing">
            <HorizontalScrollWrapper>
                <Breadcrumbs
                    items={breadcrumbs}
                    className="py-4"
                />
            </HorizontalScrollWrapper>
            <HorizontalScrollWrapper className="mb-3">
                <CategoryTags categories={childCategories} />
            </HorizontalScrollWrapper>
            {totalCount === 0 ? (
                <ProductsListEmpty
                    title="Товары не найдены"
                    description="Попробуйте открыть другую категорию"
                />
            ) : (
                <ProductsListContent
                    products={products}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    startPage={startPage}
                    getProductHref={(product) =>
                        routes.productInCategory(product.slug, slug)
                    }
                />
            )}
        </div>
    );
}
