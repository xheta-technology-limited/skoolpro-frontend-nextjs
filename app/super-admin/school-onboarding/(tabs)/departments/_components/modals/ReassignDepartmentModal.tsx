"use client";

import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import FormModal from "@/components/ui/form-modal";
import { useReassignDepartment } from "@/features/departments/api/reassign-department";
import { useListDepartments } from "@/features/departments/api/list-departments";
import { setFormErrors } from "@/lib/helpers";
import { Department } from "@/types";

interface ReassignDepartmentModalProps {
  // The department being emptied; the modal is open while this is set.
  department: Department | undefined;
  onClose: () => void;
}

interface ReassignFormValues {
  department_id: string;
}

const plural = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

/**
 * Move a department's live subjects and staff into another department.
 *
 * Both the destination dropdown and the submit are wired to the API.
 */
export default function ReassignDepartmentModal({
  department,
  onClose,
}: ReassignDepartmentModalProps) {
  const methods = useForm<ReassignFormValues>({
    defaultValues: { department_id: "" },
  });
  const { handleSubmit, reset, setError } = methods;

  const { mutate: reassign, isPending: isReassigning } =
    useReassignDepartment();

  const { data: departmentsData, isPending: isDepartmentsPending } =
    useListDepartments(
      { per_page: 100 },
      { enabled: !!department }
    );

  const options = (departmentsData?.data ?? [])
    .filter((candidate) => candidate.id !== department?.id)
    .map((candidate) => ({ value: candidate.id, label: candidate.name }));

  function handleClose() {
    reset();
    onClose();
  }

  const onSubmit = (values: ReassignFormValues) => {
    if (!values.department_id) {
      setError("department_id", { message: "Choose a department" });
      return;
    }

    if (!department) return;

    reassign(
      {
        id: department.id,
        data: { to_department_id: values.department_id },
      },
      {
        onSuccess: ({ reassigned }) => {
          toast.success(
            `Reassigned ${plural(
              reassigned.subjects,
              "subject",
              "subjects"
            )} and ${plural(reassigned.staff, "staff member", "staff members")}`
          );
          handleClose();
        },
        onError: (mutationError) => {
          setFormErrors(setError, mutationError.errors);
        },
      }
    );
  };

  return (
    <FormModal
      open={!!department}
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
      title={`Reassign members of ${department?.name ?? ""}`}
      maxWidth="max-w-144"
    >
      {department && (
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <p className="text-[16px] text-neutrals-900">
                Moving{" "}
                {plural(department.subjects_count, "subject", "subjects")} and{" "}
                {plural(
                  department.staff_count,
                  "staff member",
                  "staff members"
                )}
                .
              </p>
              <span className="text-[14px] text-neutrals-700">
                Move them to
              </span>
              <Select
                name="department_id"
                label="Select department"
                options={options}
                isLoading={isDepartmentsPending}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex h-14 flex-1 items-center justify-center rounded-[28px] border border-primary bg-base-white px-8 py-4"
              >
                <span className="text-[16px] font-normal leading-[1.2] text-primary">
                  Cancel
                </span>
              </button>

              <Button
                type="submit"
                loading={isReassigning}
                className="h-14 flex-1 rounded-[28px]"
              >
                Reassign
              </Button>
            </div>
          </form>
        </FormProvider>
      )}
    </FormModal>
  );
}
