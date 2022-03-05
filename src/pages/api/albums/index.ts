import { validate } from '$lib/api/middleware/validate';
import { Album, CreateAlbum, CreateAlbumSchema } from '$lib/api/schemas/album';
import { prisma } from '$lib/prisma';
import { ApiResponseData, ApiResponseError } from '$lib/util';
import slugify from 'slugify';

const schemaMap = {
  GET: null,
  POST: CreateAlbumSchema,
};

export default validate(schemaMap, async (req, res) => {
  switch (req.method as keyof typeof schemaMap) {
    case 'POST': {
      const postData = req.body as CreateAlbum;
      if (!postData.urlName) {
        postData.urlName = slugify(postData.title, {
          lower: true,
        });
      }

      const existingAlbum = await prisma.album.findFirst({
        where: {
          urlName: postData.urlName,
        },
      });

      if (existingAlbum) {
        return res.status(400).json({
          error: {
            message:
              'Album with this url name / title already exists. Please provide your own urlName or choose a different title',
          },
        });
      }

      if (postData.coverId) {
        const cover = await prisma.file.findFirst({
          where: {
            id: postData.coverId,
          },
        });

        if (!cover) {
          return res.status(400).json({
            error: {
              message: 'Cover file not found',
            },
          } as ApiResponseError);
        }
      }

      const album = await prisma.album.create({
        data: postData as CreateAlbum & { urlName: string },
      });

      return res.status(200).json({ data: album } as ApiResponseData<Album>);
    }

    case 'GET': {
      const albums = await prisma.album.findMany();

      return res.status(200).json({ data: albums } as ApiResponseData<Album[]>);
    }
  }
});
