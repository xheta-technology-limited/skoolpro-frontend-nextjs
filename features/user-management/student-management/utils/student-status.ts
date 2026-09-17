// Single source of truth for turning a raw `student_status` API value
// into a StatusBadge variant + display label. Shared by StudentRow
// (list view) and the student Status page, so the color/label logic
// for a given status never has to be duplicated or kept in sync by
// hand across the two.
export type StudentStatusVariant = "green" | "orange" | "red";

export const STUDENT_STATUS_VARIANT: Record<string, StudentStatusVariant> = {
  active: "green",
  graduated: "green",
  alumni: "green",
  suspended: "orange",
  inactive: "orange",
  transferred: "orange",
  withdrawn: "red",
  expelled: "red",
  deceased: "red",
};

export function getStudentStatusVariant(status: string): StudentStatusVariant {
  return STUDENT_STATUS_VARIANT[status.toLowerCase()] ?? "green";
}

export function formatStudentStatus(status: string): string {
  return status
    .split(/[_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}