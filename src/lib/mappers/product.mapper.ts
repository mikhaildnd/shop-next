import type { ProductWithRelations } from '@/lib/prisma/product';
import type { ProductDto } from '@/services/product/product.types';

export function mapProductToDto(product: ProductWithRelations): ProductDto {
    if (product.effectivePrice === null) {
        throw new Error(`Product ${product.id} has null effectivePrice`);
    }

    return {
        id: product.id,
        slug: product.slug,
        title: product.title,
        description: product.description,
        ingredients: product.ingredients,
        regularPrice: Number(product.regularPrice),
        salePrice:
            product.salePrice === null ? null : Number(product.salePrice),
        effectivePrice: Number(product.effectivePrice),
        discountPercent: product.discountPercent ?? 0,
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
