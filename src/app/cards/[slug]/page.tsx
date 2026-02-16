import { notFound } from 'next/navigation';
import { getCardBySlug, getSimilarCards } from '@/lib/db';
import { CardDetailContent } from '@/components/card-detail-content';
import { HomeCardGrid } from '@/components/home-card-grid';

interface CardDetailPageProps {
    params: Promise<{ slug: string }>;
}

export default async function CardDetailPage({ params }: CardDetailPageProps) {
    const { slug } = await params;
    const card = getCardBySlug(slug);

    if (!card) {
        notFound();
    }

    const similar = getSimilarCards(card, 4);

    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
            <CardDetailContent card={card} />

            {similar.length > 0 && (
                <section className="mt-16">
                    <h2 className="text-xl font-bold mb-6">Similar Cards</h2>
                    <HomeCardGrid cards={similar} />
                </section>
            )}
        </div>
    );
}
