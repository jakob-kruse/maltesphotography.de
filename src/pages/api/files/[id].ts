import { validate } from '$lib/api/middleware/validate';
import { File, UpdateFile, UpdateFileSchema } from '$lib/api/schemas/file';
import { prisma } from '$lib/prisma';
import { ApiResponseData, ApiResponseError, ensureQueryParam } from '$lib/util';
import { promises as fs } from 'fs';
import { getSession } from 'next-auth/react';
import slugify from 'slugify';

const schemaMap = {
  GET: null,
  PATCH: UpdateFileSchema,
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
    case 'DELETE': {
      const deletedFile = await prisma.file.delete({
        where: {
          id,
        },
      });

      try {
        const fileStats = await fs.stat(`uploads/${deletedFile.fileName}`);

        if (fileStats.isFile()) {
          await fs.unlink(`uploads/${deletedFile.fileName}`);
        }
      } catch (error) {
        // whatever xd
      }

      return res
        .status(200)
        .json({ data: deletedFile } as ApiResponseData<File>);
    }
    case 'PATCH': {
      const patchData = req.body as UpdateFile;

      const existing = await prisma.file.findFirst({
        where: {
          id,
        },
      });

      if (!existing) {
        return res.status(404).json({
          error: {
            message: 'File not found',
          },
        } as ApiResponseError);
      }

      const updatedCollection = await prisma.file.update({
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
        .json({ data: updatedCollection } as ApiResponseData<File>);
    }
  }
});
