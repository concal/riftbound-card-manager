import { Hono } from 'hono';
import { getUser } from '../auth';
import { getDb } from '../db/mongo';

type CardEntry = {
  cardId: number;
  tcgplayerId: number;
  quantity: number;
};

type UserCollection = { userId: string; cards: CardEntry[] };

const collection = new Hono();

/**
 * GET /cards - Returns the user's full collection as an array of card entries (cardId, tcgplayerId, quantity)
 */
collection.get('/', async (reqContext) => {
  const user = await getUser(reqContext);
  if (!user) return reqContext.json({ error: 'Unauthorized' }, 401);

  const db = await getDb();
  const allUserCollections = db.collection<UserCollection>('collections');
  const document = await allUserCollections.findOne({ userId: user.id });

  return reqContext.json({ cards: document?.cards ?? [] });
});

/**
 * POST /cards/:cardId - Adds a card to the user's collection, or increments quantity if already present
 */
collection.post('/cards/:cardId', async (reqContext) => {
  const user = await getUser(reqContext);
  if (!user) return reqContext.json({ error: 'Unauthorized' }, 401);

  const db = await getDb();
  const allUserCollections = db.collection<UserCollection>('collections');

  const { tcgplayerId } = await reqContext.req.json<{ tcgplayerId: number }>();
  const { cardId } = reqContext.req.param();
  const cardIdAsNumber = parseInt(cardId, 10);

  // Try to increment an existing entry
  const increment = await allUserCollections.updateOne(
    { userId: user.id, 'cards.cardId': cardIdAsNumber },
    { $inc: { 'cards.$.quantity': 1 } },
  );

  // Create new entry in array if card isn't already in collection
  if (increment.matchedCount === 0) {
    await allUserCollections.updateOne(
      { userId: user.id },
      {
        $push: { cards: { cardId: cardIdAsNumber, tcgplayerId, quantity: 1 } },
      },
      { upsert: true },
    );
  }

  const document = await allUserCollections.findOne({ userId: user.id });
  return reqContext.json({ cards: document?.cards });
});

/**
 * DELETE /cards/:cardId - Remove a card from the collection (decrement quantity, remove entry if quantity hits 0)
 */
collection.delete('/cards/:cardId', async (reqContext) => {
  const user = await getUser(reqContext);
  if (!user) return reqContext.json({ error: 'Unauthorized' }, 401);

  const db = await getDb();
  const allUserCollections = db.collection<UserCollection>('collections');

  const { cardId } = reqContext.req.param();
  const cardIdAsNumber = parseInt(cardId, 10);

  // Decrement the existing entry
  await allUserCollections.updateOne(
    { userId: user.id, 'cards.cardId': cardIdAsNumber },
    { $inc: { 'cards.$.quantity': -1 } },
  );

  // Remove the entry if quantity has dropped to zero
  await allUserCollections.updateOne(
    { userId: user.id },
    {
      $pull: {
        cards: { cardId: { $eq: cardIdAsNumber }, quantity: { $lte: 0 } },
      },
    },
  );

  const document = await allUserCollections.findOne({ userId: user.id });
  return reqContext.json({ cards: document?.cards ?? [] });
});

export { collection as collectionRoutes };
