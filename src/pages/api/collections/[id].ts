import { validate } from '$lib/api/middleware/validate';
import {
  Collection,
  UpdateCollection,
  UpdateCollectionSchema,
} from '$lib/api/schemas/collection';
import { prisma } from '$lib/prisma';
import { ApiResponseData, ApiResponseError, ensureQueryParam } from '$lib/util';
import { getSession } from 'next-auth/react';
import slugify from 'slugify';

const schemaMap = {
  PATCH: UpdateCollectionSchema,
  DELETE: null,
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

  const id = ensureQueryParam(req.query.id);

  if (!id) {
    return res.status(400).json({
      error: {
        message: 'Missing id query param',
      },
    } as ApiResponseError);
  }

  switch (req.method as keyof typeof schemaMap) {
    case 'DELETE':
      const deletedCollection = await prisma.collection.delete({
        where: {
          id,
        },
      });

      return res
        .status(200)
        .json({ data: deletedCollection } as ApiResponseData<Collection>);
    case 'PATCH':
      const patchData = req.body as UpdateCollection;
      const existing = await prisma.collection.findFirst({
        where: {
          id,
        },
      });

      if (!existing) {
        return res.status(404).json({
          error: {
            message: 'Collection not found',
          },
        } as ApiResponseError);
      }

      const updatedCollection = await prisma.collection.update({
        where: {
          id,
        },
        data: {
          ...patchData,
          urlName: slugify(patchData.title || existing.title, { lower: true }),
          id: undefined,
        },
      });

      return res
        .status(200)
        .json({ data: updatedCollection } as ApiResponseData<Collection>);
  }
});
