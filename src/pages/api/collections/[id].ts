import { prisma } from '$lib/prisma';
import { _CollectionModel } from '$lib/api/schemas';
import { ApiResponseData, ensureQueryParam } from '$lib/util';
import { z } from 'zod';
import { validate } from '$lib/api/middleware/validate';
import { Collection } from '@prisma/client';

const _CreateCollection = _CollectionModel.omit({ id: true });
const _UpdateCollection = _CreateCollection.merge(_CreateCollection.partial());

const schemaMap = {
  PATCH: _UpdateCollection,
  DELETE: null,
};

export default validate(schemaMap, async (req, res) => {
  const id = ensureQueryParam(req.query.id);

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
      const patchData = req.body as z.infer<typeof _UpdateCollection>;
      const updatedCollection = await prisma.collection.update({
        where: {
          id,
        },
        data: {
          ...patchData,
          id: undefined,
        },
      });

      return res
        .status(200)
        .json({ data: updatedCollection } as ApiResponseData<Collection>);
  }
});
