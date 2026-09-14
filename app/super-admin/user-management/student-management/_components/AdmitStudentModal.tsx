"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DocumentUpload } from "iconsax-reactjs";

import { toast } from "sonner";
import FormModal from "@/components/ui/form-modal";
import { Input, Select, DatePicker } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { SuccessModal } from "@/components/common";

import { useCreateStudent } from "@/features/user-management/student-management/api/create-student";
import type { CreateStudentPayload } from "@/features/user-management/student-management/types/create-student-types";

import {
  admitStudentSchema,
  generateAdmissionNumber,
  DEFAULT_ADMIT_STUDENT_VALUES,
  GENDER_OPTIONS,
  ADMISSION_TYPE_OPTIONS,
  CLASS_OPTIONS,
  ACADEMIC_YEAR_OPTIONS,
  STEP_ONE_FIELDS,
  type AdmitStudentValues,
} from "../schema/student-management";
const TOTAL_STEPS = 2;

interface AdmitStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
}

/**
 * NOTE: POST /students has no schoolId in the URL per the confirmed
 * API spec (unlike school-record's schools/{school}/... endpoints) —
 * the school is presumably inferred from the authenticated session.
 * schoolId is kept as a prop for now since the caller still passes it
 * and other admin actions on this page may need it, but it's no
 * longer used in this mutation's URL.
 *
 * NOTE: photo upload (photoId) is a confirmed dud — there's no photo
 * field on the create-student endpoint. The upload control stays in
 * the UI but its value is never sent. Ask the dev about a separate
 * photo-upload endpoint.
 *
 * NOTE: on failure there's no confirmed "Unsuccessful" result modal
 * component yet (only SuccessModal exists) — per instruction, a toast
 * with the real server error message is shown instead, and the form
 * modal simply stays open on step 2 so the person can retry.
 */
export default function AdmitStudentModal({
  open,
  onOpenChange,
  schoolId,
}: AdmitStudentModalProps) {
  const [step, setStep] = useState(1);
  const [admissionMode, setAdmissionMode] = useState<"auto" | "manual">(
    "auto"
  );
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const queryClient = useQueryClient();

  const methods = useForm<AdmitStudentValues>({
    resolver: zodResolver(admitStudentSchema),
    defaultValues: DEFAULT_ADMIT_STUDENT_VALUES,
  });

  const { handleSubmit, reset, control, trigger, setValue, watch, formState } =
    methods;

  const enrollmentMode = watch("enrollmentMode");
  const isAdmitOnly = enrollmentMode === "admit_only";

  const createStudentMutation = useCreateStudent();

  function buildPayload(values: AdmitStudentValues): CreateStudentPayload {
    const payload: CreateStudentPayload = {
      first_name: values.firstName,
      last_name: values.lastName,
      middle_name: values.middleName || undefined,
      preferred_name: values.preferredName || undefined,
      gender: values.gender || undefined,
      nationality: values.nationality || undefined,
      country_of_birth: values.countryOfBirth || undefined,
      place_of_birth: values.placeOfBirth || undefined,
      first_language: values.firstLanguage || undefined,
      other_languages: values.otherLanguage || undefined,
      date_of_birth: values.dateOfBirth || undefined,
      religion: values.religion || undefined,
      ethnicity: values.ethnicity || undefined,
      personal_email: values.studentEmail || undefined,
      personal_phone: values.phoneNumber || undefined,
      home_address: values.houseAddress || undefined,
      // Auto-generated admission numbers are left for the backend to
      // assign (per the spec: "Omit to auto-generate"). Only send an
      // explicit value when the person chose "Enter manually".
      admission_number:
        admissionMode === "manual" ? values.admissionNumber : undefined,
      student_id_number: values.studentId || undefined,
      previous_admission_number: values.previousAdmissionNo || undefined,
      admission_date: values.admissionDate || undefined,
      admission_type: values.admissionType || undefined,
      previous_school: values.previousSchoolAttended || undefined,
      entrance_exam_result: values.entranceExamResult || undefined,
      interview_result: values.interviewResult || undefined,
    };

    // Enrolment fields are required_with each other — only include
    // them together, and only when NOT admit-only. Omitting both
    // entirely (admit-only) means plain admit, no meta block back.
    if (!isAdmitOnly) {
      payload.class_section_id = values.classSection || undefined;
      payload.academic_year_id = values.academicYear || undefined;
      payload.roll_number = values.rollNumber || undefined;
    }

    return payload;
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
      setStep(1);
      setAdmissionMode("auto");
    }
    onOpenChange(nextOpen);
  }

  useEffect(() => {
    if (open) {
      setAdmissionMode("auto");
      setValue("admissionNumber", generateAdmissionNumber());
    }
  }, [open, setValue]);

  function handleAutoGenerate() {
    setAdmissionMode("auto");
    setValue("admissionNumber", generateAdmissionNumber());
  }

  function handleEnterManually() {
    setAdmissionMode("manual");
    setValue("admissionNumber", "");
  }

  async function handleProceedFromStepOne() {
    const isValid = await trigger(STEP_ONE_FIELDS);
    if (isValid) setStep(2);
  }

  const onSubmit = async (values: AdmitStudentValues) => {
    const payload = buildPayload(values);

    try {
      const response = await createStudentMutation.mutateAsync(payload);
      await queryClient.invalidateQueries({ queryKey: ["students"] });

      if (response.meta?.over_capacity) {
        toast.warning(
          "Student was admitted and enrolled, but the class is now over capacity."
        );
      }

      setIsSuccessOpen(true);
    } catch (error) {
      console.error("Failed to admit student:", error);
      // Surface the real server-provided reason (e.g. "Admission
      // number '...' is already in use at this school.") rather than
      // a generic message — there's no Unsuccessful result modal yet,
      // so this toast is the only place the specific reason shows.
      // The form modal itself stays open on step 2 so the person can
      // correct the issue and retry without losing their input.
      const message =
        error && typeof error === "object" && "message" in error
          ? String((error as { message: unknown }).message)
          : "Failed to admit student. Please try again.";
      toast.error(message);
    }
  };

  function handleSuccessDismiss() {
    setIsSuccessOpen(false);
    handleOpenChange(false);
  }

  return (
    <>
    <FormModal
      open={open}
      onOpenChange={handleOpenChange}
      title={step === 1 ? "Admit Student" : "Add Student"}
      step={{ current: step, total: TOTAL_STEPS }}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-6"
        >
          {step === 1 && (
            <>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-neutrals-900">
                    Admission number (BFA/year/seq:4)
                  </span>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={handleAutoGenerate}
                      className={`flex h-8.25 items-center gap-2 rounded-sm py-2 pr-6 pl-6 text-[13px] font-medium transition-colors ${
                        admissionMode === "auto"
                          ? "bg-primary-900 text-white"
                          : "text-neutrals-700"
                      }`}
                    >
                      Auto generate
                    </button>

                    <button
                      type="button"
                      onClick={handleEnterManually}
                      className={`flex h-8.25 items-center gap-2 rounded-sm py-2 pr-6 pl-6 text-[13px] font-medium transition-colors ${
                        admissionMode === "manual"
                          ? "bg-primary-900 text-white"
                          : "text-neutrals-700"
                      }`}
                    >
                      Enter manually
                    </button>
                  </div>
                </div>

                <Input
                  name="admissionNumber"
                  label="Admission number"
                  disabled={admissionMode === "auto"}
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input name="studentId" label="Enter student ID" />
                  <Input
                    name="previousAdmissionNo"
                    label="Previous admission no"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[16px] font-normal leading-6 text-neutrals-text-body-light-1">
                  STUDENT DETAILS
                </span>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input name="firstName" label="Enter first name" />
                  <Input name="middleName" label="Enter middle name" />
                  <Input name="lastName" label="Enter last name" />
                  <Input name="preferredName" label="Enter preferred name" />
                  <Select
                    name="gender"
                    placeholder="Select gender"
                    options={GENDER_OPTIONS}
                  />
                  <DatePicker name="dateOfBirth" label="D.O.B" />
                  <Input name="nationality" label="Nationality" />
                  <Input name="countryOfBirth" label="Country of birth" />
                  <Input name="placeOfBirth" label="Place of birth" />
                  <Input name="firstLanguage" label="First language" />
                </div>

                <Input name="otherLanguage" label="Other language" />

                <Controller
                  name="photoId"
                  control={control}
                  render={({ field }) => (
                    <label className="flex h-30 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-primary bg-[#F9F6FF] text-center">
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(event) =>
                          field.onChange(event.target.files?.[0] ?? null)
                        }
                      />
                      <DocumentUpload
                        size={20}
                        variant="Bulk"
                        className="text-primary"
                      />
                      <span className="text-[13px] text-neutrals-700">
                        {field.value ? (
                          field.value.name
                        ) : (
                          <>
                            Drag and drop or{" "}
                            <span className="font-semibold text-primary">
                              Browse
                            </span>{" "}
                            to upload photo ID
                          </>
                        )}
                      </span>
                    </label>
                  )}
                />
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[16px] font-normal leading-6 text-neutrals-text-body-light-1">
                  SENSITIVE DATA
                </span>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input name="religion" label="Religion" />
                  <Input name="ethnicity" label="Ethnicity" />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className="flex h-14 flex-1 items-center justify-center rounded-[28px] border border-primary bg-base-white px-8 py-4"
                >
                  <span className="text-[16px] font-normal leading-[1.2] text-primary">
                    Cancel
                  </span>
                </button>

                <Button
                  type="button"
                  onClick={handleProceedFromStepOne}
                  className="h-14 flex-1 rounded-[28px]"
                >
                  Proceed
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex flex-col gap-3">
                <span className="text-[16px] font-normal leading-6 text-neutrals-text-body-light-1">
                  CONTACT DETAILS
                </span>

                <Input name="houseAddress" label="Enter house address" />
                <Input name="studentEmail" label="Enter email address" />
                <Input name="phoneNumber" label="Enter phone number" />
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[16px] font-normal leading-6 text-neutrals-text-body-light-1">
                  ACADEMIC DETAILS
                </span>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Select
                    name="classToEnroll"
                    placeholder="Class to enroll in"
                    options={CLASS_OPTIONS}
                  />
                  <DatePicker name="admissionDate" label="Admission date" />
                  <Select
                    name="admissionType"
                    placeholder="Admission type"
                    options={ADMISSION_TYPE_OPTIONS}
                  />
                  {/* TODO: confirm whether this should be a free-text
                      field instead of a fixed dropdown — a closed list
                      of "previous schools" seems unlikely to cover
                      every applicant. */}
                  <Select
                    name="previousSchoolAttended"
                    placeholder="Previous school attended"
                    options={[]}
                  />
                  <Input
                    name="entranceExamResult"
                    label="Entrance exam result"
                  />
                  <Input name="interviewResult" label="Interview result" />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-normal leading-6 text-neutrals-text-body-light-1">
                    ENROLL INTO CLASS
                  </span>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setValue("enrollmentMode", "enroll")}
                      className={`flex h-8.25 items-center gap-2 rounded-sm py-2 pr-6 pl-6 text-[13px] font-medium transition-colors ${
                        !isAdmitOnly
                          ? "bg-primary-900 text-white"
                          : "text-neutrals-700"
                      }`}
                    >
                      Enroll now
                    </button>

                    <button
                      type="button"
                      onClick={() => setValue("enrollmentMode", "admit_only")}
                      className={`flex h-8.25 items-center gap-2 rounded-sm py-2 pr-6 pl-6 text-[13px] font-medium transition-colors ${
                        isAdmitOnly
                          ? "bg-primary-900 text-white"
                          : "text-neutrals-700"
                      }`}
                    >
                      Admit only
                    </button>
                  </div>
                </div>

                {isAdmitOnly ? (
                  <p className="rounded-2xl bg-primary-bg py-4 pr-5 pl-5 text-[12px] leading-[1.4] text-neutrals-700">
                    <span className="font-medium text-neutrals-900">
                      Admit only:
                    </span>{" "}
                    the student record is created with no class placement.
                    You can enroll them later from the student&apos;s
                    Enrolment tab or the Enrolment module. A student with no
                    current enrolment is a valid state.
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Select
                        name="academicYear"
                        placeholder="Academic year"
                        options={ACADEMIC_YEAR_OPTIONS}
                      />
                      {/* TODO: real class/section list, likely filtered
                          by classToEnroll above once that relationship
                          exists. */}
                      <Select
                        name="classSection"
                        placeholder="Class/Section"
                        options={CLASS_OPTIONS}
                      />
                    </div>

                    <Input name="rollNumber" label="Roll number" />
                  </>
                )}
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex h-14 flex-1 items-center justify-center rounded-[28px] border border-primary bg-base-white px-8 py-4"
                >
                  <span className="text-[16px] font-normal leading-[1.2] text-primary">
                    Back
                  </span>
                </button>

                <Button
                  type="submit"
                  loading={
                    formState.isSubmitting || createStudentMutation.isPending
                  }
                  className="h-14 flex-1 rounded-[28px]"
                >
                  {isAdmitOnly ? "Admit student" : "Admit & Enroll student"}
                </Button>
              </div>
            </>
          )}
        </form>
      </FormProvider>
    </FormModal>

    <SuccessModal
      isOpen={isSuccessOpen}
      onClose={handleSuccessDismiss}
      heading="Successful"
      subheading="The student was added successfully."
    >
      <Button
        type="button"
        onClick={handleSuccessDismiss}
        className="h-14 w-full rounded-[28px] sm:w-auto sm:px-12"
      >
        Dismiss
      </Button>
    </SuccessModal>
    </>
  );
}