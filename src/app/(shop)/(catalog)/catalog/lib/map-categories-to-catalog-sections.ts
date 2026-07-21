import type { CatalogSection } from '@/app/(shop)/(catalog)/catalog/lib/catalog.types';
import type { CategoryDto } from '@/services/category/category.types';

export function mapCategoriesToCatalogSections(
    categories: CategoryDto[],
): CatalogSection[] {
    const childCategoriesByParentId = new Map<string, CategoryDto[]>();
    const parentCategories: CategoryDto[] = [];

    for (const category of categories) {
        if (category.parentId === null) {
            parentCategories.push(category);
            continue;
        }

        const childCategories =
            childCategoriesByParentId.get(category.parentId) ?? [];

        childCategories.push(category);

        childCategoriesByParentId.set(category.parentId, childCategories);
    }

    return parentCategories.map((parentCategory) => ({
        parentCategory,
        childCategories: childCategoriesByParentId.get(parentCategory.id) ?? [],
    }));
}
