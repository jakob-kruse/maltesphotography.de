import { validate } from '$lib/api/middleware/validate';
import { UpdateAlbum, UpdateAlbumSchema } from '$lib/api/schemas/album';
import { Collection, UpdateCollection } from '$lib/api/schemas/collection';
import { prisma } from '$lib/prisma';
import { ApiResponseData, ApiResponseError, ensureQueryParam } from '$lib/util';
import { Album } from '@prisma/client';

const schemaMap = {
  PATCH: UpdateAlbumSchema,
  DELETE: null,
};

export default validate(schemaMap, async (req, res) => {
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
      const deletedAlbum = await prisma.album.delete({
        where: {
          id,
        },
      });

      return res
        .status(200)
        .json({ data: deletedAlbum } as ApiResponseData<Album>);
    case 'PATCH':
      // fix the type. but this does not break anything so dont yell at me :(
      const updateData = req.body as any;
      const updatedCollection = await prisma.album.update({
        where: {
          id,
        },
        data: {
          ...updateData,
          id: undefined,
        },
      });

      return res
        .status(200)
        .json({ data: updatedCollection } as ApiResponseData<Album>);
  }
});
