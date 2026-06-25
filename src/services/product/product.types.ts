import type { CollectionDto } from '@/services/collection/collection.types';
import type { CategoryDto } from '@/services/category/category.types';

export type MeasureType = 'GRAM' | 'MILLILITER' | 'PIECE';

export type ProductImageDto = {
    id: string;
    url: string;
    alt: string | null;
    sortOrder: number;
};

export type ProductCategoryDto = Pick<CategoryDto, 'id' | 'slug' | 'title'>;

export type ProductDto = {
    id: string;
    slug: string;
    title: string;
    description: string | null;

    regularPrice: number;
    salePrice: number | null;
    effectivePrice: number;
    discountPercent: number;

    ratingRate: number;
    ratingCount: number;

    stock: number;

    measureType: MeasureType;
    measureValue: number;

    ingredients: string[];

    images: ProductImageDto[];

    category: ProductCategoryDto | null;
    collections: CollectionDto[];

    createdAt: string;
    updatedAt: string;
};

export type ProductSeed = {
    slug: string;
    title: string;
    description: string | null;

    regularPrice: number;
    salePrice?: number | null;

    ratingRate: number;
    ratingCount: number;

    stock: number;

    measureType: MeasureType;
    measureValue: number;

    ingredients?: string[];

    images: string[];

    category: string;
    collections?: string[];
};

export type ProductFiltersMeta = {
    minPrice: number;
    maxPrice: number;
    totalProductsCount: number;
    availableDiscounts: number[];
};

export type ProductsResponse = {
    products: ProductDto[];
    filteredProductsCount: number;
    filtersMeta: ProductFiltersMeta;
};
