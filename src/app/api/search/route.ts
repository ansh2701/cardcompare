import { NextRequest, NextResponse } from 'next/server';
import { searchCards } from '@/lib/db';

export async function GET(request: NextRequest) {
    const query = new URL(request.url).searchParams.get('q') || '';
    if (query.length < 2) {
        return NextResponse.json({ results: [] });
    }
    const results = searchCards(query, 8);
    return NextResponse.json({ results });
}
