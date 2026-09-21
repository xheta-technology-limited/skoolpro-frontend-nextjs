export const campusKeys = {
  all: ["campuses"] as const,
  detail: (id: string) => ["campuses", id] as const,
};