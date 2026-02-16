'use client';

import Link from 'next/link';
import { ArrowLeft, Star, Check, Plus, ExternalLink, Shield, Award, CreditCard, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useComparisonStore } from '@/store/comparison-store';
import toast from 'react-hot-toast';
import type { CardParsed } from '@/lib/db';

const typeColors: Record<string, string> = {
    credit: 'badge-credit',
    debit: 'badge-debit',
    forex: 'badge-forex',
    prepaid: 'badge-prepaid',
};

export function CardDetailContent({ card }: { card: CardParsed }) {
    const { addCard, removeCard, isSelected } = useComparisonStore();
    const selected = isSelected(card.id);

    const handleCompare = () => {
        if (selected) {
            removeCard(card.id);
            toast.success(`Removed ${card.name}`);
        } else {
            const added = addCard(card);
            if (added) toast.success(`Added ${card.name} to compare`);
            else toast.error('Maximum 4 cards can be compared');
        }
    };

    const eligibility = card.eligibility as Record<string, unknown>;
    const fees = card.fees as Record<string, unknown>;

    return (
        <div>
            {/* Breadcrumb */}
            <Link href="/cards" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Cards
            </Link>

            <div className="grid lg:grid-cols-5 gap-8">
                {/* Left: Card Visual */}
                <div className="lg:col-span-2">
                    <div className="sticky top-24">
                        <div
                            className="card-visual w-full max-w-sm mx-auto flex flex-col justify-between p-6"
                            style={{ background: card.cardGradient }}
                        >
                            <div className="flex justify-between items-start">
                                <div className="text-white/90 text-sm font-medium tracking-wider uppercase">{card.issuer}</div>
                                <div className="text-white/70 text-xs font-bold tracking-widest">{card.network}</div>
                            </div>
                            <div className="mt-auto">
                                <div className="text-white/50 text-xs tracking-[0.3em] mb-2">{'●●●●  ●●●●  ●●●●  ●●●●'}</div>
                                <div className="text-white font-semibold text-lg">{card.name}</div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4 justify-center">
                            <Button
                                size="lg"
                                variant={selected ? 'default' : 'outline'}
                                className="gap-2 flex-1 max-w-[200px]"
                                onClick={handleCompare}
                            >
                                {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                {selected ? 'Added to Compare' : 'Add to Compare'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right: Details */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={typeColors[card.cardType]}>{card.cardType}</Badge>
                            <Badge variant="outline">{card.network}</Badge>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-1">{card.name}</h1>
                        <p className="text-muted-foreground">{card.issuer}</p>
                        {card.highlight && (
                            <p className="text-primary font-medium mt-2">{card.highlight}</p>
                        )}
                        <div className="flex items-center gap-2 mt-3">
                            <div className="flex items-center gap-1">
                                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                                <span className="font-semibold text-lg">{card.rating}</span>
                            </div>
                            <span className="text-muted-foreground text-sm">/ 5.0</span>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
                            <IndianRupee className="h-5 w-5 text-primary mx-auto mb-1.5" />
                            <div className="text-xs text-muted-foreground mb-0.5">Annual Fee</div>
                            <div className="font-semibold">
                                {card.annualFee === 0 ? <span className="text-emerald-500">FREE</span> : `₹${card.annualFee.toLocaleString()}`}
                            </div>
                        </div>
                        <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
                            <IndianRupee className="h-5 w-5 text-primary mx-auto mb-1.5" />
                            <div className="text-xs text-muted-foreground mb-0.5">Joining Fee</div>
                            <div className="font-semibold">
                                {card.joiningFee === 0 ? <span className="text-emerald-500">FREE</span> : `₹${card.joiningFee.toLocaleString()}`}
                            </div>
                        </div>
                        {card.rewardsType && (
                            <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
                                <Award className="h-5 w-5 text-primary mx-auto mb-1.5" />
                                <div className="text-xs text-muted-foreground mb-0.5">
                                    {card.rewardsType === 'cashback' ? 'Cashback' : 'Rewards'}
                                </div>
                                <div className="font-semibold">
                                    {card.cashbackRate ? `${card.cashbackRate}%` : card.rewardsRate ? `${card.rewardsRate}X` : 'N/A'}
                                </div>
                            </div>
                        )}
                        {card.interestRate && (
                            <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
                                <CreditCard className="h-5 w-5 text-primary mx-auto mb-1.5" />
                                <div className="text-xs text-muted-foreground mb-0.5">Interest</div>
                                <div className="font-semibold">{card.interestRate}% p.m.</div>
                            </div>
                        )}
                    </div>

                    {card.welcomeBonus && (
                        <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl p-4">
                            <div className="text-xs text-primary font-medium mb-1">Welcome Bonus</div>
                            <div className="font-semibold">{card.welcomeBonus}</div>
                        </div>
                    )}

                    <Separator />

                    {/* Features */}
                    {card.features.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-lg mb-3">Key Features</h3>
                            <div className="grid sm:grid-cols-2 gap-2">
                                {card.features.map((f, i) => (
                                    <div key={i} className="flex items-start gap-2 p-2.5 bg-secondary/30 rounded-lg">
                                        <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                        <span className="text-sm">{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Benefits */}
                    {card.benefits.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-lg mb-3">Benefits</h3>
                            <div className="grid sm:grid-cols-2 gap-2">
                                {card.benefits.map((b, i) => (
                                    <div key={i} className="flex items-start gap-2 p-2.5 bg-secondary/30 rounded-lg">
                                        <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                        <span className="text-sm">{b}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Eligibility */}
                    {Object.keys(eligibility).length > 0 && (
                        <div>
                            <h3 className="font-semibold text-lg mb-3">Eligibility</h3>
                            <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
                                {Object.entries(eligibility).map(([key, value], i) => (
                                    <div key={key} className={`flex justify-between items-center px-4 py-3 ${i > 0 ? 'border-t border-border/30' : ''}`}>
                                        <span className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className="text-sm font-medium">
                                            {typeof value === 'number'
                                                ? key.toLowerCase().includes('income') || key.toLowerCase().includes('balance')
                                                    ? `₹${value.toLocaleString()}`
                                                    : value
                                                : Array.isArray(value) ? value.join(', ') : String(value)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Fees */}
                    {Object.keys(fees).length > 0 && (
                        <div>
                            <h3 className="font-semibold text-lg mb-3">Fee Structure</h3>
                            <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
                                {Object.entries(fees).map(([key, value], i) => (
                                    <div key={key} className={`flex justify-between items-center px-4 py-3 ${i > 0 ? 'border-t border-border/30' : ''}`}>
                                        <span className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className="text-sm font-medium">
                                            {typeof value === 'number' ? (value === 0 ? 'Free' : `₹${value.toLocaleString()}`) : String(value)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
