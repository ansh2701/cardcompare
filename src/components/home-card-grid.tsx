'use client';

import { CardThumbnail } from '@/components/card-thumbnail';
import type { CardParsed } from '@/lib/db';

export function HomeCardGrid({ cards }: { cards: CardParsed[] }) {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {cards.map((card) => (
                <CardThumbnail key={card.id} card={card} />
            ))}
        </div>
    );
}
