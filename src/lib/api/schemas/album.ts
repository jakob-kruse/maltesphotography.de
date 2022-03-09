import { maybeSlugify } from '$lib/util';
import { z } from 'zod';

import { CollectionSchema } from './collection';
import { FileSchema } from './file';

export const AlbumSchema = z
  .object({
    id: z.string(),
    urlName: z.string().nullish().transform(maybeSlugify),
    title: z.string(),
    description: z.string().nullish(),
    coverId: z.string().nullish(),
  })
  .strict();

export type Album = z.infer<typeof AlbumSchema>;

export const CreateAlbumSchema = AlbumSchema.omit({
  id: true,
  urlName: true,
}).extend({
  collectionId: z.string(),
});

export type CreateAlbum = z.infer<typeof CreateAlbumSchema>;

export const UpdateAlbumSchema = CreateAlbumSchema.partial();

export type UpdateAlbum = z.infer<typeof UpdateAlbumSchema>;

export const AlbumWithRelationsSchema = z.lazy(() =>
  AlbumSchema.extend({
    files: z.array(FileSchema),
  })
);

export type AlbumWithRelations = z.infer<typeof AlbumWithRelationsSchema>;
