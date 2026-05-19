import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { mapProductToDto } from '@/lib/mappers/product.mapper';

export async function GET(req: Request) {
    try {
        const category = new URL(req.url).searchParams.get('category');

        if (!category?.trim()) {
            return NextResponse.json(
                { message: 'Параметр категории обязателен' },
                { status: 400 },
            );
        }

        const products = await prisma.product.findMany({
            where: {
                categories: {
                    some: {
                        category: {
                            slug: category,
                        },
                    },
                },
            },
            include: {
                images: true,
                categories: {
                    include: {
                        category: true,
                    },
                },
            },
        });

        const mappedProducts = products.map(mapProductToDto);

        return NextResponse.json(mappedProducts);
    } catch (error) {
        console.error('Server error: ', error);
        return NextResponse.json(
            { message: 'Ошибка при загрузке товаров' },
            { status: 500 },
        );
    }
}
