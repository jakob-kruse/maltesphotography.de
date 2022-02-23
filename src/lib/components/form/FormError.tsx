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
      <p className="text-red-500 text-sm pt-2">{message ?? error.message}</p>
    );
  }
  return <></>;
}
