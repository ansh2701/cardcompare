'use client';

import Link from 'next/link';
import { Star, Plus, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useComparisonStore } from '@/store/comparison-store';
import toast from 'react-hot-toast';
import type { CardParsed } from '@/lib/db';

const typeColors: Record<string, string> = {
    credit: 'badge-credit',
    debit: 'badge-debit',
    forex: 'badge-forex',
    prepaid: 'badge-prepaid',
};

export function CardThumbnail({ card }: { card: CardParsed }) {
    const { addCard, removeCard, isSelected } = useComparisonStore();
    const selected = isSelected(card.id);

    const handleCompare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (selected) {
            removeCard(card.id);
            toast.success(`Removed ${card.name}`);
        } else {
            const added = addCard(card);
            if (added) {
                toast.success(`Added ${card.name} to compare`);
            } else {
                toast.error('Maximum 4 cards can be compared');
            }
        }
    };

    return (
        <Link href={`/cards/${card.slug}`} className="group block">
            <div className="relative bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                {/* Card Visual */}
                <div className="p-5 pb-3">
                    <div
                        className="card-visual w-full flex flex-col justify-between p-4"
                        style={{ background: card.cardGradient }}
                    >
                        <div className="flex justify-between items-start">
                            <div className="text-white/90 text-xs font-medium tracking-wider uppercase">{card.issuer}</div>
                            <div className="text-white/70 text-[10px] font-bold tracking-widest">{card.network}</div>
                        </div>
                        <div>
                            <div className="text-white font-semibold text-sm leading-tight">{card.name}</div>
                            <div className="flex gap-1 mt-1.5">
                                {'●●●● ●●●● ●●●● ●●●●'.split('').map((c, i) => (
                                    <span key={i} className="text-white/40 text-[8px]">{c}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-5 pb-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">{card.name}</h3>
                            <p className="text-xs text-muted-foreground">{card.issuer}</p>
                        </div>
                        <Badge variant="outline" className={`shrink-0 text-[10px] ${typeColors[card.cardType] || ''}`}>
                            {card.cardType}
                        </Badge>
                    </div>

                    {card.highlight && (
                        <p className="text-xs text-primary font-medium mb-3 line-clamp-1">{card.highlight}</p>
                    )}

                    <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-secondary/50 rounded-lg px-2.5 py-1.5">
                            <div className="text-[10px] text-muted-foreground">Annual Fee</div>
                            <div className="text-sm font-semibold">
                                {card.annualFee === 0 ? <span className="text-emerald-500">FREE</span> : `₹${card.annualFee.toLocaleString()}`}
                            </div>
                        </div>
                        <div className="bg-secondary/50 rounded-lg px-2.5 py-1.5">
                            <div className="text-[10px] text-muted-foreground">
                                {card.rewardsType === 'cashback' ? 'Cashback' : 'Rewards'}
                            </div>
                            <div className="text-sm font-semibold">
                                {card.cashbackRate ? `${card.cashbackRate}%` : card.rewardsRate ? `${card.rewardsRate}X` : 'N/A'}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-medium">{card.rating}</span>
                        </div>
                        <Button
                            size="sm"
                            variant={selected ? "default" : "outline"}
                            className="h-7 text-xs gap-1"
                            onClick={handleCompare}
                        >
                            {selected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                            {selected ? 'Added' : 'Compare'}
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
