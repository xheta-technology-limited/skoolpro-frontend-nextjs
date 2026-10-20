"use client";

import { Button } from "@/components/ui/custom-button";
import { Input, Select, TextArea } from "@/components/ui/form";
import FormModal from "@/components/ui/form-modal";
import { useListLevels } from "@/features/academic-year/api/list-levels";
import { useCreateComment } from "@/features/comment-bank/api/create-comment";
import { useUpdateComment } from "@/features/comment-bank/api/update-comment";
import {
  CreateCommentFormData,
  createCommentSchema,
} from "@/features/comment-bank/schemas/create-comment-schema";
import { useProgressRouter } from "@/features/page-loader";
import { createSelectOptions, setFormErrors } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

const COMMENT_TYPE_OPTIONS = [
  { value: "form_teacher", label: "Form Teacher" },
  { value: "head_teacher", label: "Head Teacher" },
  { value: "principal", label: "Principal" },
  { value: "subject_teacher", label: "Subject Teacher" },
];

interface Props {
  defaults?: CreateCommentFormData;
}

export default function AddComment({ defaults }: Props) {
  const params = usePathname();
  const searchParams = useSearchParams();
  const router = useProgressRouter();
  const commentId = searchParams.get("comment-id");

  const methods = useForm<CreateCommentFormData>({
    defaultValues: defaults ? defaults : {},
    resolver: zodResolver(createCommentSchema),
  });

  const { mutate: createMutate, isPending: isCreatePending } =
    useCreateComment();
  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdateComment();
  const isOpen =
    params.includes("/comment-bank") &&
    searchParams.get("add-comment") === "true";
  const isEditMode = isOpen && !!commentId;

  const { data: levelData, isPending: isLevelsPending } = useListLevels({
    refetchOnWindowFocus: false,
  });
  const levelOptions = createSelectOptions(levelData, "id", "name");

  const onCreate = (data: CreateCommentFormData) => {
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

  const onUpdate = (data: CreateCommentFormData) => {
    if (!commentId) {
      toast.error("No comment ID found");
      return;
    }
    updateMutate(
      { commentId, data },
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

  const onSubmit = (data: CreateCommentFormData) => {
    if (isEditMode) {
      onUpdate(data);
    } else {
      onCreate(data);
    }
  };

  useEffect(() => {
    methods.reset(defaults ?? {});
  }, [defaults]);

  const handleClose = () =>
    router.push("/super-admin/school-onboarding/comment-bank");
  return (
    <FormModal
      onOpenChange={handleClose}
      open={isOpen}
      title={isEditMode ? "Edit Comment" : "Add Comment to Bank"}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          id="comment-create"
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
            form="comment-create"
          >
            {isEditMode ? "Edit Comment" : "Save Comment"}
          </Button>
        </div>
      </FormProvider>
    </FormModal>
  );
}
