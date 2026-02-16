import { NextRequest, NextResponse } from 'next/server';
import { getAllCards, getUniqueIssuers } from '@/lib/db';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const filters = {
        cardType: searchParams.get('type') || undefined,
        network: searchParams.get('network') || undefined,
        issuer: searchParams.get('issuer') || undefined,
        minFee: searchParams.get('minFee') ? Number(searchParams.get('minFee')) : undefined,
        maxFee: searchParams.get('maxFee') ? Number(searchParams.get('maxFee')) : undefined,
        rewardsType: searchParams.get('rewardsType') || undefined,
        sort: searchParams.get('sort') || undefined,
        search: searchParams.get('search') || undefined,
        page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
        limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
    };

    const result = getAllCards(filters);
    const issuers = getUniqueIssuers();

    return NextResponse.json({
        ...result,
        issuers,
        page: filters.page,
        totalPages: Math.ceil(result.total / (filters.limit || 12)),
    });
}
