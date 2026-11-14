export const roleKeys = {
  all: ["roles"] as const,
  detail: (id: string) => ["roles", id] as const,
  stats: ["roles", "stats"] as const,
};

export const permissionKeys = {
  all: ["permissions"] as const,
};
