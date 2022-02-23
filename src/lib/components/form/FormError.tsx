import { FieldError } from 'react-hook-form';

export function FormError({
  error,
  message,
}: {
  error?: FieldError;
  message?: string;
}) {
  if (error) {
    return (
      <p className="pt-2 text-sm text-red-500">{message ?? error.message}</p>
    );
  }
  return <></>;
}
