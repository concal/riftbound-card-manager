import { useState, useCallback } from 'react';
import { fetchTcgApiSearchResults } from '@/api/tcgapi';
import type { FormattedCardResponse } from '@/types/card';

export function useSearch() {
  const [results, setResults] = useState<FormattedCardResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const onSearchSubmit = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const items = await fetchTcgApiSearchResults({ query: trimmed });
      setResults(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { error, loading, onSearchSubmit, results, searched };
}
