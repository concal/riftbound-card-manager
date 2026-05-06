import { Search } from 'lucide-react';

interface SearchEmptyStateProps {
  searched: boolean;
}

export function SearchEmptyState({ searched }: SearchEmptyStateProps) {
  if (searched) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <Search className="size-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">No results found</p>
        <p className="text-xs text-muted-foreground/60">Try a different card name</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex items-center justify-center size-14 rounded-2xl bg-muted">
        <Search className="size-6 text-muted-foreground/60" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Search for cards</p>
        <p className="text-xs text-muted-foreground">Enter a card name above to get started</p>
      </div>
    </div>
  );
}
