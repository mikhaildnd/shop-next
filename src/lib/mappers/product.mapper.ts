import type { ProductWithRelations } from '@/lib/prisma/product';
import type { ProductDto } from '@/services/product/product.types';

export function mapProductToDto(product: ProductWithRelations): ProductDto {
    return {
        // TODO добавидь zod-валидацию
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
        category: product.category
            ? {
                  id: product.category.id,
                  slug: product.category.slug,
                  title: product.category.title,
              }
            : null,
        collections: product.collections.map(({ collection }) => ({
            id: collection.id,
            slug: collection.slug,
            title: collection.title,
        })),
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    };
}
