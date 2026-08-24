export const schoolProfileKeys = {
  all: ["school-profile"] as const,
  detail: (id: string) => ["school-profile", id] as const,
};
