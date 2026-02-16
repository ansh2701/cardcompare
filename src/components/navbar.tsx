'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CreditCard, Menu, X, Search, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        Card<span className="text-primary">Compare</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    <Link href="/cards" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent">
                        All Cards
                    </Link>
                    <Link href="/cards?type=credit" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent">
                        Credit Cards
                    </Link>
                    <Link href="/cards?type=debit" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent">
                        Debit Cards
                    </Link>
                    <Link href="/cards?type=forex" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent">
                        Forex Cards
                    </Link>
                    <Link href="/compare" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent flex items-center gap-1.5">
                        <BarChart3 className="h-4 w-4" /> Compare
                    </Link>
                </nav>

                <div className="hidden md:flex items-center gap-2">
                    <Link href="/cards">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Search className="h-4 w-4" />
                            Search Cards
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded-md hover:bg-accent"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
                    <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
                        <Link href="/cards" onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm font-medium rounded-md hover:bg-accent">
                            All Cards
                        </Link>
                        <Link href="/cards?type=credit" onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm font-medium rounded-md hover:bg-accent">
                            Credit Cards
                        </Link>
                        <Link href="/cards?type=debit" onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm font-medium rounded-md hover:bg-accent">
                            Debit Cards
                        </Link>
                        <Link href="/cards?type=forex" onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm font-medium rounded-md hover:bg-accent">
                            Forex Cards
                        </Link>
                        <Link href="/compare" onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm font-medium rounded-md hover:bg-accent flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" /> Compare
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
