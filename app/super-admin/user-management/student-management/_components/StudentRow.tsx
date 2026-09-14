import { StatusBadge } from "@/components/common";

interface Student {
  id: string;
  name: string;
  email: string;
  className: string;
  admissionStatus: string;
  guardian: string;
  admissionNumber: string;
  status: "Active" | "Withdrawn";
}

const STATUS_VARIANTS: Record<Student["status"], "green" | "orange"> = {
  Active: "green",
  Withdrawn: "orange",
};

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
      className={`group grid ${gridTemplate} min-h-[49px] w-full items-center border-b border-primary-100 px-4 py-3 text-left last:border-b-0 hover:bg-primary-bg sm:px-5 lg:px-6`}
    >
      <span className="truncate text-[13px] text-neutrals-900 group-hover:text-primary">
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
        <StatusBadge data={student.status} variant={STATUS_VARIANTS[student.status]} />
      </div>
    </button>
  );
}

export type { Student };