import { validate } from '$lib/api/middleware/validate';
import { UpdateAlbum, UpdateAlbumSchema } from '$lib/api/schemas/album';
import { prisma } from '$lib/prisma';
import { ApiResponseData, ApiResponseError, ensureQueryParam } from '$lib/util';
import { Album } from '@prisma/client';
import { getSession } from 'next-auth/react';
import slugify from 'slugify';

const schemaMap = {
  PATCH: UpdateAlbumSchema,
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
      const deletedAlbum = await prisma.album.delete({
        where: {
          id,
        },
      });

      return res
        .status(200)
        .json({ data: deletedAlbum } as ApiResponseData<Album>);
    case 'PATCH':
      const updateData = req.body as UpdateAlbum;

      const existing = await prisma.album.findFirst({
        where: {
          id,
        },
      });

      if (!existing) {
        return res.status(404).json({
          error: {
            message: 'Album not found',
          },
        } as ApiResponseError);
      }

      const updatedCollection = await prisma.album.update({
        where: {
          id,
        },
        data: {
          ...updateData,
          urlName: slugify(updateData.title || existing.title, { lower: true }),
        },
      });

      return res
        .status(200)
        .json({ data: updatedCollection } as ApiResponseData<Album>);
  }
});
