import { _CollectionModel } from '$lib/api/schemas';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';
import { validate } from '../../../lib/api/middleware/validate';
import { ApiResponseData } from '$lib/util';
import { Collection } from '@prisma/client';

const _CreateCollection = _CollectionModel.omit({ id: true });

const schemaMap = {
  GET: null,
  POST: _CreateCollection,
};

export default validate(schemaMap, async (req, res) => {
  switch (req.method as keyof typeof schemaMap) {
    case 'POST':
      const collection = await prisma.collection.create({
        data: req.body as z.infer<typeof _CreateCollection>,
      });

      return res
        .status(200)
        .json({ data: collection } as ApiResponseData<Collection>);
    case 'GET':
      const collections = await prisma.collection.findMany();

      return res
        .status(200)
        .json({ data: collections } as ApiResponseData<Collection[]>);
  }
});
