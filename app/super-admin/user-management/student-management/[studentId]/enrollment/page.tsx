"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/custom-button";
import DetailCard from "@/components/common/detail-card/DetailCard";
import RecordTableSection, {
  type RecordTableRow,
} from "@/components/common/record-table-section/RecordTableSection";
import AddOptionalSubjectsModal from "../../_components/AddOptionalSubjectModal";
import { useGetEnrolments } from "@/features/user-management/student-management/api/get-enrolment";
import { useGetEffectiveSubjects } from "@/features/user-management/student-management/api/get-effective-subjects";
import { useGetClassSections } from "@/features/user-management/student-management/api/get-class-sections";
import { useGetAcademicYears } from "@/features/academic-year/api/list-academic-years";
import { formatStudentStatus } from "@/features/user-management/student-management/utils/student-status";

function noop() {}

export default function StudentEnrollmentPage() {
  const params = useParams<{ studentId: string }>();
  const studentId = params.studentId;

  const [isAddOptionalSubjectsOpen, setIsAddOptionalSubjectsOpen] =
    useState(false);

  const { data: enrolments, isPending: isEnrolmentsPending } =
    useGetEnrolments({ student_id: studentId });
  const { data: classSections } = useGetClassSections();
  const { data: academicYears } = useGetAcademicYears();

  const sortedEnrolments = [...(enrolments ?? [])].sort(
    (a, b) =>
  const currentEnrolment = sortedEnrolments.find(
    (enrolment) => enrolment.status === "active"
  );
      classSections?.find((section) => section.id === sectionId)?.name ??
      sectionId
    );
  }

  function academicYearName(yearId: string) {
    return academicYears?.find((year) => year.id === yearId)?.name ?? yearId;
  }

  const placementFields = [
    {
      label: "Class/Section",
      value: currentEnrolment
        ? sectionName(currentEnrolment.class_section_id)
        : "",
    },
    {
      label: "Roll number",
      value: currentEnrolment?.roll_number ?? "",
    },
    {
      label: "Enrollment status",
      value: currentEnrolment
        ? formatStudentStatus(currentEnrolment.status)
        : "",
    },
    {
      label: "Enrolled on",
      value: currentEnrolment?.enrolled_on ?? "",
    },
  ];

  const { data: effectiveSubjects, isPending: isSubjectsPending } =
    useGetEffectiveSubjects(currentEnrolment?.id);

  const subjectRows: RecordTableRow[] = (effectiveSubjects ?? []).map(
    (subject) => ({
      id: subject.assignment_id,
      cells: {
        subject: subject.subject_name,
        source: subject.source === "compulsory" ? "Compulsory" : "Optional",
        passmark: String(subject.pass_mark),
      },
    })
  );

  const historyRows: RecordTableRow[] = sortedEnrolments.map((enrolment) => ({
    id: enrolment.id,
    cells: {
      academicYear: academicYearName(enrolment.academic_year_id),
      classSection: sectionName(enrolment.class_section_id),
      status: formatStudentStatus(enrolment.status),
    },
  }));

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium uppercase tracking-wide text-neutrals-500">
            Current placement
          </span>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={noop}
            >
              Transfer
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={noop}
              className="border-error-200! text-error-200! hover:bg-error-200/5"
            >
              Withdraw
            </Button>
          </div>
        </div>

        <DetailCard fields={placementFields} />

        <RecordTableSection
          title="Subjects offered"
          columns={[
            { key: "subject", label: "Subject" },
            { key: "source", label: "Source" },
            { key: "passmark", label: "Passmark" },
          ]}
          rows={subjectRows}
          onAdd={() => setIsAddOptionalSubjectsOpen(true)}
          addLabel="Add optional subject"
          onDeleteRow={noop}
          requireAtLeastOne={false}
          emptyLabel={
            !currentEnrolment
              ? isEnrolmentsPending
                ? "Loading…"
                : "No current enrolment on record."
              : isSubjectsPending
                ? "Loading subjects…"
                : "No subjects added yet."
          }
        />

        <RecordTableSection
          title="Enrollment history"
          columns={[
            { key: "academicYear", label: "Academic year" },
            { key: "classSection", label: "Class/Section" },
            { key: "status", label: "Status" },
          ]}
          rows={historyRows}
          emptyLabel={
            isEnrolmentsPending ? "Loading…" : "No enrollment history yet."
          }
        />
      </div>

      <AddOptionalSubjectsModal
        open={isAddOptionalSubjectsOpen}
        onOpenChange={setIsAddOptionalSubjectsOpen}
      />
    </>
  );
}