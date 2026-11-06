import type { Role } from "./api/role";

export type RoleDetail = Role & {
  permissions: string[];
};
