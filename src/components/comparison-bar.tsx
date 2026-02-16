'use client';

import Link from 'next/link';
import { useComparisonStore } from '@/store/comparison-store';
import { BarChart3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ComparisonBar() {
    const { selectedCards, removeCard, clearAll } = useComparisonStore();

    if (selectedCards.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl shadow-2xl">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-x-auto">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground shrink-0">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <span>{selectedCards.length}/4</span>
                    </div>
                    {selectedCards.map((card) => (
                        <div
                            key={card.id}
                            className="flex items-center gap-2 bg-secondary rounded-full pl-3 pr-1.5 py-1.5 shrink-0"
                        >
                            <span className="text-xs font-medium truncate max-w-[120px]">{card.name}</span>
                            <button
                                onClick={() => removeCard(card.id)}
                                className="p-0.5 rounded-full hover:bg-destructive/20 transition-colors"
                                aria-label={`Remove ${card.name}`}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs">
                        Clear
                    </Button>
                    <Link href="/compare">
                        <Button size="sm" className="gap-1.5">
                            <BarChart3 className="h-3.5 w-3.5" />
                            Compare ({selectedCards.length})
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
