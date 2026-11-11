"use client";

import { FormProvider, useForm } from "react-hook-form";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import FormModal from "@/components/ui/form-modal";
import { useReassignDepartment } from "@/features/departments/api/reassign-department";
import {
  listDepartments,
  useListDepartments,
} from "@/features/departments/api/list-departments";
import { departmentKeys } from "@/features/departments/api/query-keys";
import { staffKeys } from "@/features/user-management/staff-management/api/query-keys";
import { schoolSubjectKeys } from "@/features/academic-year/api/query-keys";
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

// Destinations are loaded 100 at a time so every eligible department is
// reachable, not just the first page.
const DESTINATION_PAGE_SIZE = 100;

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
  const queryClient = useQueryClient();

  const { mutate: reassign, isPending: isReassigning } =
    useReassignDepartment();

  const {
    data: firstPageData,
    isPending: isFirstPagePending,
    error: firstPageError,
    refetch: refetchFirstPage,
  } = useListDepartments(
    { per_page: DESTINATION_PAGE_SIZE, page: 1 },
    { enabled: !!department }
  );

  // The first response tells us how many extra pages exist; fetch the rest so
  // the selector exposes every eligible destination.
  const lastPage = firstPageData?.meta.last_page ?? 1;
  const remainingPages = useQueries({
    queries: Array.from({ length: Math.max(lastPage - 1, 0) }, (_, index) => {
      const page = index + 2;

      return {
        queryKey: departmentKeys.filtered(
          undefined,
          undefined,
          page,
          DESTINATION_PAGE_SIZE
        ),
        queryFn: () =>
          listDepartments({ per_page: DESTINATION_PAGE_SIZE, page }),
        enabled: !!department,
      };
    }),
  });

  const destinations = [firstPageData, ...remainingPages.map((q) => q.data)]
    .flatMap((page) => page?.data ?? []);

  const isDepartmentsPending =
    isFirstPagePending || remainingPages.some((query) => query.isPending);
  const isDepartmentsError =
    !!firstPageError || remainingPages.some((query) => query.error);

  const options = destinations
    .filter((candidate) => candidate.id !== department?.id)
    .map((candidate) => ({ value: candidate.id, label: candidate.name }));

  function handleRetryDestinations() {
    refetchFirstPage();
    remainingPages.forEach((query) => query.refetch());
  }

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
          // The staff and subject lists sit behind their own feature keys, so
          // refresh them here (the app layer may span feature boundaries).
          queryClient.invalidateQueries({ queryKey: staffKeys.all });
          queryClient.invalidateQueries({ queryKey: schoolSubjectKeys.all });
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

              {isDepartmentsError && (
                <div className="flex items-center gap-2">
                  <p className="text-[13px] text-[#D64545]">
                    Couldn&apos;t load destination departments.
                  </p>
                  <button
                    type="button"
                    onClick={handleRetryDestinations}
                    className="cursor-pointer text-[13px] font-medium text-primary underline"
                  >
                    Retry
                  </button>
                </div>
              )}
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
