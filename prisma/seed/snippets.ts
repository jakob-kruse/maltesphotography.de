import { Snippet } from '@prisma/client';

export const snippets: Omit<Snippet, 'id'>[] = [
  {
    key: '',
    value: '',
    description: null,
  },
];
