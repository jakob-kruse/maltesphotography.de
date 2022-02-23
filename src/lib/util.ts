import { type ZodError } from 'zod';

export type ApiResponseData<TData = any> = {
  data: TData;
};

export type ApiResponseError<TErrorDetails = any> = {
  error: {
    message: string;
    details: TErrorDetails | null;
  };
};

export type ApiResponseFormError = ApiResponseError<{
  issues: ZodError['issues'];
  formErrors: ZodError['formErrors'];
}>;

export type ApiResponse<TData = any, TErrorDetails = any> =
  | ApiResponseData<TData>
  | ApiResponseError<TErrorDetails>;

export function ensureQueryParam(param: string | string[]) {
  if (Array.isArray(param) && param.length > 0) {
    return param[0];
  }

  return param as string;
}
