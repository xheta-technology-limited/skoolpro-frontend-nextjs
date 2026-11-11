"use client";

import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Spinner } from "@/components/animations";
import { Button } from "@/components/ui/custom-button";
import FormModal from "@/components/ui/form-modal";
import { useGetDepartment } from "@/features/departments/api/get-department";
import { useUpdateDepartment } from "@/features/departments/api/update-department";
import { useListStaffPicker } from "@/features/user-management/staff-management/api/list-staff-picker";
import { useProgressRouter } from "@/features/page-loader";
import { setFormErrors } from "@/lib/helpers";
import {
  DepartmentFormData,
  DepartmentFormFields,
  DepartmentHeadOption,
} from "./department-form-fields";

export default function EditDepartment() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useProgressRouter();

  const departmentId = searchParams.get("edit-department") ?? "";
  const isOpen = pathname.includes("/departments") && !!departmentId;

  const {
    data: department,
    isPending,
    isRefetching,
    error,
    refetch,
  } = useGetDepartment(departmentId, { enabled: isOpen });

  const { mutate: update, isPending: isUpdating } = useUpdateDepartment();
  const { data: staffPicker, isPending: isStaffPending } = useListStaffPicker({
    enabled: isOpen,
  });

  const methods = useForm<DepartmentFormData>({
    defaultValues: {
      name: "",
      code: "",
      description: "",
      head_staff_id: "",
      is_active: true,
    },
  });
  const { reset } = methods;

  useEffect(() => {
    if (!department) return;

    reset({
      name: department.name,
      code: department.code ?? "",
      description: department.description ?? "",
      head_staff_id: department.head_staff_id ?? department.head?.id ?? "",
      is_active: department.is_active,
    });
  }, [department, reset]);

  const headOptions = useMemo<DepartmentHeadOption[]>(() => {
    const staffOptions: DepartmentHeadOption[] = (staffPicker ?? []).map(
      (staff) => ({
        value: staff.id,
        label: `${staff.first_name} ${staff.last_name}`.trim(),
      })
    );

    const head = department?.head;
    if (!head) return staffOptions;

    const name = head.full_name ?? head.name ?? "Department head";
    if (staffOptions.some((option) => option.value === head.id)) {
      return staffOptions;
    }

    return [{ value: head.id, label: name }, ...staffOptions];
  }, [staffPicker, department]);

  function handleClose() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("edit-department");
    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  const onSubmit = (values: DepartmentFormData) => {
    if (!departmentId) return;

    update(
      {
        id: departmentId,
        data: {
          name: values.name,
          code: values.code || null,
          description: values.description || null,
          head_staff_id: values.head_staff_id || null,
          is_active: values.is_active,
        },
      },
      {
        onSuccess: () => {
          toast.success("Department updated");
          handleClose();
        },
        onError: (mutationError) => {
          setFormErrors(methods.setError, mutationError.errors);
        },
      }
    );
  };

  return (
    <FormModal
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
      open={isOpen}
      title="Edit Department"
      maxWidth="max-w-[50.75rem]"
    >
      {isPending ? (
        <div className="flex h-60 items-center justify-center">
          <Spinner size={56} />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-6">
          <p className="text-[13px] text-neutrals-700">
            {error.message || "Couldn't load this department."}
          </p>
          <Button
            type="button"
            variant="secondary"
            loading={isRefetching}
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      ) : (
        department && (
          <FormProvider {...methods}>
            <form
              id="department-edit"
              onSubmit={methods.handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-4"
            >
              <DepartmentFormFields
                headOptions={headOptions}
                isHeadLoading={isStaffPending}
              />
            </form>

            <div className="flex gap-6 *:flex-1">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                form="department-edit"
                loading={isUpdating}
              >
                Save changes
              </Button>
            </div>
          </FormProvider>
        )
      )}
    </FormModal>
  );
}
