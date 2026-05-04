import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardResult } from '@/components/CardResult';
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

      {searched && !loading && !error && results.length === 0 && (
        <p className="text-muted-foreground text-sm">No results found.</p>
      )}

      {results.length > 0 && (
        <p className="text-muted-foreground text-sm">
          {results.length} result{results.length !== 1 ? 's' : ''}
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {results
          .filter((card) => card.shippingCategoryId === 1)
          .map((card) => (
            <CardResult key={card.id} card={card} />
          ))}
      </div>
    </div>
  );
}
