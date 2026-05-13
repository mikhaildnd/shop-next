import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import type { UserDocument } from '@/types/user';
import type { ProductDocument, ProductDto } from '@/types/product';

export async function GET() {
    try {
        const db = await getDb();

        const user = await db.collection<UserDocument>('users').findOne({});

        if (!user?.purchases?.length) {
            return NextResponse.json([]);
        }

        const productIds = user.purchases.map((purchase) => purchase.productId);

        const products = await db
            .collection<ProductDocument>('products')
            .find({ _id: { $in: productIds } })
            .toArray();

        const formattedProducts: ProductDto[] = products.map((p) => {
            const { _id, discountPercent, ...rest } = p;

            void discountPercent;

            return {
                ...rest,
                _id: _id.toString(),
            };
        });

        return NextResponse.json(formattedProducts);
    } catch (error) {
        console.error('Server error: ', error);
        return NextResponse.json(
            { message: 'Ошибка при загрузке купленных ранее товаров' },
            { status: 500 },
        );
    }
}
