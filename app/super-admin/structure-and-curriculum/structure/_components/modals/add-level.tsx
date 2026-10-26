"use client";

import { Button } from "@/components/ui/custom-button";
import { Input, Select, TextArea } from "@/components/ui/form";
import FormModal from "@/components/ui/form-modal";
import { useCreateLevel } from "@/features/academic-year/api/create-level";
import { useUpdateLevel } from "@/features/academic-year/api/update-level";
import { useProgressRouter } from "@/features/page-loader";
import { createSelectOptions, setFormErrors } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import {
  CreateLevelFormData,
  createLevelSchema,
} from "@/features/academic-year/schemas/create-level-schema";
import { useListStages } from "@/features/academic-year/api/list-stages";
import { useListLevels } from "@/features/academic-year/api/list-levels";

const POSITION_OPTIONS = [
  { value: "end_of_stage", label: "End of stage" },
  { value: "after_level", label: "After a level" },
];

interface Props {
  defaults?: CreateLevelFormData;
}

export default function AddLevel({ defaults }: Props) {
  const params = usePathname();
  const searchParams = useSearchParams();
  const router = useProgressRouter();
  const levelId = searchParams.get("level-id");

  const methods = useForm<CreateLevelFormData>({
    defaultValues: defaults ? defaults : {},
    resolver: zodResolver(createLevelSchema),
  });

  const { mutate: createMutate, isPending: isCreatePending } = useCreateLevel();
  const { mutate: updateMutate, isPending: isUpdatePending } = useUpdateLevel();
  const isOpen =
    params.includes("/structure-and-curriculum") &&
    searchParams.get("add-level") === "true";
  const isEditMode = isOpen && !!levelId;

  const { data: stagesData, isPending: isStagesPending } = useListStages({
    refetchOnWindowFocus: false,
  });
  const stageOptions = createSelectOptions(stagesData, "id", "name");

  const { data: levelsData, isPending: isLevelsPending } = useListLevels({
    refetchOnWindowFocus: false,
  });
  const levelOptions = createSelectOptions(levelsData, "id", "name");

  const hasPosition = useWatch({
    control: methods.control,
    name: "position",
  });

  const onCreate = (data: CreateLevelFormData) => {
    createMutate(data, {
      onSuccess: () => {
        methods.reset();
        handleClose();
      },
      onError: (err) => {
        setFormErrors(methods.setError, err.errors);
      },
    });
  };

  const onUpdate = (data: CreateLevelFormData) => {
    if (!levelId) {
      toast.error("No level ID found");
      return;
    }
    updateMutate(
      { levelId, data },
      {
        onSuccess: () => {
          toast.success("Updated!");
          handleClose();
        },
        onError: (err) => {
          setFormErrors(methods.setError, err.errors);
        },
      }
    );
  };

  const onSubmit = (data: CreateLevelFormData) => {
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
      title={isEditMode ? "Edit Comment" : "Add Comment to Bank"}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          id="level-create"
          className="flex flex-col gap-4 w-full"
        >
          <>
            <Select
              name="education_stage_id"
              label="Select stage"
              options={stageOptions || []}
              isLoading={isStagesPending}
            />
            <Select
              name="position"
              label="Select position"
              options={POSITION_OPTIONS}
            />
            {hasPosition === "after_level" && (
              <Select
                name="insert_after_level_id"
                label="Select level"
                options={levelOptions || []}
                isLoading={isLevelsPending}
              />
            )}
            <Input name="name" label="Enter name" />
            <Input name="code" label="Enter code" />
            <Input name="typical_entry_age" label="Enter typical entry age" />
            <Input name="uniform_fee" label="Uniform fee" />
            <Input name="book_fee" label="Book fee" />
          </>
        </form>

        <div className="flex gap-6 *:flex-1">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            loading={isCreatePending || isUpdatePending}
            type="submit"
            form="level-create"
          >
            {isEditMode ? "Edit level" : "Add level"}
          </Button>
        </div>
      </FormProvider>
    </FormModal>
  );
}
