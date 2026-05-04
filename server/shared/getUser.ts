import { auth } from '../auth';

export async function getUser(reqContext: any) {
  const session = await auth.api.getSession({
    headers: reqContext.req.raw.headers,
  });
  if (!session) return null;
  return session.user;
}
