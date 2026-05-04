import type { FormattedCardResponse } from '@/types/card';

export function getDisplayPrice(card: FormattedCardResponse): number | null {
  const { marketPrice, lowestWithShipping } = card;

  return lowestWithShipping || marketPrice || null;
}
