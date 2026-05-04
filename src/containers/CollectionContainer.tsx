import { useCollectionContext } from '@/context/CollectionContext';
import { Input } from '@/components/ui/input';
import { CardResult } from '@/components/CardResult';
import type { SortKey } from '@/types/sort';

export function CollectionContainer() {
  const {
    cards,
    cardDataLoading,
    collectionLoading,
    displayedCards,
    filters,
    updateFilters,
    tcgplayerIdMap,
  } = useCollectionContext();

  if (collectionLoading || (cardDataLoading && cards.length === 0)) {
    return <p className="text-muted-foreground text-sm">Loading collection…</p>;
  }

  if (tcgplayerIdMap.size === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Your collection is empty. Search for cards and add them.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end sm:gap-3">
        <Input
          className="sm:flex-1 sm:min-w-[180px]"
          onChange={(e) => updateFilters({ search: e.target.value })}
          placeholder="Search by name"
          value={filters.search}
        />
        <div className="flex gap-2 sm:gap-3">
          <select
            className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            onChange={(e) => updateFilters({ sort: e.target.value as SortKey })}
            value={filters.sort}
          >
            <option value="price-desc">Price High → Low</option>
            <option value="price-asc">Price Low → High</option>
            <option value="name-asc">Name A → Z</option>
            <option value="name-desc">Name Z → A</option>
          </select>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              $
            </span>
            <Input
              className="w-16"
              min={0}
              onChange={(e) => updateFilters({ minPrice: e.target.value })}
              placeholder="Min"
              type="number"
              value={filters.minPrice}
            />
            <span className="text-sm text-muted-foreground">-</span>
            <Input
              className="w-16"
              min={0}
              onChange={(e) => updateFilters({ maxPrice: e.target.value })}
              placeholder="Max"
              type="number"
              value={filters.maxPrice}
            />
          </div>
        </div>
      </div>

      <p className="text-muted-foreground text-sm">
        {displayedCards.length === cards.length
          ? `${cards.length} card${cards.length !== 1 ? 's' : ''} in your collection`
          : `${displayedCards.length} of ${cards.length} cards`}
      </p>

      {displayedCards.length === 0 && cards.length > 0 && (
        <p className="text-muted-foreground text-sm">
          No cards match your filters.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {displayedCards.map((card) => (
          <CardResult key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
