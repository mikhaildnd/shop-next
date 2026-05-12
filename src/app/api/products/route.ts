import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import type { ProductDocument, ProductDto } from '@/types/product';

export const revalidate = 3600;

export async function GET(req: Request) {
    try {
        const category = new URL(req.url).searchParams.get('category');

        if (!category?.trim()) {
            return NextResponse.json(
                { message: 'Параметр категории обязателен' },
                { status: 400 },
            );
        }

        const db = await getDb();
        const products = await db
            .collection<ProductDocument>('products')
            .find({ categories: category })
            .toArray();

        const mappedProducts: ProductDto[] = products.map((product) => ({
            ...product,
            _id: product._id.toString(),
        }));

        return NextResponse.json(mappedProducts);
    } catch (error) {
        console.error('Server error: ', error);
        return NextResponse.json(
            { message: 'Ошибка при загрузке товаров' },
            { status: 500 },
        );
    }
}
