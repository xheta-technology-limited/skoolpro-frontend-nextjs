"use client";

import { Button } from "@/components/ui/custom-button";
import { Input, Select } from "@/components/ui/form";
import FormModal from "@/components/ui/form-modal";
import { useCreateStage } from "@/features/academic-year/api/create-stage";
import { useProgressRouter } from "@/features/page-loader";
import { createSelectOptions, setFormErrors } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import {
  CreateStageFormData,
  createStageSchema,
} from "@/features/academic-year/schemas/create-stage-schema";
import { useListSchoolTypes } from "@/features/academic-year/api/list-school-types";

export default function AddStage() {
  const params = usePathname();
  const searchParams = useSearchParams();
  const router = useProgressRouter();

  const methods = useForm<CreateStageFormData>({
    defaultValues: {},
    resolver: zodResolver(createStageSchema),
  } as any);

  const { mutate: createMutate, isPending: isCreatePending } = useCreateStage();
  const isOpen =
    params.includes("/structure-and-curriculum") &&
    searchParams.get("add-stage") === "true";

  const { data: schoolTypesData, isPending: isSchoolTypesPending } =
    useListSchoolTypes({
      refetchOnWindowFocus: false,
    });

  const schoolTypeOptions = [
    { value: "", label: "None" },
    ...(createSelectOptions(schoolTypesData, "id", "name") || []),
  ];

  const onCreate = (data: CreateStageFormData) => {
    const payload = {
      ...data,
      school_type_id:
        data.school_type_id === "" ? undefined : data.school_type_id,
    };
    createMutate(payload as CreateStageFormData, {
      onSuccess: () => {
        methods.reset();
        handleClose();
      },
      onError: (err) => {
        setFormErrors(methods.setError, err.errors);
      },
    });
  };

  const onSubmit = (data: CreateStageFormData) => {
    onCreate(data);
  };

  const handleClose = () =>
    router.push(
      "/super-admin/structure-and-curriculum/structure?tab=education"
    );
  return (
    <FormModal onOpenChange={handleClose} open={isOpen} title="Add Stage">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit as any)}
          id="stage-create"
          className="flex flex-col gap-4 w-full"
        >
          <>
            <Input name="name" label="Enter name" placeholder="Enter name" />
            <Input name="code" label="Enter code" placeholder="Enter code" />
            <Input
              name="sequence"
              label="Enter sequence"
              placeholder="Enter sequence"
              type="number"
            />
            <Select
              name="school_type_id"
              label="Select school type"
              options={schoolTypeOptions}
              isLoading={isSchoolTypesPending}
            />
          </>
        </form>

        <div className="flex gap-6 *:flex-1">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button loading={isCreatePending} type="submit" form="stage-create">
            Add stage
          </Button>
        </div>
      </FormProvider>
    </FormModal>
  );
}
