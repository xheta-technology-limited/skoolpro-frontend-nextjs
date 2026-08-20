export const authKeys = {
  all: ["sub-plans"] as const,
  detail: (id: string) => ["sub-plans", id] as const,
};
