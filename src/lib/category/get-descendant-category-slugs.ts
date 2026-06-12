import type { CategoryDto } from '@/services/category/category.types';

export function getDescendantCategorySlugs(
    categories: CategoryDto[],
    rootId: string,
): string[] {
    const childrenMap = new Map<string | null, CategoryDto[]>();

    for (const category of categories) {
        const children = childrenMap.get(category.parentId) ?? [];

        children.push(category);

        childrenMap.set(category.parentId, children);
    }

    const rootCategory = categories.find((category) => category.id === rootId);

    if (!rootCategory) {
        return [];
    }

    const result = [rootCategory.slug];

    const walk = (parentId: string) => {
        const children = childrenMap.get(parentId) ?? [];

        for (const child of children) {
            result.push(child.slug);
            walk(child.id);
        }
    };

    walk(rootId);

    return result;
}
