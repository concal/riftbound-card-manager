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

const app = new Hono();

app.route('/api/collections', collectionRoutes);
app.route('/api/preferences', preferencesRoutes);

app.use(
  '/api/auth/*',
  cors({
    // TODO: Set up proper origins and credentials handling for production
    origin: process.env.BETTER_AUTH_TRUSTED_ORIGIN ?? 'http://localhost:5173',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    credentials: true,
  }),
);

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
 * Proxy endpoint for all other /api/v1/* requests to TCGAPI, with API key injection. This is a catch-all for any endpoints we haven't implemented server-side.
 *
 * TODO: Be mindful of potential security implications and consider restricting or implementing specific endpoints as needed for production use.
 */
app.all('/api/v1/*', async (reqContext) => {
  const url = new URL(reqContext.req.url);
  const targetUrl = `https://api.tcgapi.dev${url.pathname.replace(/^\/api/, '')}${url.search}`;
  const isPost = reqContext.req.method === 'POST';
  const res = await fetch(targetUrl, {
    method: reqContext.req.method,
    headers: {
      'X-API-Key': process.env.TCGAPI_KEY ?? '',
      ...(isPost ? { 'Content-Type': 'application/json' } : {}),
    },
    body: isPost ? await reqContext.req.text() : undefined,
  });
  return reqContext.json(
    await res.json(),
    res.status as Parameters<typeof reqContext.json>[1],
  );
});

// TODO: Determine if this should be changed in any way for production
const port = Number(process.env.PORT ?? 3001);

// TODO: Determine if this should be changed in any way for production
serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on http://localhost:${port}`);
});
