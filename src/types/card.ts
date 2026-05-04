export interface SearchCardResponse {
  id: number;
  name: string;
  set_name: string;
  rarity: string;
  product_type: string;
  foil_only: boolean;
  printing: string;
  image_url: string;
  market_price: number | null;
  low_price: number | null;
  median_price: number | null;
  lowest_with_shipping: number | null;
  total_listings: number;
  shipping_category_id: number;
  tcgplayer_id: number;
  price_change_24h: number | null;
}

export interface TcgplayerCardResponse {
  card: {
    id: number;
    name: string;
    set_name: string;
    rarity: string;
    product_type: string;
    foil_only: number;
    image_url: string;
    total_listings: number;
    shipping_category_id: number;
    tcgplayer_id: number;
  };
  prices: Array<{
    printing: string;
    market_price: number | null;
    low_price: number | null;
    median_price: number | null;
    lowest_with_shipping: number | null;
    price_change_24h: number | null;
  }>;
}

export type FormattedCardResponse = {
  id: number;
  name: string;
  setName: string;
  rarity: string;
  productType: string;
  foilOnly: boolean;
  printing: string;
  imageUrl: string;
  marketPrice: number | null;
  lowPrice: number | null;
  medianPrice: number | null;
  lowestWithShipping: number | null;
  totalListings: number;
  shippingCategoryId: number;
  tcgplayerId: number;
  priceChange24h: number | null;
};
