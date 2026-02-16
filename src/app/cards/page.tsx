import { Suspense } from 'react';
import { CardsContent } from './cards-content';

function CardsLoading() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="mb-8">
                <div className="skeleton h-8 w-48 mb-2" />
                <div className="skeleton h-4 w-72" />
            </div>
            <div className="skeleton h-10 w-full mb-6" />
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
        </div>
    );
}

export default function CardsPage() {
    return (
        <Suspense fallback={<CardsLoading />}>
            <CardsContent />
        </Suspense>
    );
}
