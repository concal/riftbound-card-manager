import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardResult } from '@/components/CardResult';
import { SearchEmptyState } from '@/components/SearchEmptyState';
import { useSearch } from '@/hooks/useSearch';

interface SearchContainerProps {
  isEditingCollection?: boolean;
}

export function SearchContainer({ isEditingCollection }: SearchContainerProps) {
  const [query, setQuery] = useState('');

  const { error, loading, onSearchSubmit, results, searched } = useSearch();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit(query);
    }
  };

  const filteredResults = results.filter((card) => card.shippingCategoryId === 1);
  const showEmptyState = !loading && !error && filteredResults.length === 0;

  return (
    <div className="w-full space-y-4">
      <h1 className="hidden sm:block text-3xl font-bold">
        {isEditingCollection ? 'Add Cards' : 'Search'}
      </h1>

      <div className="flex gap-2">
        <Input
          placeholder="Search cards by name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button
          onClick={() => onSearchSubmit(query)}
          disabled={loading || !query.trim()}
        >
          {loading ? 'Searching…' : 'Search'}
        </Button>
      </div>

      {error && <p className="text-destructive text-sm">Error: {error}</p>}

      {!error && filteredResults.length > 0 && (
        <p className="text-muted-foreground text-sm">
          {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
        </p>
      )}

      {showEmptyState && <SearchEmptyState searched={searched} />}

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {filteredResults.map((card) => (
          <CardResult key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
