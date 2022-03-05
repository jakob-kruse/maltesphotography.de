import { ApiResponseError } from '$lib/util';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';

export function errorHandler(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      return await handler(req, res);
    } catch (error) {
      let errorCode = 500;
      let responseError: ApiResponseError['error'] | null = null;

      if (error instanceof ZodError) {
        errorCode = 400;
        responseError = {
          message: 'Invalid request body',
          details: {
            issues: error.issues,
            form: error.formErrors,
          },
        };
      } else if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025' && req.method === 'DELETE') {
          errorCode = 404;
          responseError = {
            message: 'Cannot delete a non-existent resource.',
            details: null,
          };
        }

        if (error.code === 'P2003') {
          let fieldName = 'Unknown';
          if (error.meta && 'field_name' in error.meta) {
            fieldName = (error.meta as { field_name: string }).field_name;
          }

          errorCode = 404;
          responseError = {
            message: `Cannot find the relationship: "${fieldName}"`,
            details: null,
          };
        }
      }

      if (responseError === null) {
        console.log(error);

        return res.status(errorCode);
      }

      return res.status(errorCode).json(responseError);
    }
  };
}
