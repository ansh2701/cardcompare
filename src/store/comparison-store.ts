'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CardParsed } from '@/lib/db';

interface ComparisonState {
    selectedCards: CardParsed[];
    addCard: (card: CardParsed) => boolean;
    removeCard: (cardId: string) => void;
    clearAll: () => void;
    isSelected: (cardId: string) => boolean;
}

export const useComparisonStore = create<ComparisonState>()(
    persist(
        (set, get) => ({
            selectedCards: [],
            addCard: (card: CardParsed) => {
                const current = get().selectedCards;
                if (current.length >= 4) return false;
                if (current.find((c) => c.id === card.id)) return false;
                set({ selectedCards: [...current, card] });
                return true;
            },
            removeCard: (cardId: string) => {
                set({ selectedCards: get().selectedCards.filter((c) => c.id !== cardId) });
            },
            clearAll: () => {
                set({ selectedCards: [] });
            },
            isSelected: (cardId: string) => {
                return get().selectedCards.some((c) => c.id === cardId);
            },
        }),
        {
            name: 'card-comparison',
        }
    )
);
