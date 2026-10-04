import { PeopleCounts } from "@/features/user-management/api/get-count";

export interface Group {
  role: string;
  total: number;
  pageUrl: string;
  countKey?: keyof PeopleCounts;
}

export const USERS: Group[] = [
  {
    role: "Student",
    total: 0,
    pageUrl: "/super-admin/user-management/student-management",
    countKey: "student_count",
  },
  {
    role: "Staff",
    total: 0,
    pageUrl: "/super-admin/user-management/staff-management",
    countKey: "staff_count",
  },
  {
    role: "Parent",
    total: 0,
    pageUrl: "/super-admin/user-management/parent-management",
    countKey: "guardian_count",
  },
  {
    role: "Admin",
    total: 0,
    pageUrl: "/super-admin/user-management/admin-management",
  }, // no API field yet
  {
    role: "Role",
    total: 0,
    pageUrl: "/super-admin/user-management/role-management",
  }, // no API field yet
];
