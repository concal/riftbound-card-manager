import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './auth';
import { collectionRoutes } from './routes/collection';
import { preferencesRoutes } from './routes/preferences';
import { getCached, setCached, type ResolvedItem } from './cardCache';

const TCGAPI_BATCH_LIMIT = 100;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

const app = new Hono();

app.use(
  '*',
  cors({
    origin: (origin) => (ALLOWED_ORIGINS.includes(origin) ? origin : null),
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);

app.route('/api/collections', collectionRoutes);
app.route('/api/preferences', preferencesRoutes);

app.on(['POST', 'GET'], '/api/auth/*', (reqContext) =>
  auth.handler(reqContext.req.raw),
);

/**
 * POST /api/v1/bulk/resolve/tcgplayer - Proxy endpoint for bulk resolving TCGPlayer IDs with caching to reduce redundant requests to TCGAPI
 */
app.post('/api/v1/bulk/resolve/tcgplayer', async (reqContext) => {
  const { ids } = await reqContext.req.json<{ ids: number[] }>();
  const { cached, missing } = getCached(ids);

  let fresh: ResolvedItem[] = [];
  if (missing.length) {
    const batches = chunk(missing, TCGAPI_BATCH_LIMIT);
    const results = await Promise.all(
      batches.map((batch) =>
        fetch('https://api.tcgapi.dev/v1/bulk/resolve/tcgplayer', {
          method: 'POST',
          headers: {
            'X-API-Key': process.env.TCGAPI_KEY ?? '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: batch }),
        })
          .then((r) => r.json())
          .then(
            (data: { data: { resolved: ResolvedItem[] } }) =>
              data.data.resolved ?? [],
          ),
      ),
    );
    fresh = results.flat();
    setCached(fresh);
  }

  return reqContext.json({
    data: { resolved: [...cached, ...fresh], not_found: [] },
  });
});

/**
 * GET /api/v1/search - Proxy for TCGAPI card search
 */
app.get('/api/v1/search', async (reqContext) => {
  const url = new URL(reqContext.req.url);
  const targetUrl = `https://api.tcgapi.dev/v1/search${url.search}`;
  const res = await fetch(targetUrl, {
    headers: { 'X-API-Key': process.env.TCGAPI_KEY ?? '' },
  });
  return reqContext.json(
    await res.json(),
    res.status as Parameters<typeof reqContext.json>[1],
  );
});

const port = Number(process.env.PORT ?? 3001);

// TODO: Determine if this should be changed in any way for production
serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on http://localhost:${port}`);
});
