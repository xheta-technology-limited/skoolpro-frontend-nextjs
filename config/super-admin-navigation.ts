import {
  Home,
  UserEdit,
  MoneyChange,
  Book,
  Book1,
  Building,
  Hospital,
  Bookmark,
  Car,
  Buildings,
  DirectNotification,
  Setting2,
  type Icon,
  LogoutCurve,
} from "iconsax-reactjs";

export type DashboardNavigationItem = {
  label: string;
  href: string;
  icon: Icon | null;
  children?: DashboardNavigationItem[];
  keywords?: string[];
};

export const dashboardNavigation: DashboardNavigationItem[] = [
  {
    label: "Dashboard",
    href: "/super-admin/dashboard",
    icon: Home,
  },
  {
    label: "User management",
    href: "/super-admin/user-management",
    icon: UserEdit,
  },
  {
    label: "Fee management",
    href: "/dashboard/fees",
    icon: MoneyChange,
  },
  {
    label: "Curriculum management",
    href: "/dashboard/curriculum",
    icon: Book,
  },
  {
    label: "Exam management",
    href: "/dashboard/exams",
    icon: Book1,
  },
  {
    label: "Hostel management",
    href: "/dashboard/hostel",
    icon: Building,
  },
  {
    label: "Health management",
    href: "/dashboard/health",
    icon: Hospital,
  },
  {
    label: "Library management",
    href: "/dashboard/library",
    icon: Bookmark,
  },
  {
    label: "Transport management",
    href: "/dashboard/transport",
    icon: Car,
  },
  {
    label: "School Onboarding",
    href: "/super-admin/school-onboarding",
    icon: Buildings,
  },
  {
    label: "Notification management",
    href: "/dashboard/notifications",
    icon: DirectNotification,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Setting2,
  },
  {
    label: "Logout",
    href: "",
    icon: LogoutCurve,
  },
];
