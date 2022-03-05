import { validate } from '$lib/api/middleware/validate';
import { UpdateCollection } from '$lib/api/schemas/collection';
import { File, UpdateFileSchema } from '$lib/api/schemas/file';
import { prisma } from '$lib/prisma';
import { ApiResponseData, ApiResponseError, ensureQueryParam } from '$lib/util';
import { promises as fs } from 'fs';

const schemaMap = {
  GET: null,
  PATCH: UpdateFileSchema,
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
    case 'GET': {
      const file = await prisma.file.findFirst({
        where: {
          id,
        },
      });

      if (!file) {
        return res.status(404).json({
          error: {
            message: 'File not found',
          },
        } as ApiResponseError);
      }

      return res.status(200).json({
        data: file,
      } as ApiResponseData<File>);
    }
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
      // fix the type. but this does not break anything so dont yell at me :(
      const updateData = req.body as any;

      const updatedCollection = await prisma.file.update({
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
        .json({ data: updatedCollection } as ApiResponseData<File>);
    }
  }
});
