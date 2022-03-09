import { ApiResponse } from '$lib/util';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { errorHandler } from './error-handler';

export type ApiMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type SchemaMap = Partial<Record<ApiMethod, any>>;

export function validate<TData = any, TError = any>(
  schemaMap: SchemaMap,
  handler: NextApiHandler<ApiResponse<TData, TError>>
) {
  return errorHandler(async function (
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method && req.method in schemaMap) {
      const schema = schemaMap[req.method as ApiMethod];

      if (schema !== null) {
        await schema.parseAsync(req.body);
      }

      return handler(req as NextApiRequest, res);
    }

    return res.status(405).json({
      message: `Method "${req.method}" is not supported.`,
    });
  });
}
