import { Hono } from 'hono';
import { getUser } from '../auth';
import { getDb } from '../db/mongo';

type UserPreferences = {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  defaultSort: 'price-desc' | 'price-asc' | 'name-asc' | 'name-desc';
};

const DEFAULTS: Omit<UserPreferences, 'userId'> = {
  theme: 'system',
  defaultSort: 'price-desc',
};

const preferences = new Hono();

/**
 * GET /preferences - returns the user's preferences
 */
preferences.get('/', async (reqContext) => {
  const user = await getUser(reqContext);
  if (!user) return reqContext.json({ error: 'Unauthorized' }, 401);

  const db = await getDb();
  const document = await db
    .collection<UserPreferences>('preferences')
    .findOne({ userId: user.id });
  return reqContext.json({ ...DEFAULTS, ...document });
});

/**
 * PUT /preferences - updates the user's preferences (expects JSON body with theme and/or defaultSort)
 */
preferences.put('/', async (reqContext) => {
  const user = await getUser(reqContext);
  if (!user) return reqContext.json({ error: 'Unauthorized' }, 401);

  const body = await reqContext.req.json<Partial<UserPreferences>>();

  const VALID_THEMES = ['light', 'dark', 'system'] as const;
  const VALID_SORTS = ['price-desc', 'price-asc', 'name-asc', 'name-desc'] as const;

  const update: Partial<Omit<UserPreferences, 'userId'>> = {};
  if (body.theme !== undefined) {
    if (!VALID_THEMES.includes(body.theme)) {
      return reqContext.json({ error: 'Invalid theme' }, 400);
    }
    update.theme = body.theme;
  }
  if (body.defaultSort !== undefined) {
    if (!VALID_SORTS.includes(body.defaultSort)) {
      return reqContext.json({ error: 'Invalid defaultSort' }, 400);
    }
    update.defaultSort = body.defaultSort;
  }

  const db = await getDb();

  await db
    .collection<UserPreferences>('preferences')
    .updateOne(
      { userId: user.id },
      { $set: { userId: user.id, ...update } },
      { upsert: true },
    );

  const document = await db
    .collection<UserPreferences>('preferences')
    .findOne({ userId: user.id });
  return reqContext.json({ ...DEFAULTS, ...document });
});

export { preferences as preferencesRoutes };
