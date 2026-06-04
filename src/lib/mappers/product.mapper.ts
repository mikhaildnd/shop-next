import type { ProductDto } from '@/types/product';
import type { ProductWithRelations } from '@/lib/prisma/product';

export function mapProductToDto(product: ProductWithRelations): ProductDto {
    return {
        id: product.id,
        slug: product.slug,
        title: product.title,
        description: product.description,
        ingredients: product.ingredients,
        basePrice: Number(product.basePrice),
        discountPercent: product.discountPercent,
        ratingRate: Number(product.ratingRate),
        ratingCount: product.ratingCount,
        stock: product.stock,
        measureType: product.measureType,
        measureValue: Number(product.measureValue),
        images: product.images.map((image) => ({
            id: image.id,
            url: image.url,
            alt: image.alt,
            sortOrder: image.sortOrder,
        })),
        categories: product.categories.map(({ category }) => ({
            id: category.id,
            slug: category.slug,
            title: category.title,
        })),
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    };
}
