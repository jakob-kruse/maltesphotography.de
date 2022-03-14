import { PrismaClient } from '@prisma/client';
import { unlink } from 'fs/promises';
import path from 'path';

import { File } from './api/schemas/file';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

async function unlinkFile(file: File) {
  return Promise.all([
    unlink(path.join('public', 'uploads', file.fileName)),
    unlink(path.join('public', 'uploads', 'thumbnails', file.fileName)),
  ]);
}

export const prisma =
  global.prisma ||
  (() => {
    const prisma = new PrismaClient({
      log: ['query'],
    });
    // When you change this hook, you have to restart the dev server
    prisma.$use(async (params, next) => {
      if (['delete', 'deleteMany'].includes(params.action)) {
        try {
          const file = await prisma.file.findFirst(params.args);
          if (file) {
            await unlinkFile(file);
          }
        } catch (error) {
          // less work i guess
        }
      }

      return next(params);
    });

    return prisma;
  })();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
