export const studentKeys = {
  all: ["students"] as const,
  byPage: (page: number) => ["students", "page", page] as const,
  detail: (id: string) => ["students", "detail", id] as const,
  filtered: (search: string, page?: number) =>
    ["students", "filtered", search, page ?? 0] as const,
};