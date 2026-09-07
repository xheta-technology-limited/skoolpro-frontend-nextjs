export interface Group {
  role: string;
  total: number;
  pageUrl: string;
}

export const USERS: Group[] = [
  {
    role: "Student",
    total: 0,
    pageUrl: "/super-admin/user-management/student-management",
  },
  {
    role: "Staff",
    total: 0,
    pageUrl: "/super-admin/user-management/staff-management",
  },
  {
    role: "Parent",
    total: 0,
    pageUrl: "/super-admin/user-management/parent-management",
  },
  {
    role: "Admin",
    total: 0,
    pageUrl: "/super-admin/user-management/admin-management",
  },
  {
    role: "Role",
    total: 0,
    pageUrl: "/super-admin/user-management/role-management",
  },
];
