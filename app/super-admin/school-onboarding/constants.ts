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
    pageUrl: "",
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
    pageUrl: "",
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
