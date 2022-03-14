import slugify from 'slugify';

export type ApiResponseData<TData = any> = {
  data: TData;
};

export type ApiResponseError<TErrorDetails = any> = {
  error: {
    message: string;
    details: TErrorDetails | null;
  };
};

export type ApiResponse<TData = any, TErrorDetails = any> =
  | ApiResponseData<TData>
  | ApiResponseError<TErrorDetails>;

export function ensureQueryParam(param?: string | string[]): string | null {
  if (!param) {
    return null;
  }

  if (Array.isArray(param) && param.length > 0) {
    return param[0];
  }

  return param as string;
}

export function combineClasses(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function maybeSlugify(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  return slugify(value, { lower: true });
}

export function ensureUrlName(input: {
  title: string;
  urlName?: string;
  [key: string]: any;
}) {
  const clone = { ...input };
  if (!input.urlName) {
    clone.urlName = maybeSlugify(input.title)!;
  }

  return clone as typeof input & { urlName: string };
}
