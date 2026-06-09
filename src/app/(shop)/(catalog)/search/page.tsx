import { notFound } from 'next/navigation';
import { PRODUCTS_PER_PAGE } from '@/consts/pagination';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import { searchProducts } from '@/services/search/search-products.service';
import ProductsListContent from '@/app/(shop)/(catalog)/_components/ProductsListContent';
import ProductsListEmpty from '@/app/(shop)/(catalog)/_components/ProductsListEmpty';
import { routes } from '@/lib/routes';

// TODO metadata

const LIMIT = PRODUCTS_PER_PAGE;

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
        page?: string;
    }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const query = await searchParams;

    const searchQuery = query.q?.trim() ?? '';

    if (searchQuery.length < 2) {
        return (
            <ProductsListEmpty
                title="Введите поисковый запрос"
                description="Минимум 2 символа"
            />
        );
    }

    const { currentPage, startPage, take, skip } = getPaginationParams({
        searchParams: query,
        limit: LIMIT,
    });

    const { products, totalCount } = await searchProducts({
        query: searchQuery,
        take,
        skip,
    });

    if (totalCount === 0) {
        return (
            <ProductsListEmpty
                title="Товары не найдены"
                description={`По запросу "${searchQuery}" ничего не найдено`}
            />
        );
    }

    const totalPages = Math.ceil(totalCount / LIMIT);

    if (currentPage > totalPages) {
        notFound();
    }

    return (
        <div className="page-spacing">
            <h1 className="mb-6 text-2xl font-bold">
                Результаты поиска: "{searchQuery}"
            </h1>

            <p className="text-muted-foreground mb-6">
                Найдено товаров: {totalCount}
            </p>

            <ProductsListContent
                products={products}
                currentPage={currentPage}
                totalPages={totalPages}
                startPage={startPage}
                getProductHref={(product) => routes.product(product.slug)}
            />
        </div>
    );
}
