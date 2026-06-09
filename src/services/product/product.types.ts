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

    basePrice: number;
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

export type ProductSeed = Omit<
    ProductDto,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'images'
    | 'category'
    | 'collections'
    | 'basePrice'
    | 'ratingRate'
    | 'measureValue'
    | 'discountPercent'
    | 'ingredients'
> & {
    images: string[];
    category: string; // category slug
    collections?: string[]; // collection slugs
    basePrice: number;
    ratingRate: number;
    measureValue: number;
    discountPercent?: number;
    ingredients?: string[];
};

export type ProductsResponse = {
    products: ProductDto[];
    totalCount: number;
};
