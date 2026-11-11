export const staffKeys = {
  all: ["staff"] as const,
  picker: ["staff", "picker"] as const,
  byPage: (page: number) => ["staff", "page", page] as const,
  detail: (id: string) => ["staff", "detail", id] as const,
  filtered: (search: string, page?: number, department?: string) =>
    ["staff", "filtered", search, page ?? 0, department ?? ""] as const,
  qualifications: (staffId: string) =>
    ["staff", "qualifications", staffId] as const,
  teachingProfile: (staffId: string) =>
    ["staff", "teaching-profile", staffId] as const,
  payroll: (staffId: string) =>
    ["staff", "payroll", staffId] as const,
  linkedUser: (staffId: string) =>
    ["staff", "linked-user", staffId] as const,
};
