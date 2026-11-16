export const roleKeys = {
  all: ["roles"] as const,
  detail: (id: string) => ["roles", id] as const,
  stats: ["roles", "stats"] as const,
  filtered: (role_type?: string, disabled?: boolean) =>
    ["roles", "filtered", role_type ?? "", disabled ?? null] as const,
};

export const permissionKeys = {
  all: ["permissions"] as const,
};
