'use client';

import { useComparisonStore } from '@/store/comparison-store';
import Link from 'next/link';
import { ArrowLeft, X, Plus, Star, Check, AlertCircle, IndianRupee, Award, CreditCard, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ComparisonCharts } from '@/components/comparison-charts';

export default function ComparePage() {
    const { selectedCards, removeCard, clearAll } = useComparisonStore();

    if (selectedCards.length === 0) {
        return (
            <div className="container mx-auto px-4 md:px-6 py-20 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">No Cards Selected</h1>
                <p className="text-muted-foreground mb-6">Add cards from the catalog to start comparing them side-by-side.</p>
                <Link href="/cards">
                    <Button size="lg" className="gap-2">
                        <Plus className="h-4 w-4" /> Browse Cards
                    </Button>
                </Link>
            </div>
        );
    }

    const comparison = selectedCards;

    type Row = {
        label: string;
        get: (c: typeof comparison[0]) => string | React.ReactNode;
        highlight?: boolean;
    };

    const rows: Row[] = [
        {
            label: 'Card Type',
            get: (c) => <Badge variant="outline" className={c.cardType === 'credit' ? 'badge-credit' : c.cardType === 'debit' ? 'badge-debit' : c.cardType === 'forex' ? 'badge-forex' : 'badge-prepaid'}>{c.cardType}</Badge>,
        },
        { label: 'Network', get: (c) => c.network },
        { label: 'Issuer', get: (c) => c.issuer },
        {
            label: 'Rating',
            get: (c) => (
                <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{c.rating}</span>
                </div>
            ),
        },
        {
            label: 'Annual Fee',
            get: (c) => c.annualFee === 0 ? <span className="text-emerald-500 font-semibold">FREE</span> : `₹${c.annualFee.toLocaleString('en-IN')}`,
            highlight: true,
        },
        {
            label: 'Joining Fee',
            get: (c) => c.joiningFee === 0 ? <span className="text-emerald-500 font-semibold">FREE</span> : `₹${c.joiningFee.toLocaleString('en-IN')}`,
        },
        {
            label: 'Rewards Type',
            get: (c) => c.rewardsType ? c.rewardsType.charAt(0).toUpperCase() + c.rewardsType.slice(1) : '—',
        },
        {
            label: 'Cashback Rate',
            get: (c) => c.cashbackRate ? <span className="text-emerald-500 font-semibold">{c.cashbackRate}%</span> : '—',
            highlight: true,
        },
        {
            label: 'Rewards Rate',
            get: (c) => c.rewardsRate ? <span className="text-primary font-semibold">{c.rewardsRate}X</span> : '—',
            highlight: true,
        },
        {
            label: 'Interest Rate',
            get: (c) => c.interestRate ? `${c.interestRate}% p.m.` : '—',
        },
        {
            label: 'Welcome Bonus',
            get: (c) => c.welcomeBonus || '—',
        },
        {
            label: 'Features',
            get: (c) => (
                <ul className="space-y-1">
                    {c.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs">
                            <Check className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                            {f}
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            label: 'Benefits',
            get: (c) => (
                <ul className="space-y-1">
                    {c.benefits.slice(0, 4).map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs">
                            <Shield className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                            {b}
                        </li>
                    ))}
                </ul>
            ),
        },
    ];

    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link href="/cards" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Cards
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold">Compare Cards</h1>
                    <p className="text-muted-foreground text-sm">Compare up to 4 cards side-by-side</p>
                </div>
                <div className="flex gap-2">
                    {comparison.length < 4 && (
                        <Link href="/cards">
                            <Button variant="outline" size="sm" className="gap-1.5">
                                <Plus className="h-3.5 w-3.5" /> Add Card
                            </Button>
                        </Link>
                    )}
                    <Button variant="ghost" size="sm" onClick={clearAll}>Clear All</Button>
                </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/50">
                                <th className="text-left p-4 text-sm text-muted-foreground font-medium w-[160px] bg-card sticky left-0 z-10">
                                    Details
                                </th>
                                {comparison.map((card) => (
                                    <th key={card.id} className="p-4 min-w-[200px]">
                                        <div className="space-y-3">
                                            <div
                                                className="card-visual h-[100px] w-full flex flex-col justify-between p-3 mx-auto"
                                                style={{ background: card.cardGradient }}
                                            >
                                                <div className="text-white/70 text-[9px] font-bold tracking-widest text-right">{card.network}</div>
                                                <div className="text-white font-medium text-xs">{card.name}</div>
                                            </div>
                                            <div>
                                                <Link href={`/cards/${card.slug}`} className="text-sm font-semibold hover:text-primary transition-colors">
                                                    {card.name}
                                                </Link>
                                                <p className="text-xs text-muted-foreground">{card.issuer}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-xs text-muted-foreground hover:text-destructive gap-1"
                                                onClick={() => removeCard(card.id)}
                                            >
                                                <X className="h-3 w-3" /> Remove
                                            </Button>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, idx) => (
                                <tr
                                    key={row.label}
                                    className={`border-b border-border/30 ${row.highlight ? 'bg-primary/[0.02]' : ''} ${idx % 2 === 0 ? '' : 'bg-secondary/20'}`}
                                >
                                    <td className="p-4 text-sm font-medium text-muted-foreground bg-card sticky left-0 z-10 border-r border-border/30">
                                        {row.label}
                                    </td>
                                    {comparison.map((card) => (
                                        <td key={card.id} className="p-4 text-sm">
                                            {row.get(card)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Charts */}
            <ComparisonCharts cards={comparison} />
        </div>
    );
}
