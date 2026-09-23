import Image from "next/image";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";

import { Button } from "@/components/ui/custom-button";
import { DatePicker, Input, Select } from "@/components/ui/form";
import { GENDER_SELECT_OPTIONS } from "@/config/constants";
import { setFormErrors } from "@/lib/helpers";
import {
  editStudentSchema,
  type EditStudentFormData,
} from "@/features/user-management/student-management/schemas/edit-student-schema";
import { useUpdateStudent } from "@/features/user-management/student-management/api/update-student";
import type { StudentDetail } from "@/features/user-management/student-management/types/student-detail-types";
import CountrySelectField from "@/app/onboarding/_components/fields/CountrySelectField";
import { ADMISSION_TYPE_OPTIONS } from "@/app/super-admin/user-management/student-management/schema/student-management";
interface Props {
  onCancel: () => void;
  onSaved: () => void;
  student: StudentDetail;
}

const toDefaults = (student: StudentDetail): EditStudentFormData => ({
  first_name: student.first_name ?? "",
  middle_name: student.middle_name ?? "",
  last_name: student.last_name ?? "",
  date_of_birth: student.date_of_birth ?? "",
  gender: student.gender ?? "",
  place_of_birth: student.place_of_birth ?? "",
  nationality: student.nationality ?? "",
  country_of_birth: student.country_of_birth ?? "",
  first_language: student.first_language ?? "",
  other_languages: student.other_languages ?? "",
  religion: student.religion ?? "",
  ethnicity: student.ethnicity ?? "",
  personal_email: student.personal_email ?? "",
  personal_phone: student.personal_phone ?? "",
  home_address: student.home_address ?? "",
  mailing_address: student.mailing_address ?? "",
  current_residential_address: student.current_residential_address ?? "",
  admission_date: student.admission_date ?? "",
  admission_type: student.admission_type ?? "",
  previous_school: student.previous_school ?? "",
  reason_for_leaving_previous_school:
    student.reason_for_leaving_previous_school ?? "",
  entrance_exam_result: student.entrance_exam_result ?? "",
  interview_result: student.interview_result ?? "",
});

export default function EditMode({ onCancel, onSaved, student }: Props) {
  const methods = useForm<EditStudentFormData>({
    defaultValues: toDefaults(student),
    resolver: zodResolver(editStudentSchema),
  });

  const { mutate, isPending } = useUpdateStudent();

  const onSubmit = (data: EditStudentFormData) => {
    mutate(
      { studentId: student.id, payload: data },
      {
        onSuccess: () => {
          toast.success("Student updated successfully");
          onSaved();
        },
        onError: (res) => {
          if (res?.errors) {
            setFormErrors(methods.setError, res.errors);
          } else if (!(res instanceof ApiError)) {
            toast.error(res?.message || "Failed to update student.");
          }
        },
      }
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        id="edit-student-form"
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center justify-between">
          <span className="font-poppins uppercase text-base font-normal leading-[120%] tracking-normal text-neutrals-700">
            Student
          </span>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              form="edit-student-form"
              loading={isPending}
            >
              Save
            </Button>
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

          <div className="flex-1 rounded-ml bg-white p-2 grid grid-cols-2 content-start gap-4">
            <Input name="first_name" label="Enter first name" />
            <Input name="middle_name" label="Enter middle name" />
            <Input name="last_name" label="Enter last name" />
            <Input name="place_of_birth" label="Enter place of birth" />
            <Select
              name="gender"
              label="Select sex"
              options={GENDER_SELECT_OPTIONS}
            />
            <DatePicker
              name="date_of_birth"
              label="Enter date of birth"
            />
            <Input name="nationality" label="Enter nationality" />
            <CountrySelectField name="country_of_birth" placeholder="Enter country of birth" />
          </div>
        </div>

        <div className="rounded-ml bg-white p-2 grid grid-cols-2 content-start gap-4">
          <Input name="first_language" label="Enter first language" />
          <Input name="other_languages" label="Enter other language" />
          <Input name="religion" label="Select religion" />
          <Input name="ethnicity" label="Select ethnicity" />
        </div>

        <div className="rounded-ml bg-white p-2 grid grid-cols-2 content-start gap-4">
          <Input
            name="admission_number_display"
            label="Admission no."
            disabled
            defaultValue={student.admission_number}
          />
          <Input
            name="student_id_number_display"
            label="Student ID"
            disabled
            defaultValue={student.student_id_number ?? "Nil"}
          />
          <Input
            name="previous_admission_number_display"
            label="Previous admission no."
            disabled
            defaultValue={student.previous_admission_number ?? "Nil"}
          />
        </div>

        <div className="rounded-ml bg-white p-2 grid grid-cols-2 content-start gap-4">
          <Input name="home_address" label="Enter home address" />
          <Input name="mailing_address" label="Enter mailing address" />
          <Input
            name="current_residential_address"
            label="Enter current residential address"
          />
          <Input name="personal_email" label="Enter email address" />
          <Input name="personal_phone" label="Enter phone number" />
        </div>

        <div className="rounded-ml bg-white p-2 grid grid-cols-2 content-start gap-4">
          <Input
            name="admission_date"
            label="Enter admission date"
            type="date"
          />
          <Select
            name="admission_type"
            label="Select admission type"
            options={ADMISSION_TYPE_OPTIONS}
          />
          <Input name="previous_school" label="Enter previous school" />
          <Input
            name="reason_for_leaving_previous_school"
            label="Enter reason for leaving previous school"
          />
          <Input
            name="entrance_exam_result"
            label="Enter entrance exam result"
          />
          <Input name="interview_result" label="Enter interview result" />
        </div>
      </form>
    </FormProvider>
  );
}