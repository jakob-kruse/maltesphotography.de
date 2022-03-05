import { validate } from '$lib/api/middleware/validate';
import {
  Collection,
  CreateCollection,
  CreateCollectionSchema,
} from '$lib/api/schemas/collection';
import { prisma } from '$lib/prisma';
import type { ApiResponseData } from '$lib/util';
import slugify from 'slugify';

const schemaMap = {
  GET: null,
  POST: CreateCollectionSchema,
};

export default validate(schemaMap, async (req, res) => {
  switch (req.method as keyof typeof schemaMap) {
    case 'POST':
      const postData = req.body as CreateCollection;
      if (!postData.urlName) {
        postData.urlName = slugify(postData.title, {
          lower: true,
        });
      }

      const collection = await prisma.collection.create({
        data: req.body as CreateCollection & { urlName: string },
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
