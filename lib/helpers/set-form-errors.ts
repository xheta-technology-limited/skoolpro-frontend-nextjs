import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";

export function setFormErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  errors: Record<string, unknown> | null | undefined
): void {
  if (!errors) return;
  Object.entries(errors).forEach(([field, message]) => {
    setError(field as FieldPath<T>, {
      type: "server",
      message: formattedMessage(message) as string,
    });
  });
}

const formattedMessage = (message: unknown) => {
  const stringified = message as string[];
  if (stringified[0].includes("required")) {
    return "This field is required";
  } else {
    return stringified;
  }
};
