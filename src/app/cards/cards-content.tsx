'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CardThumbnail } from '@/components/card-thumbnail';
import type { CardParsed } from '@/lib/db';

const CARD_TYPES = ['credit', 'debit', 'forex', 'prepaid'];
const NETWORKS = ['Visa', 'Mastercard', 'Amex', 'RuPay'];
const REWARDS_TYPES = ['cashback', 'points', 'miles'];
const SORT_OPTIONS = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'fee_low', label: 'Fee: Low to High' },
    { value: 'fee_high', label: 'Fee: High to Low' },
    { value: 'rewards', label: 'Best Rewards' },
    { value: 'name', label: 'Name A-Z' },
];

export function CardsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [cards, setCards] = useState<CardParsed[]>([]);
    const [total, setTotal] = useState(0);
    const [issuers, setIssuers] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const type = searchParams.get('type') || '';
    const network = searchParams.get('network') || '';
    const issuer = searchParams.get('issuer') || '';
    const rewardsType = searchParams.get('rewardsType') || '';
    const sort = searchParams.get('sort') || 'popularity';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');

    const updateParam = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1');
        router.push(`/cards?${params.toString()}`);
    }, [searchParams, router]);

    useEffect(() => {
        const fetchCards = async () => {
            setLoading(true);
            const params = new URLSearchParams();
            if (type) params.set('type', type);
            if (network) params.set('network', network);
            if (issuer) params.set('issuer', issuer);
            if (rewardsType) params.set('rewardsType', rewardsType);
            if (sort) params.set('sort', sort);
            if (search) params.set('search', search);
            params.set('page', String(page));
            params.set('limit', '12');

            const res = await fetch(`/api/cards?${params.toString()}`);
            const data = await res.json();
            setCards(data.cards);
            setTotal(data.total);
            setIssuers(data.issuers || []);
            setLoading(false);
        };
        fetchCards();
    }, [type, network, issuer, rewardsType, sort, search, page]);

    const activeFilters = [type, network, issuer, rewardsType].filter(Boolean);
    const totalPages = Math.ceil(total / 12);

    const clearFilters = () => {
        router.push('/cards');
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    {type ? `${type.charAt(0).toUpperCase() + type.slice(1)} Cards` : 'All Cards'}
                </h1>
                <p className="text-muted-foreground">
                    {total} cards found — browse and compare to find your perfect match
                </p>
            </div>

            {/* Search & Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search cards by name, issuer, or features..."
                        value={search}
                        onChange={(e) => updateParam('search', e.target.value)}
                        className="pl-10"
                    />
                    {search && (
                        <button onClick={() => updateParam('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2">
                            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </button>
                    )}
                </div>
                <Select value={sort} onValueChange={(v) => updateParam('sort', v)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        {SORT_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    variant="outline"
                    className="gap-2 sm:w-auto"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFilters.length > 0 && (
                        <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                            {activeFilters.length}
                        </Badge>
                    )}
                </Button>
            </div>

            {/* Filter panels */}
            {showFilters && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-card border border-border/50 rounded-xl">
                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Card Type</label>
                        <Select value={type} onValueChange={(v) => updateParam('type', v === 'all' ? '' : v)}>
                            <SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {CARD_TYPES.map((t) => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Network</label>
                        <Select value={network} onValueChange={(v) => updateParam('network', v === 'all' ? '' : v)}>
                            <SelectTrigger><SelectValue placeholder="All networks" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Networks</SelectItem>
                                {NETWORKS.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Issuer</label>
                        <Select value={issuer} onValueChange={(v) => updateParam('issuer', v === 'all' ? '' : v)}>
                            <SelectTrigger><SelectValue placeholder="All issuers" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Issuers</SelectItem>
                                {issuers.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Rewards Type</label>
                        <Select value={rewardsType} onValueChange={(v) => updateParam('rewardsType', v === 'all' ? '' : v)}>
                            <SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {REWARDS_TYPES.map((r) => <SelectItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    {activeFilters.length > 0 && (
                        <div className="col-span-2 md:col-span-4">
                            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground">
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Active filter badges */}
            {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {type && <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => updateParam('type', '')}>{type} <X className="h-3 w-3" /></Badge>}
                    {network && <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => updateParam('network', '')}>{network} <X className="h-3 w-3" /></Badge>}
                    {issuer && <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => updateParam('issuer', '')}>{issuer} <X className="h-3 w-3" /></Badge>}
                    {rewardsType && <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => updateParam('rewardsType', '')}>{rewardsType} <X className="h-3 w-3" /></Badge>}
                </div>
            )}

            {/* Cards Grid */}
            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-card border border-border/50 rounded-xl overflow-hidden">
                            <div className="p-5 pb-3"><div className="skeleton h-[140px]" /></div>
                            <div className="px-5 pb-5 space-y-2">
                                <div className="skeleton h-4 w-3/4" />
                                <div className="skeleton h-3 w-1/2" />
                                <div className="skeleton h-3 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : cards.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-muted-foreground text-lg mb-2">No cards found</div>
                    <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                    <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {cards.map((card) => (
                        <CardThumbnail key={card.id} card={card} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => updateParam('page', String(page - 1))}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground px-4">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => updateParam('page', String(page + 1))}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
