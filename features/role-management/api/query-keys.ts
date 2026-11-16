export const roleKeys = {
  all: ["roles"] as const,
  detail: (id: string) => ["roles", id] as const,
  stats: ["roles", "stats"] as const,
  filtered: (role_type?: string, disabled?: boolean, page?: number) =>
    [
      "roles",
      "filtered",
      role_type ?? "",
      disabled ?? null,
      page ?? "",
    ] as const,
};

export const permissionKeys = {
  all: ["permissions"] as const,
};
