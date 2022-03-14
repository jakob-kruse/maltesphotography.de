import { validate } from '$lib/api/middleware/validate';
import { CreateFile, CreateFileSchema, File } from '$lib/api/schemas/file';
import { prisma } from '$lib/prisma';
import { ApiResponseData, ApiResponseError, maybeSlugify } from '$lib/util';
import cuid from 'cuid';
import formidable, {
  Fields as FormidableFields,
  File as FormidableFile,
  Files as FormidableFiles,
} from 'formidable';
import { mkdir, unlink } from 'fs/promises';
import { IncomingMessage } from 'http';
import { getSession } from 'next-auth/react';
import path from 'path';
import sharp, { Metadata, Sharp } from 'sharp';
import { z } from 'zod';

export const config = {
  api: {
    bodyParser: false,
  },
};

const schemaMap = {
  GET: null,
  POST: null,
};

const uploadDir = path.join('public', 'uploads');
const thumbnailDir = path.join(uploadDir, 'thumbnails');

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
      await mkdir(thumbnailDir, { recursive: true });
      const { file, formFile } = await handleFileUpload(req);

      const sharpFile = sharp(formFile.filepath).rotate();

      const watermarked = await addWatermark(sharpFile);
      await watermarked.toFile(path.join(uploadDir, file.fileName));

      const thumbnail = sharp(path.join(uploadDir, file.fileName)).rotate();

      await thumbnail
        .resize(Math.round(file.width / 24), null)
        .sharpen()
        .withMetadata()
        .toFile(path.join(thumbnailDir, file.fileName));

      await unlink(formFile.filepath);

      return res.status(200).json({
        data: file,
      });
    }
    case 'GET': {
      const files = await prisma.file.findMany();

      return res.status(200).json({ data: files } as ApiResponseData<File[]>);
    }
  }
});

async function handleFileUpload(req: IncomingMessage) {
  const fileId = cuid();
  await mkdir(uploadDir, { recursive: true });

  const formData = formidable({
    keepExtensions: true,
    multiples: false,
    filename: (_name, ext) => {
      return fileId + ext;
    },
  });

  const {
    fields: formFields,
    files: uploadedFiles,
  }: {
    fields: FormidableFields;
    files: FormidableFiles;
  } = await new Promise((res, rej) => {
    formData.parse(req, (err, fields, files) => {
      if (err !== null) {
        rej(err);
        return;
      }

      res({ fields, files });
    });
  });

  const postData = await CreateFileSchema.extend({
    featured: z.string().optional().default('false'),
  }).parseAsync(formFields);

  if (!postData.urlName) {
    postData.urlName = maybeSlugify(postData.title);
  }

  if (uploadedFiles.file === undefined) {
    throw {
      error: {
        message: 'File is required',
      },
    } as ApiResponseError;
  }

  if (Array.isArray(uploadedFiles.file)) {
    throw {
      error: {
        message: 'You can only upload one file at once',
      },
    } as ApiResponseError;
  }

  const uploadedFile = uploadedFiles.file as FormidableFile;

  if (!uploadedFile.mimetype) {
    throw {
      error: {
        message: 'File has no mime type',
      },
    } as ApiResponseError;
  }
  const size = await sharp(uploadedFile.filepath).metadata();

  if (!size || size.width === undefined || size.height === undefined) {
    throw {
      error: {
        message: 'File has no width or height',
      },
    } as ApiResponseError;
  }

  const file = await prisma.file.create({
    data: {
      ...(postData as CreateFile & { urlName: string; featured: never }),
      featured: postData.featured === 'true',
      id: fileId,
      fileName: uploadedFile.newFilename,
      mimeType: uploadedFile.mimetype,
      size: uploadedFile.size,
      height: size?.height,
      width: size?.width,
    },
  });

  return {
    file,
    formFile: uploadedFile,
  };
}

let logoData: {
  logo: Sharp;
  metaData: Metadata;
};

async function getLogo() {
  if (!logoData) {
    const logo = sharp(path.join('public', 'images', 'Logo.png'));
    const metaData = await logo.metadata();

    logoData = {
      logo,
      metaData,
    };
  }

  return logoData;
}

async function addWatermark(file: Sharp) {
  const logoData = await getLogo();

  return file.clone().composite([
    {
      input: await logoData.logo.toBuffer(),
      blend: 'soft-light',
      gravity: 'southwest',
    },
  ]);
}
