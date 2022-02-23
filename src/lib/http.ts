import ky from 'ky';

const protocol =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' ? 'http' : 'https';
const host = process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000';

export const client = ky.extend({
  prefixUrl: `${protocol}://${host}/api`,
});
