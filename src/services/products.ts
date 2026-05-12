import { getDb } from '@/lib/db';
import type { ProductDocument, ProductDto } from '@/types/product';
import type { UserDocument } from '@/types/user';

function mapProductToDto(product: ProductDocument): ProductDto {
    return {
        ...product,
        _id: product._id.toString(),
    };
}

export async function getProducts(category?: string): Promise<ProductDto[]> {
    const db = await getDb();

    const query = category ? { categories: category } : {};

    const products = await db
        .collection<ProductDocument>('products')
        .find(query)
        .toArray();

    return products.map(mapProductToDto);
}

export async function getProductsByUserEmail(): Promise<ProductDto[]> {
    const db = await getDb();

    const user = await db
        .collection<UserDocument>('users')
        .findOne({ email: 'dundukovmi@gmail.com' });

    const productsIds =
        user?.purchases.map((purchase) => purchase.productId) ?? [];

    const purchasedProducts = await db
        .collection<ProductDocument>('products')
        .find({
            _id: {
                $in: productsIds,
            },
        })
        .toArray();

    return purchasedProducts.map(mapProductToDto);
}
