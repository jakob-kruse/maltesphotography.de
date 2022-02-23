import * as z from 'zod';

export const _CollectionModel = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
});
