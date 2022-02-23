import { z } from 'zod';

export const RequiredIDModel = z.object({
  id: z.string(),
});

export type RequiredID = z.infer<typeof RequiredIDModel>;
