import type { CategoryDto } from '@/services/category/category.types';

export interface CatalogSection {
    parentCategory: CategoryDto;
    childCategories: CategoryDto[];
}
