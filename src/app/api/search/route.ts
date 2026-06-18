import { NextResponse } from 'next/server';
import { search } from '@/services/search/search.service';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('q') ?? '';

    const result = await search(query);

    return NextResponse.json(result);
}
