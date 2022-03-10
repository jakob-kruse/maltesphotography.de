import { maybeSlugify } from '$lib/util';
import { z } from 'zod';

import { AlbumSchema } from './album';
import { FileSchema } from './file';

export const CollectionSchema = z
  .object({
    id: z.string(),
    title: z.string().min(1),
    urlName: z.string().min(1).transform(maybeSlugify),
    description: z.string().nullish(),
    coverId: z.string().nullish(),
  })
  .strict();

export type Collection = z.infer<typeof CollectionSchema>;

export const CreateCollectionSchema = CollectionSchema.omit({
  id: true,
  urlName: true,
});

export type CreateCollection = z.infer<typeof CreateCollectionSchema>;

export const UpdateCollectionSchema = CreateCollectionSchema.partial();

export type UpdateCollection = z.infer<typeof UpdateCollectionSchema>;

export const CollectionWithRelationsSchema = z.lazy(() =>
  CollectionSchema.extend({
    albums: z.array(AlbumSchema),
    cover: FileSchema.nullish(),
  })
);

export type CollectionWithRelations = z.infer<
  typeof CollectionWithRelationsSchema
>;
