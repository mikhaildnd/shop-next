import type { CategoryDto } from '@/services/category/category.types';

export function getChildCategories(
    categories: CategoryDto[],
    parentId: string,
): CategoryDto[] {
    return categories.filter((category) => category.parentId === parentId);
}
