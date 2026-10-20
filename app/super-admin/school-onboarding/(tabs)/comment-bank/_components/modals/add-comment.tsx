"use client";

import { Button } from "@/components/ui/custom-button";
import { Input, Select, TextArea } from "@/components/ui/form";
import FormModal from "@/components/ui/form-modal";
import { useListLevels } from "@/features/academic-year/api/list-levels";
import { useCreateComment } from "@/features/comment-bank/api/create-comment";
import {
  CreateCommentFormData,
  createCommentSchema,
} from "@/features/comment-bank/schemas/create-comment-schema";
import { useProgressRouter } from "@/features/page-loader";
import { createSelectOptions, setFormErrors } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

const COMMENT_TYPE_OPTIONS = [
  { value: "form_teacher", label: "Form Teacher" },
  { value: "head_teacher", label: "Head Teacher" },
  { value: "principal", label: "Principal" },
  { value: "subject_teacher", label: "Subject Teacher" },
];
export default function AddComment() {
  const params = usePathname();
  const searchParams = useSearchParams();
  const router = useProgressRouter();

  const methods = useForm<CreateCommentFormData>({
    defaultValues: {},
    resolver: zodResolver(createCommentSchema),
  });

  const { mutate: createMutate, isPending: isCreatePending } =
    useCreateComment();
  const isOpen =
    params.includes("/comment-bank") &&
    searchParams.get("add-comment") === "true";
  const isEditMode = isOpen && searchParams.get("comment-id");

  const { data: levelData, isPending: isLevelsPending } = useListLevels({
    refetchOnWindowFocus: false,
  });
  const levelOptions = createSelectOptions(levelData, "id", "name");

  const onSubmit = (data: CreateCommentFormData) => {
    if (isEditMode) {
      return;
    } else {
      createMutate(data, {
        onSuccess: () => {
          methods.reset();
          handleClose();
        },
        onError: (err) => {
          setFormErrors(methods.setError, err.errors);
        },
      });
    }
  };

  useEffect(() => {
    console.log("is open: ", isOpen);
  }, [isOpen]);

  const handleClose = () =>
    router.push("/super-admin/school-onboarding/comment-bank");
  return (
    <FormModal
      onOpenChange={handleClose}
      open={isOpen}
      title="Add Comment to Bank"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          id="comment-create"
          className="flex flex-col gap-4 w-full"
        >
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
        </form>

        <div className="flex gap-6 *:flex-1">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button loading={isCreatePending} type="submit" form="comment-create">
            {isEditMode ? "Edit Comment" : "Save Comment"}
          </Button>
        </div>
      </FormProvider>
    </FormModal>
  );
}
