import ky from 'ky';

export const client = ky.extend({
  prefixUrl: `${process.env.NEXT_PUBLIC_URL}/api`,
  timeout: 20000,
});
