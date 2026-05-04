import { useCallback, useMemo } from 'react';
import { useCollectionContext } from '@/context/CollectionContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getDisplayPrice } from '@/util/priceUtils';
import type { FormattedCardResponse } from '@/types/card';

interface CardDetailsModalProps {
  card: FormattedCardResponse;
  onClose: () => void;
}

export function CardDetailsModal({ card, onClose }: CardDetailsModalProps) {
  const { addCard, getQuantity, removeCard, saving } = useCollectionContext();

  const {
    id: cardId,
    imageUrl,
    marketPrice,
    name,
    priceChange24h,
    rarity,
    setName,
    tcgplayerId,
  } = card;

  const collectionQuantity = getQuantity(cardId);

  const renderedPrice = useMemo(() => {
    const displayPrice = getDisplayPrice(card);
    if (!displayPrice) {
      return <span>No price found</span>;
    }
    return (
      <>
        ${displayPrice.toFixed(2)}
        {priceChange24h != null && (
          <span
            className={`ml-1.5 text-xs ${priceChange24h > 0 ? 'text-green-500' : priceChange24h < 0 ? 'text-red-500' : 'text-muted-foreground'}`}
          >
            ({priceChange24h >= 0 ? '+' : ''}
            {priceChange24h.toFixed(2)}%)
          </span>
        )}
      </>
    );
  }, [marketPrice, priceChange24h]);

  const handleAdd = useCallback(async () => {
    await addCard({ cardId, tcgplayerId });
  }, [addCard, cardId, tcgplayerId]);

  const handleRemove = useCallback(async () => {
    await removeCard({ cardId });
  }, [cardId, removeCard]);

  return (
    <Dialog onOpenChange={onClose} open={true}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <img
            src={imageUrl!.replace('/fit-in/400x400', '')}
            alt={name}
            className="w-full rounded-lg shadow-md"
          />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Set</span>
              <span className="font-medium">{setName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rarity</span>
              <span className="font-medium">{rarity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Market Price</span>
              <span className="font-medium">{renderedPrice}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              disabled={saving}
              onClick={handleRemove}
              size="sm"
              variant="outline"
            >
              -
            </Button>
            <span className="flex-1 text-center text-sm font-medium">
              {collectionQuantity} in collection
            </span>
            <Button disabled={saving} onClick={handleAdd} size="sm">
              +
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
