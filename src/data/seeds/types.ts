import type { Prisma } from '@/generated/prisma/client';
import type { MeasureType } from '@/services/product/product.types';

export type CategorySeed = {
    slug: string;
    title: string;
    image?: string;

    children?: CategorySeed[];
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

export type CollectionSeed = Prisma.CollectionCreateInput;

export type UserSeed = Prisma.UserCreateInput;
