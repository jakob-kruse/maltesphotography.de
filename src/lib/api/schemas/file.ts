import { maybeSlugify } from '$lib/util';
import { z } from 'zod';

import { AlbumSchema } from './album';

export const FileSchema = z
  .object({
    id: z.string(),
    fileName: z.string(),
    urlName: z.string().nullish().transform(maybeSlugify),
    title: z.string(),
    description: z.string().min(1).nullish(),
    mimeType: z.string(),
    size: z.number(),
    width: z.number(),
    height: z.number(),
  })
  .strict();

export type File = z.infer<typeof FileSchema>;

export const CreateFileSchema = FileSchema.omit({
  id: true,
  fileName: true,
  mimeType: true,
  size: true,
  width: true,
  height: true,
}).extend({
  albumId: z.string().optional(),
});

export type CreateFile = z.infer<typeof CreateFileSchema>;

export const UpdateFileSchema = CreateFileSchema.partial();

export type UpdateFile = z.infer<typeof UpdateFileSchema>;

export const FileWithRelationsSchema = z.lazy(() =>
  FileSchema.extend({
    album: AlbumSchema,
  })
);

export type FileWithRelations = z.infer<typeof FileWithRelationsSchema>;
