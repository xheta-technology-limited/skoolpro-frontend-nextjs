"use client";

import { Button } from "@/components/ui/custom-button";
import { Input, Select, TextArea } from "@/components/ui/form";
import FormModal from "@/components/ui/form-modal";
import { useListLevels } from "@/features/academic-year/api/list-levels";
import { useCreateLevel } from "@/features/academic-year/api/create-level";
import { useUpdateLevel } from "@/features/academic-year/api/update-level";
import { useUpdateComment } from "@/features/comment-bank/api/update-comment";
import { useProgressRouter } from "@/features/page-loader";
import { createSelectOptions, setFormErrors } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { COMMENT_TYPE_OPTIONS } from "@/features/comment-bank/constants";
import {
  CreateLevelFormData,
  createLevelSchema,
} from "@/features/academic-year/schemas/create-level-schema";

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
    params.includes("/comment-bank") &&
    searchParams.get("add-comment") === "true";
  const isEditMode = isOpen && !!levelId;

  const { data: levelData, isPending: isLevelsPending } = useListLevels({
    refetchOnWindowFocus: false,
  });
  const levelOptions = createSelectOptions(levelData, "id", "name");

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
          {isEditMode ? (
            <TextArea name="body" label="Input comment" maxLength={1000} />
          ) : (
            <>
              <Select
                options={COMMENT_TYPE_OPTIONS}
                name="type"
                label="Select comment type"
              />
              <Select
                name="education_level_id"
                label="Select level"
                options={levelOptions || []}
                isLoading={isLevelsPending}
              />
              <div className="flex gap-4 items-center *:flex-1">
                <Input name="min_score" label="Enter min score" />
                <Input name="max_score" label="Enter max score" />
              </div>
              <TextArea name="body" label="Input comment" maxLength={1000} />
            </>
          )}
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
            {isEditMode ? "Edit Comment" : "Save Comment"}
          </Button>
        </div>
      </FormProvider>
    </FormModal>
  );
}
