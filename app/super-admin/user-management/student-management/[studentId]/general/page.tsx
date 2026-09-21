"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { ArrowDown2, LockCircle } from "iconsax-reactjs";
import { useState } from "react";

import { Button } from "@/components/ui/custom-button";
import DetailCard from "@/components/common/detail-card/DetailCard";
import RecordTableSection, {
  type RecordTableRow,
} from "@/components/common/record-table-section/RecordTableSection";
import { useGetStudent } from "@/features/user-management/student-management/api/get-student";
import { useGetEnrolments } from "@/features/user-management/student-management/api/get-enrolment";
import { useGetClassSections } from "@/features/user-management/student-management/api/get-class-sections";
import { titleCase } from "@/lib/helpers/string-to-title-case";
import type { StudentGuardian } from "@/features/user-management/student-management/types/student-detail-types";

function getGuardianResponsibility(guardian: StudentGuardian): string {
  const { link } = guardian;
  if (link.authorised_to_collect) return "Authorized to collect";
  if (link.is_financially_responsible) return "Financial";
  if (link.can_make_decisions) return "Decision making";
  if (link.receives_academic_reports) return "Academic reports";
  if (link.receives_medical_info) return "Medical info";
  return "—";
}

export default function StudentGeneralPage() {
  const params = useParams<{ studentId: string }>();
  const studentId = params.studentId;

  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState<Record<string, string>>(
    {}
  );

  const { data: student, isPending, isError } = useGetStudent(studentId);

  const { data: enrolments } = useGetEnrolments({
    student_id: studentId,
  });

  const { data: classSections } = useGetClassSections();

  if (isPending) {
    return (
      <div className="flex min-h-60 w-full items-center justify-center">
        <span className="text-[13px] text-neutrals-500">
          Loading student…
        </span>
      </div>
    );
  }

  if (isError || !student) {
    return (
      <div className="flex min-h-60 w-full items-center justify-center">
        <span className="text-[13px] text-neutrals-500">
          Unable to load this student.
        </span>
      </div>
    );
  }

  function noop() {}

  const currentEnrolment =
    enrolments?.find((enrolment) => enrolment.status === "active") ??
    enrolments?.[0];

  const currentClass =
    classSections?.find(
      (section) => section.id === currentEnrolment?.class_section_id
    )?.code ?? "Nil";

  function getFieldValue(label: string, defaultValue: string) {
    return editedFields[label] ?? defaultValue;
  }

  function handleFieldChange(label: string, value: string) {
    setEditedFields((previous) => ({
      ...previous,
      [label]: value,
    }));
  }

  function handleEdit() {
    setEditedFields({});
    setIsEditing(true);
  }

  function handleCancel() {
    setEditedFields({});
    setIsEditing(false);
  }

  function handleSave() {
    // TODO: Connect this to the student update API.
    setIsEditing(false);
  }

  const personalFields = [
    {
      label: "First name",
      value: getFieldValue("First name", student.first_name),
    },
    {
      label: "Middle name",
      value: getFieldValue("Middle name", student.middle_name ?? "Nil"),
    },
    {
      label: "Last name",
      value: getFieldValue("Last name", student.last_name),
    },
    {
      label: "Place of birth",
      value: getFieldValue("Place of birth", student.place_of_birth ?? "Nil"),
    },
    {
      label: "Sex",
      value: getFieldValue(
        "Sex",
        student.gender ? titleCase(student.gender) : "Nil"
      ),
    },
    {
      label: "D.O.B",
      value: getFieldValue("D.O.B", student.date_of_birth ?? "Nil"),
    },
    {
      label: "Nationality",
      value: getFieldValue("Nationality", student.nationality ?? "Nil"),
    },
    {
      label: "Country of birth",
      value: getFieldValue(
        "Country of birth",
        student.country_of_birth ?? "Nil"
      ),
    },
  ];

  const languageFields = [
    {
      label: "First language",
      value: getFieldValue(
        "First language",
        student.first_language ?? "Nil"
      ),
    },
    {
      label: "Other language",
      value: getFieldValue(
        "Other language",
        student.other_languages ?? "Nil"
      ),
    },
    {
      label: "Religion",
      value: getFieldValue("Religion", student.religion ?? "Nil"),
    },
    {
      label: "Ethnicity",
      value: getFieldValue("Ethnicity", student.ethnicity ?? "Nil"),
    },
  ];

  const identificationFields = [
    {
      label: "Admission no.",
      value: getFieldValue("Admission no.", student.admission_number),
    },
    {
      label: "Student ID",
      value: getFieldValue(
        "Student ID",
        student.student_id_number ?? "Nil"
      ),
    },
    {
      label: "Previous admission no.",
      value: getFieldValue(
        "Previous admission no.",
        student.previous_admission_number ?? "Nil"
      ),
    },
  ];

  const contactFields = [
    {
      label: "Home address",
      value: getFieldValue("Home address", student.home_address ?? "Nil"),
    },
    {
      label: "Email address",
      value: getFieldValue(
        "Email address",
        student.personal_email ?? "Nil"
      ),
    },
    {
      label: "Phone number",
      value: getFieldValue(
        "Phone number",
        student.personal_phone ?? "Nil"
      ),
    },
  ];

  const academicFields = [
    {
      label: "Class enrolled",
      value: currentClass,
    },
    {
      label: "Admission date",
      value: getFieldValue("Admission date", student.admission_date),
    },
    {
      label: "Admission type",
      value: getFieldValue(
        "Admission type",
        student.admission_type
          ? titleCase(student.admission_type)
          : "Nil"
      ),
    },
    {
      label: "Previous school attended",
      value: getFieldValue(
        "Previous school attended",
        student.previous_school ?? "Nil"
      ),
    },
    {
      label: "Entrance exam result",
      value: getFieldValue(
        "Entrance exam result",
        student.entrance_exam_result ?? "Nil"
      ),
    },
    {
      label: "Interview result",
      value: getFieldValue(
        "Interview result",
        student.interview_result ?? "Nil"
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className="font-poppins uppercase text-base font-normal leading-[120%] tracking-normal text-neutrals-700">
          Student
        </span>

        <div className="flex items-center gap-3">
          {/* MOCK: no current-class field exists on the API yet. */}
          {/* <button
            type="button"
            className="flex items-center gap-1 rounded-full border border-primary-100 px-3 py-1.5 text-[12px] text-neutrals-700"
          >
            JS 1
            <ArrowDown2 size={12} variant="Linear" color="currentColor" />
          </button> */}

          {!isEditing ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleEdit}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={handleSave}
              >
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative aspect-square w-full max-w-71 shrink-0 overflow-hidden rounded-[32px] border-4 border-primary bg-[#D9D9D9] sm:w-71">
          {student.photo_path ? (
            <Image
              src={student.photo_path}
              alt={student.full_name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[13px] text-neutrals-500">
              No photo
            </div>
          )}
        </div>

        <div className="flex-1">
          <DetailCard
            fields={personalFields}
            editable={isEditing}
            onFieldChange={handleFieldChange}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        {/* MOCK: Class Attendance Points has no backing field. */}
        <div className="flex w-full flex-1 flex-col gap-2 rounded-2xl border border-primary-100 bg-[#FFFFFF] p-4 min-h-23 lg:h-23">
          <span className="font-poppins text-base font-semibold leading-[120%] tracking-normal text-neutrals-700">
            Class Attendance Point
          </span>
          <div className="flex items-center gap-3">
            <div className="h-6 flex-1 overflow-hidden rounded-tl-[2px] rounded-tr-[32px] rounded-br-[32px] rounded-bl-[2px] bg-primary-bg lg:h-8.25">
              <div className="h-full w-[38.27%] rounded-tl-[2px] rounded-tr-[32px] rounded-br-[32px] rounded-bl-[2px] bg-(--Primary-Primary800,#0100AB)" />
            </div>
            <span className="flex items-center gap-1">
              <span className="font-poppins text-lg font-semibold leading-[120%] tracking-normal text-neutrals-900 lg:text-2xl">
                2,450
              </span>
              <span className="text-lg lg:text-2xl">🔥</span>
            </span>
          </div>
        </div>

        {/* MOCK: Certificates has no backing field. */}
        <div className="flex w-full flex-1 flex-col gap-2 rounded-2xl border border-primary-100 bg-[#FFFFFF] p-4 min-h-23 lg:h-23">
          <span className="font-poppins text-base font-semibold leading-[120%] tracking-normal text-neutrals-700">
            Certificates
          </span>
          <div className="flex w-full items-center justify-between">
            <Image
              src="/starbadge.png"
              alt="Certificate badge"
              width={36}
              height={36}
            />
            {Array.from({ length: 5 }, (_, index) => (
              <LockCircle
                key={index}
                size={36}
                variant="Bulk"
                color="var(--Primary-Primary1000, #01004D)"
              />
            ))}
          </div>
        </div>
      </div>

      <DetailCard
        fields={languageFields}
        editable={isEditing}
        onFieldChange={handleFieldChange}
      />

      <DetailCard
        title="Identification"
        fields={identificationFields}
        editable={isEditing}
        onFieldChange={handleFieldChange}
      />

      <DetailCard
        title="Contact Details"
        fields={contactFields}
        editable={isEditing}
        onFieldChange={handleFieldChange}
      />

      <DetailCard
        title="Academic Details"
        fields={academicFields}
        editable={isEditing}
        onFieldChange={handleFieldChange}
      />

      <RecordTableSection
        title="Guardians"
        columns={[
          { key: "name", label: "Name" },
          { key: "relationship", label: "Relationship" },
          { key: "status", label: "Status" },
          { key: "responsibilities", label: "Responsibilities" },
        ]}
        rows={student.guardians.map(
          (guardian): RecordTableRow => ({
            id: guardian.id,
            cells: {
              name: guardian.full_name,
              relationship: titleCase(guardian.link.relationship),
              status: guardian.link.is_primary_contact
                ? "Primary"
                : "Secondary",
              responsibilities: getGuardianResponsibility(guardian),
            },
          })
        )}
        onAdd={noop}
        onEditRow={noop}
        onDeleteRow={noop}
        addLabel="Link a guardian"
        requireAtLeastOne={false}
        emptyLabel="No guardians linked yet."
      />

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button variant="secondary" size="lg" className="flex-1">
          Suspend user
        </Button>
        <Button size="lg" className="flex-1">
          Disable user account
        </Button>
      </div>

      <button
        type="button"
        className="mx-auto text-[13px] font-medium text-error"
      >
        Delete user account
      </button>
    </div>
  );
}
