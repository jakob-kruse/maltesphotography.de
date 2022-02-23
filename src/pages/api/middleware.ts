import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type SchemaMap = Partial<Record<Method, any>>;

export function validate(schemata: SchemaMap, handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method && req.method in schemata) {
      const schema = schemata[req.method as Method];
      const validationResult = await schema.safeParseAsync(req.body);

      if (!validationResult.success) {
        return res.status(400).json(validationResult.error);
      }
    }
    return handler(req as NextApiRequest, res);
  };
}
