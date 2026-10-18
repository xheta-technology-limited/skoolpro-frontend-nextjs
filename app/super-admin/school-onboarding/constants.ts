export interface Group {
  label: string;
  pageUrl: string;
}

export const PAGES: Group[] = [
  {
    label: "School Record",
    pageUrl: "/super-admin/school-onboarding/school-record",
  },
  {
    label: "Academic Year",
    pageUrl: "/super-admin/school-onboarding/academic-year",
  },
  {
    label: "Grading System",
    pageUrl: "/super-admin/school-onboarding/grading",
  },
  {
    label: "Promotion",
    pageUrl: "/super-admin/school-onboarding/promotion",
  },
  {
    label: "Timetable",
    pageUrl: "/super-admin/school-onboarding/timetable",
  },
  {
    label: "Attendance",
    pageUrl: "/super-admin/school-onboarding/attendance",
  },
  {
    label: "Subscription",
    pageUrl: "/super-admin/school-onboarding/subscriptions",
  },
  {
    label: "Comment Bank",
    pageUrl: "",
  },
];
