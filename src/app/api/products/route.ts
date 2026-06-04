import { NextResponse } from 'next/server';
import { getProducts } from '@/services/product/product.service';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const category = searchParams.get('category');

        const takeParam = searchParams.get('take');
        const skipParam = searchParams.get('skip');

        const parsedTake = takeParam ? Number(takeParam) : undefined;
        const parsedSkip = skipParam ? Number(skipParam) : undefined;

        const take = Number.isNaN(parsedTake) ? undefined : parsedTake;
        const skip = Number.isNaN(parsedSkip) ? undefined : parsedSkip;

        const { products, totalCount } = await getProducts({
            category: category?.trim() || undefined,
            take,
            skip,
        });

        return NextResponse.json({ products, totalCount });
    } catch (error) {
        console.error('Server error: ', error);
        return NextResponse.json(
            { message: 'Ошибка при загрузке товаров' },
            { status: 500 },
        );
    }
}
