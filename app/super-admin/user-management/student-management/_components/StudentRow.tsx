import { StatusBadge } from "@/components/common";
import {
  formatStudentStatus,
  getStudentStatusVariant,
} from "@/features/user-management/student-management/utils/student-status";


interface Student {
  id: string;
  name: string;
  email: string;
  className: string;
  admissionStatus: string;
  guardian: string;
  admissionNumber: string;
  // Raw student_status from the API (active/suspended/graduated/
  // withdrawn/etc — see the transition endpoint's status table).
  // Not narrowed to a union here since the full set of values is
  // open-ended; formatStudentStatus/getStudentStatusVariant handle
  // display + coloring for whatever comes back.
  status: string;
}

interface StudentRowProps {
  student: Student;
  gridTemplate: string;
  onClick?: (student: Student) => void;
}

export default function StudentRow({
  student,
  gridTemplate,
  onClick,
}: StudentRowProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(student)}
      className={`group grid ${gridTemplate} min-h-12.25 w-full items-center border-b border-primary-100 px-4 py-3 text-left last:border-b-0 hover:bg-primary-bg sm:px-5 lg:px-6`}
    >
      <span className="truncate text-[13px] text-neutrals-900">
        {student.name}
      </span>
      <span className="truncate text-[13px] text-neutrals-700">
        {student.email}
      </span>
      <span className="truncate text-[13px] text-neutrals-700">
        {student.className}
      </span>
      <span className="truncate text-[13px] text-neutrals-700">
        {student.admissionStatus}
      </span>
      <span className="truncate text-[13px] text-neutrals-700">
        {student.guardian}
      </span>
      <span className="truncate text-[13px] text-neutrals-700">
        {student.admissionNumber}
      </span>
      <div className="justify-self-start">
        <StatusBadge
          data={formatStudentStatus(student.status)}
          variant={getStudentStatusVariant(student.status)}
        />
      </div>
    </button>
  );
}

export type { Student };