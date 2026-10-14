import type { CategoryDto } from '@/services/category/category.types';

export function getCategoryPath(
    categories: CategoryDto[],
    categoryId: string,
): CategoryDto[] {
    const categoriesMap = new Map(
        categories.map((category) => [category.id, category]),
    );

    const path: CategoryDto[] = [];

    let current = categoriesMap.get(categoryId);

    while (current) {
        path.unshift(current);

        current = current.parentId
            ? categoriesMap.get(current.parentId)
            : undefined;
    }

    return path;
}
