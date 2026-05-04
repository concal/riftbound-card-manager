const RAILWAY_BASE =
  'https://riftbound-card-manager-production.up.railway.app';

export default async (request: Request) => {
  const url = new URL(request.url);
  const target = `${RAILWAY_BASE}${url.pathname}${url.search}`;

  const headers = new Headers(request.headers);
  headers.set('host', 'riftbound-card-manager-production.up.railway.app');
  headers.delete('x-forwarded-host');

  const body =
    request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.arrayBuffer()
      : undefined;

  const response = await fetch(target, {
    method: request.method,
    headers,
    body,
    redirect: 'manual',
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
};

export const config = { path: '/api/*' };
