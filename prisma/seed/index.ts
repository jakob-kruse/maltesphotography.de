import { PrismaClient } from '@prisma/client';

import { snippets } from './snippets';

const prisma = new PrismaClient();

async function main() {
  await prisma.snippet.createMany({ data: snippets });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
