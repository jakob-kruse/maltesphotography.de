import { validate } from '$lib/api/middleware/validate';
import {
  Collection,
  CreateCollection,
  CreateCollectionSchema,
} from '$lib/api/schemas/collection';
import { prisma } from '$lib/prisma';
import type { ApiResponseData } from '$lib/util';
import { getSession } from 'next-auth/react';
import slugify from 'slugify';

const schemaMap = {
  GET: null,
  POST: CreateCollectionSchema,
};

export default validate(schemaMap, async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({
      error: {
        message: 'You must be logged in to perform this action.',
        details: null,
      },
    });
  }

  switch (req.method as keyof typeof schemaMap) {
    case 'POST': {
      const postData = req.body as CreateCollection;

      const collection = await prisma.collection.create({
        data: {
          ...postData,
          urlName: slugify(postData.title, { lower: true }),
        },
      });

      return res
        .status(200)
        .json({ data: collection } as ApiResponseData<Collection>);
    }
    case 'GET': {
      const collections = await prisma.collection.findMany();

      return res
        .status(200)
        .json({ data: collections } as ApiResponseData<Collection[]>);
    }
  }
});
