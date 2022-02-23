import { z } from 'zod';
import { prisma } from '../../../lib/prisma';
import { validate } from '../middleware';
import {
  CreateCollectionSchema,
  DeleteCollectionSchema,
  UpdateCollectionSchema,
} from './schema';

export default validate(
  {
    POST: CreateCollectionSchema,
  },
  async (req, res) => {
    switch (req.method) {
      case 'POST':
        const collection = await prisma.collection.create({
          data: req.body as z.infer<typeof CreateCollectionSchema>,
        });

        return res.status(200).json(collection);

      case 'DELETE':
        const deleteData = req.body as z.infer<typeof DeleteCollectionSchema>;

        const collectionToDelete = await prisma.collection.delete({
          where: {
            id: deleteData.id,
          },
        });

        return res.status(200).json(collectionToDelete);
      case 'PUT':
        const putData = req.body as z.infer<typeof UpdateCollectionSchema>;

        const updatedCollection = await prisma.collection.update({
          where: {
            id: putData.id,
          },
          data: {
            ...putData,
            id: undefined,
          },
        });

        return res.status(200).json(updatedCollection);
      default:
        return res.status(200).json(await prisma.collection.findMany());
    }
  }
);
