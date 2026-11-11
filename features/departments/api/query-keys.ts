/** Query-key factory for department queries. */
export const departmentKeys = {
  all: ["departments"] as const,
  defaults: ["departments", "defaults"] as const,
  detail: (id: string) => ["departments", "detail", id] as const,
  /** Key for a filtered, paginated list; includes every request param. */
  filtered: (
    search?: string,
    active?: boolean,
    page?: number,
    perPage?: number
  ) =>
    [
      "departments",
      "filtered",
      search ?? "",
      active ?? null,
      page ?? 1,
      perPage ?? 15,
    ] as const,
};
