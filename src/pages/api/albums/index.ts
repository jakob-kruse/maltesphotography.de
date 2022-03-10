import { validate } from '$lib/api/middleware/validate';
import { Album, CreateAlbum, CreateAlbumSchema } from '$lib/api/schemas/album';
import { prisma } from '$lib/prisma';
import { ApiResponseData } from '$lib/util';
import { getSession } from 'next-auth/react';
import slugify from 'slugify';

const schemaMap = {
  GET: null,
  POST: CreateAlbumSchema,
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
      const postData = req.body as CreateAlbum;
      const urlName = slugify(postData.title, { lower: true });

      const existingAlbum = await prisma.album.findFirst({
        where: {
          urlName,
        },
      });

      if (existingAlbum) {
        return res.status(400).json({
          error: {
            message:
              'Album with this url name / title already exists. Please provide your own urlName or choose a different title',
            details: null,
          },
        });
      }

      const album = await prisma.album.create({
        data: {
          ...postData,
          urlName,
        },
      });

      return res.status(200).json({ data: album } as ApiResponseData<Album>);
    }

    case 'GET': {
      const albums = await prisma.album.findMany();

      return res.status(200).json({ data: albums } as ApiResponseData<Album[]>);
    }
  }
});
