import type { SearchHistoryItem } from '@/lib/search/search-history.types';
import type { CategoryDto } from '@/services/category/category.types';
import type { ProductDto } from '@/services/product/product.types';

export function createQueryHistoryItem(query: string): SearchHistoryItem {
    return {
        type: 'query',
        query,
    };
}

export function createCategoryHistoryItem(
    category: Pick<CategoryDto, 'title' | 'slug'>,
): SearchHistoryItem {
    return {
        type: 'category',
        title: category.title,
        slug: category.slug,
    };
}

export function createProductHistoryItem(
    product: Pick<ProductDto, 'title' | 'slug' | 'images'>,
): SearchHistoryItem {
    return {
        type: 'product',
        title: product.title,
        slug: product.slug,
        thumbnail: product.images[0]?.url ?? null,
    };
}
