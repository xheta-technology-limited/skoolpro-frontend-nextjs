import Image from "next/image";
import { LockCircle } from "iconsax-reactjs";

import DetailCard from "@/components/common/detail-card/DetailCard";
import { Button } from "@/components/ui/custom-button";
import { titleCase } from "@/lib/helpers/string-to-title-case";
import type { StudentDetail } from "@/features/user-management/student-management/types/student-detail-types";

interface Props {
  onEdit: () => void;
  student: StudentDetail;
}

const fallback = (value?: string | null) =>
  value && value.trim() !== "" ? value : "Nil";

export default function ViewMode({ onEdit, student }: Props) {
  const currentClass = student.current_enrolment?.class_section.code ?? "Nil";

  const personalFields = [
    { label: "First name", value: fallback(student.first_name) },
    { label: "Middle name", value: fallback(student.middle_name) },
    { label: "Last name", value: fallback(student.last_name) },
    { label: "Place of birth", value: fallback(student.place_of_birth) },
    {
      label: "Sex",
      value: student.gender ? titleCase(student.gender) : "Nil",
    },
    { label: "D.O.B", value: fallback(student.date_of_birth) },
    { label: "Nationality", value: fallback(student.nationality) },
    { label: "Country of birth", value: fallback(student.country_of_birth) },
  ];

  const languageFields = [
    { label: "First language", value: fallback(student.first_language) },
    { label: "Other language", value: fallback(student.other_languages) },
    { label: "Religion", value: fallback(student.religion) },
    { label: "Ethnicity", value: fallback(student.ethnicity) },
  ];

  const identificationFields = [
    { label: "Admission no.", value: fallback(student.admission_number) },
    { label: "Student ID", value: fallback(student.student_id_number) },
    {
      label: "Previous admission no.",
      value: fallback(student.previous_admission_number),
    },
  ];

  const contactFields = [
    { label: "Home address", value: fallback(student.home_address) },
    { label: "Email address", value: fallback(student.personal_email) },
    { label: "Phone number", value: fallback(student.personal_phone) },
  ];

  const academicFields = [
    { label: "Class enrolled", value: currentClass },
    { label: "Admission date", value: fallback(student.admission_date) },
    {
      label: "Admission type",
      value: student.admission_type
        ? titleCase(student.admission_type)
        : "Nil",
    },
    {
      label: "Previous school attended",
      value: fallback(student.previous_school),
    },
    {
      label: "Entrance exam result",
      value: fallback(student.entrance_exam_result),
    },
    { label: "Interview result", value: fallback(student.interview_result) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className="font-poppins uppercase text-base font-normal leading-[120%] tracking-normal text-neutrals-700">
          Student
        </span>

        <Button size="sm" variant="secondary" onClick={onEdit}>
          Edit
        </Button>
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
          <DetailCard fields={personalFields} />
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

      <DetailCard fields={languageFields} />

      <DetailCard title="Identification" fields={identificationFields} />

      <DetailCard title="Contact Details" fields={contactFields} />

      <DetailCard title="Academic Details" fields={academicFields} />
    </div>
  );
}