export const departmentKeys = {
  all: ["departments"] as const,
  defaults: ["departments", "defaults"] as const,
  detail: (id: string) => ["departments", "detail", id] as const,
  filtered: (search?: string, active?: boolean, page?: number) =>
    ["departments", "filtered", search ?? "", active ?? null, page ?? 1] as const,
};
