"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowDown2 } from "iconsax-reactjs";

import Header from "../_components/header";
import Pagination from "@/components/common/pagination/pagination";
import StudentRow, { type Student } from "./_components/StudentRow";
import AdmitStudentModal from "./_components/AdmitStudentModal";
import { useUserStore } from "@/features/school-profile/school-profile.store";
import { useGetStudents } from "@/features/user-management/student-management/api/get-students";
import type { StudentRecord } from "@/features/user-management/student-management/types/student-types";
import { useProgressRouter } from "@/features/page-loader";
import SearchInput from "@/components/ui/form/input/search-input";
import { titleCase } from "@/lib/helpers/string-to-title-case";

const TABLE_COLUMNS = [
  "Name",
  "Email address",
  "Class",
  "Admission",
  "Guardian",
  "Admission no.",
  "Status",
];

// 7 columns, kept as one constant so the header row and data rows can
// never drift out of alignment with each other.
const GRID_TEMPLATE = "grid-cols-[1.5fr_1.5fr_.7fr_.8fr_1fr_1fr_.7fr]";

const PAGE_SIZE = 10;

function toStudentRowData(record: StudentRecord): Student {
  return {
    id: record.id,
    name: record.full_name,
    email: record.personal_email ?? "",
    className: "—",
    admissionStatus: titleCase(record.admission_status),
    guardian: "—",
    admissionNumber: record.admission_number,
    status: record.student_status,
  };
}

export default function StudentManagement() {
  const router = useProgressRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdmitStudentOpen, setIsAdmitStudentOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const schoolId = useUserStore((state) => state.data?.id) ?? "";

  const { data, isPending, isError, refetch } = useGetStudents({
    search: searchTerm || undefined,
  });

  const allStudents = useMemo(
    () => (data ?? []).map(toStudentRowData),
    [data]
  );

  const totalItems = allStudents.length;

  const students = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return allStudents.slice(start, start + PAGE_SIZE);
  }, [allStudents, currentPage]);

  const exportStudent = () => alert("export clicked");
  const addStudent = () => setIsAdmitStudentOpen(true);
  const importStudent = () => alert("import clicked");

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setCurrentPage(1);
  }

  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, totalItems);

  return (
    <>
      <Header
        role="student"
        onExportClick={exportStudent}
        onAddClick={addStudent}
        onImportClick={importStudent}
      />

      <AdmitStudentModal
        open={isAdmitStudentOpen}
        onOpenChange={setIsAdmitStudentOpen}
        schoolId={schoolId}
      />

      <div className="flex w-full flex-col gap-1">
        {/* Header: title, class filter, search, table columns */}
        <section className="w-full rounded-t-2xl border border-primary-100 bg-[#FFFFFF] px-4 pt-4 sm:px-5 lg:px-6">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-[16px] font-medium leading-6 text-neutrals-900">
              Student Management
            </h1>

            <button
              type="button"
              className="flex shrink-0 items-center gap-1 rounded-full border border-primary-100 px-3 py-1.5 text-[12px] text-neutrals-700"
            >
              All Classes
              <ArrowDown2 size={12} variant="Linear" color="currentColor" />
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <SearchInput
              placeholder="Search name, email..."
              className="flex-1"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />

            <span className="shrink-0 text-[12px] text-neutrals-700 sm:whitespace-nowrap">
              Showing {rangeStart} – {rangeEnd} of {totalItems}
            </span>
          </div>

          <div className="mt-5 w-full overflow-x-auto">
            <div
              className={`grid ${GRID_TEMPLATE} min-w-190 items-center pb-3 text-[12px] font-semibold text-neutrals-700`}
            >
              {TABLE_COLUMNS.map((column) => (
                <span key={column}>{column}</span>
              ))}
            </div>
          </div>
        </section>

        {isPending ? (
          <section className="flex min-h-105 w-full items-center justify-center bg-[#FFFFFF] sm:min-h-131.25">
            <span className="text-[13px] text-neutrals-500">Loading students…</span>
          </section>
        ) : isError ? (
          <section className="flex min-h-105 w-full flex-col items-center justify-center gap-4 bg-[#FFFFFF] sm:min-h-131.25">
            <span className="text-[13px] text-neutrals-500">
              Unable to load students.
            </span>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-full bg-primary px-6 py-2 text-[13px] text-white"
            >
              Retry
            </button>
          </section>
        ) : students.length === 0 ? (
          /* Empty state */
          <section className="flex min-h-105 w-full flex-col items-center justify-center bg-[#FFFFFF] px-4 py-10 sm:min-h-131.25">
            <Image
              src="/norecord.png"
              alt="No records here yet — add students and they'll show up here"
              width={372}
              height={300}
              className="h-auto w-full max-w-93"
            />
          </section>
        ) : (
          /* Rows */
          <section className="w-full overflow-x-auto bg-[#FFFFFF]">
            <div className="min-w-190">
              {students.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  gridTemplate={GRID_TEMPLATE}
                  onClick={() =>
                    router.push(
                      `/super-admin/user-management/student-management/${student.id}/general`
                    )
                  }
                />
              ))}
            </div>
          </section>
        )}

        {/* Pagination */}
        <div className="w-full overflow-x-auto rounded-b-2xl bg-[#FFFFFF]">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
}