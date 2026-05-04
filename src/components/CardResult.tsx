import { useState } from 'react';
import type { FormattedCardResponse } from '@/types/card';
import { useCollectionContext } from '@/context/CollectionContext';
import { CardDetailsModal } from '@/components/CardDetailsModal';
import { getDisplayPrice } from '@/util/priceUtils';

type ImageStatus = 'pending' | 'loaded' | 'error';

interface CardResultProps {
  card: FormattedCardResponse;
}

export function CardResult({ card }: CardResultProps) {
  const collection = useCollectionContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [imageLoadStatus, setImageLoadStatus] =
    useState<ImageStatus>('pending');

  if (imageLoadStatus === 'error') {
    return null;
  }

  const { id: cardId, imageUrl, name, setName } = card;
  const collectionQuantity = collection?.getQuantity(cardId) ?? 0;
  const displayPrice = getDisplayPrice(card);

  return (
    <>
      <div
        className={`flex flex-col items-center gap-2 w-fit max-w-[calc(50%-8px)] border border-border rounded-xl p-2 cursor-pointer hover:border-foreground/30 transition-colors${imageLoadStatus === 'pending' ? ' hidden' : ''}`}
        onClick={() => setModalOpen(true)}
      >
        <div className="relative w-fit max-w-full rounded-lg overflow-hidden shadow-md bg-muted">
          <img
            alt={name}
            className="max-h-[280px] w-auto max-w-full block"
            onError={() => setImageLoadStatus('error')}
            onLoad={() => setImageLoadStatus('loaded')}
            src={imageUrl!}
          />
          {collection && collectionQuantity > 0 && (
            <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-xs font-semibold px-1.5 py-0.5 rounded-md">
              {collectionQuantity}
            </span>
          )}
          <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-xs font-semibold px-1.5 py-0.5 rounded-md">
            {displayPrice != null ? `$${displayPrice.toFixed(2)}` : 'No price'}
          </span>
        </div>
        <div className="text-center w-full">
          <p
            className="text-sm font-semibold leading-tight truncate"
            title={name}
          >
            {name}
          </p>
          <p className="text-xs text-muted-foreground">{setName}</p>
        </div>
      </div>
      {modalOpen && (
        <CardDetailsModal card={card} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
