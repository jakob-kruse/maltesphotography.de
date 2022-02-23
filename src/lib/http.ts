import ky from 'ky';

export const client = ky.extend({
  prefixUrl: 'http://localhost:3000/api',
});
