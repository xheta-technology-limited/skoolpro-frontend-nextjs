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
  UserOctagon,
  Document,
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
    children: [
      {
        label: "Staff Management",
        href: "/super-admin/user-management/staff-management",
        icon: UserOctagon,
      },
    ],
  },
  {
    label: "Students",
    href: "/super-admin/user-management/student-management/?origin=dashboard",
    icon: UserOctagon,
  },
  {
    label: "Fee management",
    href: "/dashboard/fees",
    icon: MoneyChange,
  },
  {
    label: "Structure & Curriculum",
    href: "/super-admin/structure-and-curriculum/structure",
    icon: Book1,
    children: [
      {
        label: "Classes structure",
        href: "/super-admin/structure-and-curriculum/structure?tab=classes",
        icon: null,
      },
      {
        label: "Add class",
        href: "/super-admin/structure-and-curriculum/structure?tab=classes&add-class=true",
        icon: null,
      },
      {
        label: "Add subject",
        href: "/super-admin/structure-and-curriculum/curriculum?tab=subjects&add-subject=true",
        icon: null,
      },
      {
        label: "Class subjects",
        href: "/super-admin/structure-and-curriculum/curriculum?tab=class-subjects",
        icon: null,
      },
      {
        label: "All subjects",
        href: "/super-admin/structure-and-curriculum/curriculum?tab=subjects",
        icon: null,
      },
    ],
  },
  {
    label: "Exam management",
    href: "/dashboard/exams",
    icon: Book,
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
    children: [
      {
        label: "School Record",
        href: "/super-admin/school-onboarding/school-record",
        icon: null,
      },
      {
        label: "Academic Year",
        href: "/super-admin/school-onboarding/academic-year",
        icon: null,
      },
      {
        label: "Promotion",
        href: "/super-admin/school-onboarding/promotion",
        icon: null,
      },
      {
        label: "Subscriptions",
        href: "/super-admin/school-onboarding/subscriptions",
        icon: null,
      },
      {
        label: "Grading System",
        href: "/super-admin/school-onboarding/grading",
        icon: null,
        children: [
          {
            label: "Add grade scale",
            href: "/super-admin/school-onboarding/grading?add-grade-scale=true",
            icon: null,
          },
          {
            label: "Add grade scheme",
            href: "/super-admin/school-onboarding/grading?add-grade-scheme=true",
            icon: null,
          },
        ],
      },
      {
        label: "Comment bank",
        href: "/super-admin/school-onboarding/comment-bank",
        icon: null,
        children: [
          {
            label: "Add comment",
            href: "/super-admin/school-onboarding/comment-bank?add-comment=true",
            icon: null,
          },
          {
            label: "Seed grade scale",
            href: "/super-admin/school-onboarding/comment-bank?seed-scale=true",
            icon: null,
          },
        ],
      },
    ],
  },
  {
    label: "Document management",
    href: "/super-admin/document-management/owner-document",
    icon: Document,
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
