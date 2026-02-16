import Link from 'next/link';
import { CreditCard } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-card/50">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <span className="text-lg font-bold">Card<span className="text-primary">Compare</span></span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Find and compare the best credit, debit, forex, and prepaid cards in India.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm mb-3">Card Types</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/cards?type=credit" className="hover:text-foreground transition-colors">Credit Cards</Link></li>
                            <li><Link href="/cards?type=debit" className="hover:text-foreground transition-colors">Debit Cards</Link></li>
                            <li><Link href="/cards?type=forex" className="hover:text-foreground transition-colors">Forex Cards</Link></li>
                            <li><Link href="/cards?type=prepaid" className="hover:text-foreground transition-colors">Prepaid Cards</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/compare" className="hover:text-foreground transition-colors">Compare Cards</Link></li>
                            <li><Link href="/cards?sort=fee_low" className="hover:text-foreground transition-colors">No Annual Fee</Link></li>
                            <li><Link href="/cards?sort=rewards" className="hover:text-foreground transition-colors">Best Rewards</Link></li>
                            <li><Link href="/cards?sort=rating" className="hover:text-foreground transition-colors">Top Rated</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm mb-3">Popular Issuers</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/cards?issuer=HDFC+Bank" className="hover:text-foreground transition-colors">HDFC Bank</Link></li>
                            <li><Link href="/cards?issuer=ICICI+Bank" className="hover:text-foreground transition-colors">ICICI Bank</Link></li>
                            <li><Link href="/cards?issuer=SBI+Card" className="hover:text-foreground transition-colors">SBI Card</Link></li>
                            <li><Link href="/cards?issuer=Axis+Bank" className="hover:text-foreground transition-colors">Axis Bank</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} CardCompare. All card data is for informational purposes only.</p>
                </div>
            </div>
        </footer>
    );
}
