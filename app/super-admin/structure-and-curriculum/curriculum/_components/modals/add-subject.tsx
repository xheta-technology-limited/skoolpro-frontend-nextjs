"use client";

import { Button } from "@/components/ui/custom-button";
import { Checkbox, Input, Select } from "@/components/ui/form";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { createSelectOptions, setFormErrors } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useListLevels } from "@/features/academic-year/api/list-levels";
import { useCreateSubject } from "@/features/academic-year/api/create-subject";
import { useUpdateSubject } from "@/features/academic-year/api/update-subject";
import {
  CreateSubjectRequest,
  createSubjectSchema,
} from "@/features/academic-year/schemas/create-subject-schema";
import { useListDepartments } from "@/features/academic-year/api/list-departments";
import { useListStages } from "@/features/academic-year/api/list-stages";
import { Text } from "@/components/ui";

interface Props {
  defaults?: CreateSubjectRequest & { level_id?: string; arm_id?: string };
}

export default function AddSubject({ defaults }: Props) {
  const params = usePathname();
  const searchParams = useSearchParams();
  const router = useProgressRouter();
  const subjectId = searchParams.get("subject-id") || defaults?.arm_id;
  const [formLevel, setFormLevel] = useState("");

  const methods = useForm<CreateSubjectRequest>({
    defaultValues: defaults ? defaults : {},
    resolver: zodResolver(createSubjectSchema),
  });

  const { mutate: createMutate, isPending: isCreatePending } =
    useCreateSubject();
  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdateSubject();
  const isOpen =
    params.includes("/structure-and-curriculum") &&
    searchParams.get("add-subject") === "true";
  const isEditMode = isOpen && !!subjectId;

  const { data: stages, isPending: isStagesPending } = useListStages({
    refetchOnWindowFocus: false,
  });
  const stageOptions =
    stages?.map((stage) => ({ label: stage.name, value: stage.id })) || [];

  const { data: departmentData, isPending: isDepartmentPending } =
    useListDepartments({
      refetchOnWindowFocus: false,
    });
  const departmentOptions = createSelectOptions(departmentData, "name", "name");

  const onCreate = (data: CreateSubjectRequest) => {
    const { level_id, ...payload } = data as any;
    createMutate(payload, {
      onSuccess: () => {
        methods.reset();
        handleClose();
      },
      onError: (err: any) => {
        setFormErrors(methods.setError, err.errors);
      },
    });
  };

  const onUpdate = (data: CreateSubjectRequest) => {
    if (!subjectId) {
      toast.error("No arm ID found");
      return;
    }
    const { level_id, ...payload } = data as any;
    updateMutate(
      { subjectId, data: payload },
      {
        onSuccess: () => {
          toast.success("Updated!");
          handleClose();
        },
        onError: (err: any) => {
          setFormErrors(methods.setError, err.errors);
        },
      }
    );
  };

  const onSubmit = (data: CreateSubjectRequest) => {
    if (isEditMode) {
      onUpdate(data);
    } else {
      onCreate(data);
    }
  };

  useEffect(() => {
    methods.reset(defaults ?? {});
  }, [defaults]);

  const handleClose = () => router.back();
  return (
    <FormModal
      onOpenChange={handleClose}
      open={isOpen}
      title={isEditMode ? "Edit Subject" : "Add Subject"}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          id="subject-create"
          className="flex flex-col gap-4 w-full"
        >
          <>
            <Input name="name" label="Enter name" />
            <Input name="code" label="Enter code" />
            <Select
              name="department"
              label="Select department"
              isLoading={isDepartmentPending}
              options={departmentOptions || []}
            />
            <Text
              className="text-neutrals-700"
              scale={"content"}
              weight={"accent"}
            >
              Intended Stages
            </Text>
            <Checkbox
              variant="grid"
              name="intended_stage_ids"
              options={stageOptions}
              label=""
              isLoading={isStagesPending}
              isLoadingText="Fetching stages"
            />
          </>
        </form>

        <div className="flex gap-6 *:flex-1">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            loading={isCreatePending || isUpdatePending}
            type="submit"
            form="subject-create"
          >
            {isEditMode ? "Edit subject" : "Add subject"}
          </Button>
        </div>
      </FormProvider>
    </FormModal>
  );
}
