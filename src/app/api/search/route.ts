import { NextResponse } from 'next/server';
import {
    MIN_SEARCH_QUERY_LENGTH,
    SEARCH_QUERY_PARAM,
} from '@/lib/search/consts';
import { getProducts } from '@/services/product/product.service';
import { findCategories } from '@/services/category/category.service';

const SEARCH_PRODUCTS_LIMIT = 5;
const SEARCH_CATEGORIES_LIMIT = 5;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get(SEARCH_QUERY_PARAM) ?? '';
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < MIN_SEARCH_QUERY_LENGTH) {
        return NextResponse.json({
            products: [],
            productsCount: 0,
            categories: [],
        });
    }

    const [productsResult, categories] = await Promise.all([
        getProducts({
            searchParams: {
                [SEARCH_QUERY_PARAM]: normalizedQuery,
            },
            take: SEARCH_PRODUCTS_LIMIT,
            skip: 0,
        }),

        findCategories(normalizedQuery, SEARCH_CATEGORIES_LIMIT),
    ]);

    return NextResponse.json({
        products: productsResult.products,
        productsCount: productsResult.filteredProductsCount,
        categories,
    });
}
