import { createContext, useContext } from 'react';
import { useCollection } from '@/hooks/useCollection';

type CollectionContextType = ReturnType<typeof useCollection>;

const defaultCollectionContext: CollectionContextType = {
  addCard: async () => {
    return null as unknown as Response;
  },
  cardCountMap: new Map(),
  cardDataLoading: false,
  cards: [],
  collectionLoading: false,
  displayedCards: [],
  filters: {
    search: '',
    sort: 'price-desc',
    minPrice: '',
    maxPrice: '',
  },
  getQuantity: () => 0,
  isInCollection: () => false,
  removeCard: async () => {
    return null as unknown as Response;
  },
  tcgplayerIdMap: new Map(),
  updateFilters: () => {},
  saving: false,
};

export const CollectionContext = createContext<
  ReturnType<typeof useCollection>
>(defaultCollectionContext);

export function CollectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const collection = useCollection();

  return (
    <CollectionContext.Provider value={collection}>
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollectionContext() {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error(
      'useCollectionContext must be used within a CollectionProvider',
    );
  }
  return context;
}
