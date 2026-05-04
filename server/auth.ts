import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';

export const auth = betterAuth({
  // TODO: Replace local.db for production if needed
  database: new Database('./local.db'),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    // TODO: Set up proper origins and credentials handling for production
    process.env.BETTER_AUTH_TRUSTED_ORIGIN ?? 'http://localhost:5173',
  ],
});

export async function getUser(c: any) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return null;
  return session.user;
}
