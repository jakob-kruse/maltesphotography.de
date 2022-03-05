import { maybeSlugify } from '$lib/util';
import slugify from 'slugify';
import { z } from 'zod';

import { AlbumSchema } from './album';

export const CollectionSchema = z
  .object({
    id: z.string(),
    urlName: z.string().transform(maybeSlugify),
    title: z.string(),
    description: z.string().nullish(),
  })
  .strict();

export type Collection = z.infer<typeof CollectionSchema>;

export const CreateCollectionSchema = CollectionSchema.omit({ id: true });

export type CreateCollection = z.infer<typeof CreateCollectionSchema>;

export const UpdateCollectionSchema = CreateCollectionSchema.partial();

export type UpdateCollection = z.infer<typeof UpdateCollectionSchema>;

export const CollectionWithRelationsSchema = z.lazy(() =>
  CollectionSchema.extend({
    albums: z.array(AlbumSchema),
  })
);

export type CollectionWithRelations = z.infer<
  typeof CollectionWithRelationsSchema
>;
