import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";

export function setFormErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  errors: Record<string, unknown> | null | undefined
): void {
  if (!errors) return;
  Object.entries(errors).forEach(([field, message]) => {
    setError(field as FieldPath<T>, {
      type: "server",
      message: message as string,
    });
  });
}
