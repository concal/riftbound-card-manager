import { fetchCardDetailsByTcgplayerId } from '@/api/tcgapi';
import { useUserSettingsContext } from '@/context/UserSettingsContext';
import type { FormattedCardResponse } from '@/types/card';
import type { SortKey } from '@/types/sort';
import { getDisplayPrice } from '@/util/priceUtils';
import { API_BASE } from '@/lib/api';
import { useState, useEffect, useCallback, useMemo } from 'react';

type CardEntry = { cardId: number; tcgplayerId: number; quantity: number };

interface Filters {
  search: string;
  sort: SortKey;
  minPrice: string;
  maxPrice: string;
}

export function useCollection() {
  const { authData, userPreferences } = useUserSettingsContext();
  const collectionEnabled = !!authData;
  const [cards, setCards] = useState<FormattedCardResponse[]>([]);
  const [fetching, setFetching] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    sort: userPreferences?.defaultSort || 'price-desc',
    minPrice: '',
    maxPrice: '',
  });
  const [saving, setSaving] = useState(false);

  const [cardCountMap, setCardCountMap] = useState<Map<number, number>>(
    new Map(),
  );
  const [tcgplayerIdMap, setTcgplayerIdMap] = useState<Map<number, number>>(
    new Map(),
  );
  const [loading, setLoading] = useState(collectionEnabled);

  // Helper to apply a list of card entries to both maps
  const applyEntries = (entries: CardEntry[]) => {
    setCardCountMap(new Map(entries.map((e) => [e.cardId, e.quantity])));
    setTcgplayerIdMap(new Map(entries.map((e) => [e.cardId, e.tcgplayerId])));
  };

  // Initial fetch when collection becomes enabled (i.e. user logs in)
  useEffect(() => {
    if (!collectionEnabled) {
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/api/collections`, { credentials: 'include' })
      .then((resp) => resp.json())
      .then((respJSON: { cards: CardEntry[] }) => applyEntries(respJSON.cards))
      .finally(() => setLoading(false));
  }, [collectionEnabled]);

  // Async callback for adding a new card to collection
  const addCard = useCallback(
    async ({
      cardId,
      tcgplayerId,
    }: {
      cardId: number;
      tcgplayerId: number;
    }) => {
      setSaving(true);
      const resp = await fetch(`${API_BASE}/api/collections/cards/${cardId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tcgplayerId }),
      });
      if (resp.ok) {
        const data: { cards: CardEntry[] } = await resp.json();
        applyEntries(data.cards);
      }
      setSaving(false);
      return resp;
    },
    [],
  );

  // Async callback for removing a card from collection
  const removeCard = useCallback(async ({ cardId }: { cardId: number }) => {
    setSaving(true);
    const res = await fetch(`${API_BASE}/api/collections/cards/${cardId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      const data: { cards: CardEntry[] } = await res.json();
      applyEntries(data.cards);
    }
    setSaving(false);
    return res;
  }, []);

  // Utility for checking if a card is in the collection
  const isInCollection = useCallback(
    (cardId: number) => cardCountMap.has(cardId),
    [cardCountMap],
  );

  // Utility for getting the quantity of a card in the collection
  const getQuantity = useCallback(
    (cardId: number) => cardCountMap.get(cardId) ?? 0,
    [cardCountMap],
  );

  // Handles fetching the actual card data based on the ids
  useEffect(() => {
    if (loading) {
      setCards([]);
      return;
    }

    const ids = [...tcgplayerIdMap.values()];

    setFetching(true);
    fetchCardDetailsByTcgplayerId({ ids })
      .then(setCards)
      .finally(() => setFetching(false));
  }, [tcgplayerIdMap, loading]);

  // Filters the card data
  const displayedCards = useMemo(() => {
    const min = filters.minPrice !== '' ? parseFloat(filters.minPrice) : null;
    const max = filters.maxPrice !== '' ? parseFloat(filters.maxPrice) : null;
    const query = filters.search.trim().toLowerCase();

    let filtered = cards.filter((card) => {
      if (query && !card.name.toLowerCase().includes(query)) return false;
      const price = getDisplayPrice(card) || Infinity;
      if (min !== null && price < min) return false;
      if (max !== null && price > max) return false;
      return true;
    });

    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return (
            (getDisplayPrice(a) || Infinity) - (getDisplayPrice(b) || Infinity)
          );
        case 'price-desc': {
          const pa = a.marketPrice ?? -Infinity;
          const pb = b.marketPrice ?? -Infinity;
          return pb - pa;
        }
      }
    });

    return filtered;
  }, [cards, filters]);

  // Update search filters
  const updateFilters = useCallback(
    (newFilters: Partial<typeof filters>) =>
      setFilters((prev) => ({ ...prev, ...newFilters })),
    [],
  );

  return {
    cards,
    cardCountMap,
    displayedCards,
    cardDataLoading: fetching,
    collectionLoading: loading,
    addCard,
    removeCard,
    isInCollection,
    getQuantity,
    tcgplayerIdMap,
    updateFilters,
    filters,
    saving,
  };
}
