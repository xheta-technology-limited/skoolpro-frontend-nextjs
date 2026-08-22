import { type ElementType } from "react";

export type DashboardNavigationItem = {
  label: string;
  href: string;
  icon: ElementType | null;
  children?: DashboardNavigationItem[];
  keywords?: string[];
};

export const dashboardNavigation: DashboardNavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: null,
  },
  {
    label: "User management",
    href: "/dashboard/users",
    icon: null,
  },
  {
    label: "Fee management",
    href: "/dashboard/fees",
    icon: null,
  },
  {
    label: "Curriculum management",
    href: "/dashboard/curriculum",
    icon: null,
  },
  {
    label: "Exam management",
    href: "/dashboard/exams",
    icon: null,
  },
  {
    label: "Hostel management",
    href: "/dashboard/hostel",
    icon: null,
  },
  {
    label: "Health management",
    href: "/dashboard/health",
    icon: null,
  },
  {
    label: "Library management",
    href: "/dashboard/library",
    icon: null,
  },
  {
    label: "Transport management",
    href: "/dashboard/transport",
    icon: null,
  },
  {
    label: "School Onboarding",
    href: "/dashboard/onboarding",
    icon: null,
  },
  {
    label: "Notification management",
    href: "/dashboard/notifications",
    icon: null,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: null,
  },
  {
    label: "Logout",
    href: "",
    icon: null,
  },
];
