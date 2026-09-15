export const staffKeys = {
  all: ["staff"] as const,
  detail: (id: string) => ["staff", "detail", id] as const,
  filteredByName: (name: string) => ["staff", "filtered", name] as const,
  qualifications: (staffId: string) =>
    ["staff", "qualifications", staffId] as const,
  teachingProfile: (staffId: string) =>
    ["staff", "teaching-profile", staffId] as const,
};
