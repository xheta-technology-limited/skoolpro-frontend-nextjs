"use client";

import { FormProvider, useForm } from "react-hook-form";
import { usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/custom-button";
import FormModal from "@/components/ui/form-modal";
import { useCreateDepartment } from "@/features/departments/api/create-department";
import { useListStaffPicker } from "@/features/user-management/staff-management/api/list-staff-picker";
import { useProgressRouter } from "@/features/page-loader";
import { setFormErrors } from "@/lib/helpers";
import {
  DepartmentFormData,
  DepartmentFormFields,
} from "./department-form-fields";

export default function AddDepartment() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useProgressRouter();

  const isOpen =
    pathname.includes("/departments") &&
    searchParams.get("add-department") === "true";

  const methods = useForm<DepartmentFormData>({
    defaultValues: {
      name: "",
      code: "",
      description: "",
      head_staff_id: "",
      is_active: true,
    },
  });

  const { mutate: create, isPending: isCreating } = useCreateDepartment();
  const { data: staffPicker, isPending: isStaffPending } = useListStaffPicker({
    enabled: isOpen,
  });

  const headOptions = (staffPicker ?? []).map((staff) => ({
    value: staff.id,
    label: `${staff.first_name} ${staff.last_name}`.trim(),
  }));

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("add-department");
    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const onSubmit = (values: DepartmentFormData) => {
    create(
      {
        name: values.name,
        code: values.code || null,
        description: values.description || null,
        head_staff_id: values.head_staff_id || null,
        is_active: values.is_active,
      },
      {
        onSuccess: () => {
          toast.success("Department created");
          handleClose();
        },
        onError: (error) => {
          setFormErrors(methods.setError, error.errors);
        },
      }
    );
  };

  return (
    <FormModal
      onOpenChange={handleClose}
      open={isOpen}
      title="Add New Department"
      maxWidth="max-w-[50.75rem]"
    >
      <FormProvider {...methods}>
        <form
          id="department-create"
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
            form="department-create"
            loading={isCreating}
          >
            Add department
          </Button>
        </div>
      </FormProvider>
    </FormModal>
  );
}
