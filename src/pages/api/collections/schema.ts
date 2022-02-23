import { z } from 'zod';

export const CreateCollectionSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const DeleteCollectionSchema = z.object({
  id: z.string(),
});

export const UpdateCollectionSchema = DeleteCollectionSchema.merge(
  CreateCollectionSchema
);
