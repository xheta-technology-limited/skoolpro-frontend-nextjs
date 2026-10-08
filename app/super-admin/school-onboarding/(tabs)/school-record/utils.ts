import type {
  Campus,
  Contact,
  SchoolType,
} from "./types";

export function getOptionLabel(
  options: { label: string; value: string }[],
  value: string | undefined
): string {
  return (
    options.find((option) => option.value === value)?.label ??
    value ??
    ""
  );
}

export function getPrimaryContact(
  contacts: Contact[],
  types: string[]
): string {
  const normalizedTypes = types.map((type) =>
    type.toLowerCase()
  );

  const primary = contacts.find((contact) => {
    if (!contact.type) {
      return false;
    }

    return (
      normalizedTypes.includes(contact.type.toLowerCase()) &&
      contact.is_primary
    );
  });

  if (primary) {
    return primary.value;
  }

  return (
    contacts.find((contact) => {
      if (!contact.type) {
        return false;
      }

      return normalizedTypes.includes(
        contact.type.toLowerCase()
      );
    })?.value ?? ""
  );
}

export function getContactByLabel(
  contacts: Contact[],
  labels: string[]
): string {
  const normalizedLabels = labels.map((label) =>
    label.toLowerCase()
  );

  return (
    contacts.find((contact) => {
      if (!contact.label) {
        return false;
      }

      return normalizedLabels.includes(
        contact.label.toLowerCase()
      );
    })?.value ?? ""
  );
}

export function getSchoolTypes(
  types: SchoolType[]
): string[] {
  return types
    .filter((type) => type.is_active)
    .map((type) => type.slug);
}

export function getAddress(campuses: Campus[]): string {
  const campus =
    campuses.find((campus) => campus.is_primary) ?? campuses[0];

  if (!campus) {
    return "";
  }

  return campus.address_line_1 ?? "";
}

export function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "S"
  );
}

export function toDateOnly(
  value: string | undefined
): string {
  if (!value) {
    return "";
  }

  return value.split("T")[0];
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}