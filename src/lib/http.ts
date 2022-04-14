import ky from 'ky';

export const client = ky.extend({
  prefixUrl: `${process.env.NEXTAUTH_URL}/api`,
});
