import type {
  FormattedCardResponse,
  SearchCardResponse,
  TcgplayerCardResponse,
} from '@/types/card';
import { API_BASE } from '@/lib/api';

function formatSearchCardResponse(
  card: SearchCardResponse,
): FormattedCardResponse {
  return {
    id: card.id,
    name: card.name,
    setName: card.set_name,
    rarity: card.rarity,
    productType: card.product_type,
    foilOnly: card.foil_only,
    printing: card.printing,
    imageUrl: card.image_url,
    marketPrice: card.market_price,
    lowPrice: card.low_price,
    medianPrice: card.median_price,
    lowestWithShipping: card.lowest_with_shipping,
    totalListings: card.total_listings,
    shippingCategoryId: card.shipping_category_id,
    tcgplayerId: card.tcgplayer_id,
    priceChange24h: card.price_change_24h,
  };
}

// Helper function to convert TcgplayerCardResponse to the format used by our frontend
function formatTcgplayerCardResponse(
  card: TcgplayerCardResponse,
): FormattedCardResponse {
  return {
    id: card.card.id,
    name: card.card.name,
    setName: card.card.set_name,
    rarity: card.card.rarity,
    productType: card.card.product_type,
    foilOnly: Boolean(card.card.foil_only),
    printing: card.prices[0]?.printing ?? 'unknown',
    imageUrl: card.card.image_url,
    marketPrice: card.prices[0]?.market_price ?? null,
    lowPrice: card.prices[0]?.low_price ?? null,
    medianPrice: card.prices[0]?.median_price ?? null,
    lowestWithShipping: card.prices[0]?.lowest_with_shipping ?? null,
    totalListings: card.card.total_listings,
    shippingCategoryId: card.card.shipping_category_id,
    tcgplayerId: card.card.tcgplayer_id,
    priceChange24h: card.prices[0]?.price_change_24h ?? null,
  };
}

const GAME_SLUG = 'riftbound-league-of-legends-trading-card-game';
const PER_PAGE = 100;

export async function fetchTcgApiSearchResults({
  query,
  page = 1,
}: {
  query: string;
  page?: number;
}) {
  const searchParams = `q=${encodeURIComponent(query)}&game=${GAME_SLUG}&type=Cards&per_page=${PER_PAGE}&page=${page}`;
  return fetch(`${API_BASE}/api/v1/search?${searchParams}`)
    .then((resp) => resp.json())
    .then((data: { data: SearchCardResponse[] }) =>
      (data.data ?? []).map(formatSearchCardResponse),
    );
}

// async function fetchAllPages(query: string): Promise<CardResponse[]> {
//   const searchParams = `q=${encodeURIComponent(query)}&game=${GAME_SLUG}&type=Cards&per_page=${PER_PAGE}`

//   const first = await fetch(`${BASE_URL}?${searchParams}&page=1`)
//   if (!first.ok) throw new Error(`API error: ${first.status} ${first.statusText}`)
//   const firstData: SearchResponse = await first.json()

//   const totalPages = Math.ceil(firstData.meta.total / PER_PAGE)
//   if (totalPages <= 1) return firstData.data

//   const remaining = await Promise.all(
//     Array.from({ length: totalPages - 1 }, (_, i) =>
//       fetch(`${BASE_URL}?${searchParams}&page=${i + 2}`)
//         .then((r) => r.json() as Promise<SearchResponse>)
//         .then((d) => d.data)
//     )
//   )

//   return [firstData.data, ...remaining].flat()
// }

export async function fetchCardDetailsByTcgplayerId({
  ids,
}: {
  ids: number[];
}) {
  return fetch(`${API_BASE}/api/v1/bulk/resolve/tcgplayer`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  })
    .then((resp) => resp.json())
    .then((data: { data: { resolved: TcgplayerCardResponse[] } }) =>
      (data.data.resolved ?? []).map(formatTcgplayerCardResponse),
    );
}
