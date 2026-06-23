import { notFound } from 'next/navigation';
import { PRODUCTS_PER_PAGE } from '@/consts/pagination';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import ProductsListContent from '@/app/(shop)/(catalog)/_components/ProductsListContent';
import ProductsListEmpty from '@/app/(shop)/(catalog)/_components/ProductsListEmpty';
import { routes } from '@/lib/routes';
import { SEARCH_QUERY_PARAM } from '@/lib/search/consts';
import { normalizeSearchQuery } from '@/lib/search/normalize-search-query';
import { getProducts } from '@/services/product/product.service';
import ProductListingLayout from '@/app/(shop)/(catalog)/_components/ProductListingLayout';
import { buildSearchBreadcrumbs } from '@/lib/breadcrumbs/buildSearchBreadcrumbs';
import type { ProductSearchParams } from '@/lib/product/types';

const LIMIT = PRODUCTS_PER_PAGE;

interface SearchPageProps {
    searchParams: Promise<ProductSearchParams>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const state = normalizeSearchQuery(params[SEARCH_QUERY_PARAM]);

    if (state.status === 'empty') {
        return (
            <ProductsListEmpty
                title="Не указана строка поиска"
                description="Введите название товара или категории"
            />
        );
    }

    if (state.status === 'too-short') {
        return (
            <ProductsListEmpty
                title="Слишком короткий запрос"
                description="Минимум 2 символа"
            />
        );
    }

    const { currentPage, startPage, take, skip } = getPaginationParams({
        searchParams: params,
        limit: LIMIT,
    });

    const { products, filteredProductsCount, filtersMeta } = await getProducts({
        searchParams: params,
        take,
        skip,
    });

    const totalPages = Math.max(1, Math.ceil(filteredProductsCount / LIMIT));

    if (currentPage > totalPages) {
        notFound();
    }

    const breadcrumbs = buildSearchBreadcrumbs();

    return (
        <ProductListingLayout
            filtersMeta={filtersMeta}
            filteredProductsCount={filteredProductsCount}
            title="Результаты поиска"
            breadcrumbs={breadcrumbs}
        >
            {filteredProductsCount === 0 ? (
                <ProductsListEmpty
                    title="Товары не найдены"
                    description={`По запросу "${state.query}" ничего не найдено`}
                />
            ) : (
                <ProductsListContent
                    products={products}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    startPage={startPage}
                    getProductHref={(product) =>
                        routes.productPage(product.slug)
                    }
                />
            )}
        </ProductListingLayout>
    );
}
