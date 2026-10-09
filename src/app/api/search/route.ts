import { NextResponse } from 'next/server';

import {
    MIN_SEARCH_QUERY_LENGTH,
    SEARCH_QUERY_PARAM,
} from '@/lib/search/search.constants';
import { findCategories } from '@/services/category/category.service';
import { searchProducts } from '@/services/product/product.service';

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
        searchProducts(normalizedQuery, SEARCH_PRODUCTS_LIMIT),

        findCategories(normalizedQuery, SEARCH_CATEGORIES_LIMIT),
    ]);

    return NextResponse.json({
        products: productsResult.products,
        productsCount: productsResult.totalProductsCount,
        categories,
    });
}
