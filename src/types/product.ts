export type MeasureType = 'GRAM' | 'MILLILITER' | 'PIECE';

export type ProductImageDto = {
    id: string;
    url: string;
    alt: string | null;
    sortOrder: number;
};

export type ProductCategoryDto = {
    id: string;
    slug: string;
    title: string;
};

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

    categories: ProductCategoryDto[];

    createdAt: string;
    updatedAt: string;
};

export type ProductSeed = Omit<
    ProductDto,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'images'
    | 'categories'
    | 'basePrice'
    | 'ratingRate'
    | 'measureValue'
    | 'discountPercent'
    | 'ingredients'
> & {
    images: string[];
    categories: string[];
    basePrice: number;
    ratingRate: number;
    measureValue: number;
    discountPercent?: number;
    ingredients?: string[];
};
