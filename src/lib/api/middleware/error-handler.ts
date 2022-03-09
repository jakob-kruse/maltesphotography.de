import { ApiResponse, ApiResponseError } from '$lib/util';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';

export type ErrorIdentifier = (
  error: unknown,
  req: NextApiRequest
) => { code: number; error: ApiResponseError['error'] } | undefined;

const errorIdentifiers: ErrorIdentifier[] = [
  (error) => {
    if (error instanceof ZodError) {
      return {
        code: 400,
        error: {
          message: 'Invalid request body',
          details: {
            issues: error.issues,
            formErrors: error.formErrors,
          },
        },
      };
    }
  },
  (error) => {
    if (error instanceof ZodError) {
      return {
        code: 400,
        error: {
          message: 'Invalid request body',
          details: {
            issues: error.issues,
            form: error.formErrors,
          },
        },
      };
    }
  },

  (error, req) => {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025' && req.method === 'DELETE') {
        return {
          code: 404,
          error: {
            message: 'Collection not found',
            details: null,
          },
        };
      }

      if (error.code === 'P2003') {
        let fieldName = 'Unknown';
        if (error.meta && 'field_name' in error.meta) {
          fieldName = (error.meta as { field_name: string }).field_name;
        }
        return {
          code: 404,
          error: {
            message: `Cannot find the relationship: "${fieldName}"`,
            details: null,
          },
        };
      }
    }
  },
];

function identifyError(error: unknown, req: NextApiRequest) {
  for (const errorIdentifier of errorIdentifiers) {
    const result = errorIdentifier(error, req);

    if (result) {
      return result;
    }
  }
}

export function errorHandler(handler: NextApiHandler<ApiResponse>) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      return await handler(req, res);
    } catch (error) {
      const identifiedError = identifyError(error, req);

      if (identifiedError) {
        return res
          .status(identifiedError.code)
          .json({ error: identifiedError.error } as ApiResponseError);
      }

      return {
        code: 500,
        error: {
          message: 'Internal server error',
          details: null,
        },
      };
    }
  };
}
