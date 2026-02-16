import Link from 'next/link';
import { CreditCard, ArrowRight, Shield, Zap, BarChart3, Sparkles, Star, TrendingUp, Award, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getFeaturedCards, getAllCards } from '@/lib/db';
import { HomeCardGrid } from '@/components/home-card-grid';

export default function HomePage() {
  const featured = getFeaturedCards(8);
  const { total } = getAllCards({ limit: 1 });

  const categories = [
    { name: 'Credit Cards', icon: CreditCard, type: 'credit', desc: 'Rewards, cashback & more', color: 'from-blue-500 to-blue-700' },
    { name: 'Debit Cards', icon: Shield, type: 'debit', desc: 'Everyday spending cards', color: 'from-emerald-500 to-emerald-700' },
    { name: 'Forex Cards', icon: Globe, type: 'forex', desc: 'Travel & international', color: 'from-purple-500 to-purple-700' },
    { name: 'Prepaid Cards', icon: Zap, type: 'prepaid', desc: 'Instant digital cards', color: 'from-orange-500 to-orange-700' },
  ];

  const stats = [
    { value: `${total}+`, label: 'Cards Listed' },
    { value: '15+', label: 'Issuers' },
    { value: '4', label: 'Card Types' },
    { value: 'AI', label: 'Smart Compare' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/3 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 border-white/20 text-white/80 bg-white/5 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 mr-1.5" /> AI-Powered Card Comparison
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              Find Your
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400"> Perfect Card</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-xl mx-auto mb-8 leading-relaxed">
              Compare {total}+ credit, debit, forex & prepaid cards from top Indian banks. Make smarter financial decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/cards">
                <Button size="lg" className="gap-2 text-base h-12 px-8 bg-white text-gray-900 hover:bg-white/90">
                  Explore Cards <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/compare">
                <Button size="lg" variant="outline" className="gap-2 text-base h-12 px-8 border-white/20 text-white hover:bg-white/10">
                  <BarChart3 className="h-4 w-4" /> Compare Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center glass rounded-xl px-4 py-4">
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Browse by Category</h2>
          <p className="text-muted-foreground">Choose from different card types to find what suits you best</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.type} href={`/cards?type=${cat.type}`}>
              <div className="group relative bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <cat.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
                <p className="text-xs text-muted-foreground">{cat.desc}</p>
                <ArrowRight className="h-4 w-4 text-primary/50 group-hover:text-primary absolute bottom-4 right-4 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Cards */}
      <section className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1">Popular Cards</h2>
            <p className="text-muted-foreground text-sm">Top-rated cards loved by users</p>
          </div>
          <Link href="/cards">
            <Button variant="ghost" className="gap-1.5">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <HomeCardGrid cards={featured} />
      </section>

      {/* Why CardCompare */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Why CardCompare?</h2>
          <p className="text-muted-foreground">Everything you need to make informed card decisions</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: BarChart3, title: 'Side-by-Side Comparison', desc: 'Compare up to 4 cards simultaneously across fees, rewards, eligibility, and more.' },
            { icon: Award, title: 'Comprehensive Database', desc: `Browse ${total}+ cards across credit, debit, forex, and prepaid categories from leading issuers.` },
            { icon: TrendingUp, title: 'Smart Filters & Sorting', desc: 'Filter by card type, network, fee range, rewards type, and sort by rating, popularity, or fees.' },
          ].map((item) => (
            <div key={item.title} className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 rounded-2xl border border-border/50 p-8 md:p-12 text-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <Star className="h-8 w-8 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Find Your Card?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">Browse our complete catalog and use powerful filters to find the card that matches your lifestyle.</p>
            <Link href="/cards">
              <Button size="lg" className="gap-2 h-12 px-8">
                Start Exploring <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
