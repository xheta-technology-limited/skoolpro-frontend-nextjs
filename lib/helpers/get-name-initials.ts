export function getNameInitials(name: string) {
  const [firstName, lastName] = name.trim().split(/\s+/);

  return `${firstName[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}
