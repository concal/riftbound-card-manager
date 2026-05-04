const TTL_MS = 12 * 60 * 60 * 1000;

export type ResolvedItem = {
  tcgplayer_id: number;
  card: unknown;
  prices: unknown[];
};

type CacheEntry = { item: ResolvedItem; cachedAt: number };

const store = new Map<number, CacheEntry>();

export function getCached(ids: number[]): {
  cached: ResolvedItem[];
  missing: number[];
} {
  const now = Date.now();
  const cached: ResolvedItem[] = [];
  const missing: number[] = [];

  for (const id of ids) {
    const entry = store.get(id);
    if (entry && now - entry.cachedAt < TTL_MS) {
      cached.push(entry.item);
    } else {
      missing.push(id);
    }
  }
  console.log(`[cache] ${cached.length} hit, ${missing.length} miss`);
  return { cached, missing };
}

export function setCached(items: ResolvedItem[]): void {
  const now = Date.now();
  for (const item of items) {
    store.set(item.tcgplayer_id, { item, cachedAt: now });
  }
}
