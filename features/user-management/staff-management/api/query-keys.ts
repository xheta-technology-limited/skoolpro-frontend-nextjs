export const staffKeys = {
  all: ["staff"] as const,
  detail: (name: string) => ["staff", name] as const,
};
