"use client";
import FormModal from "@/components/ui/form-modal";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/form";
import { Select } from "@/components/ui/form";
import {
  CreateGradingComponentFormData,
  createGradingComponentSchema,
} from "@/features/grade-scales/schemas/create-grading-component-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateGradingComponent } from "@/features/grade-scales/api/create-grading-component";
import { useUpdateGradingComponent } from "@/features/grade-scales/api/update-grading-component";
import { useParams, useSearchParams } from "next/navigation";
import { setFormErrors } from "@/lib/helpers";
import { useEffect } from "react";
import { toast } from "sonner";

const assessmentTypes = [
  { value: "test", label: "Test" },
  { value: "quiz", label: "Quiz" },
  { value: "project", label: "Project" },
  { value: "practical", label: "Practical" },
  { value: "final_exam", label: "Final Exam" },
];
interface Props {
  handleClose: () => void;
  isOpen: boolean;
  defaults?: CreateGradingComponentFormData;
}
export default function AddCompenent({ handleClose, isOpen, defaults }: Props) {
  const params = useParams<{ schemeId: string }>();
  const searchParams = useSearchParams();
  const componentId = searchParams.get("component-id");

  const methods = useForm<CreateGradingComponentFormData>({
    defaultValues: defaults ? defaults : {},
    resolver: zodResolver(createGradingComponentSchema),
  });
  const isEditMode = componentId ? true : false;
  const { mutate: createMutate, isPending: isCreatePending } =
    useCreateGradingComponent(params.schemeId || "");
  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdateGradingComponent();

  const onCreate = (data: CreateGradingComponentFormData) => {
    createMutate(data, {
      onError: (err) => {
        setFormErrors(methods.setError, err.errors);
      },
      onSuccess: () => {
        toast.success("Created!");
        handleClose();
      },
    });
  };

  const onUpdate = (data: CreateGradingComponentFormData) => {
    if (!componentId) {
      alert("No component ID found");
      return;
    }
    updateMutate(
      { componentId, data },
      {
        onError: (err) => {
          setFormErrors(methods.setError, err.errors);
        },
        onSuccess: () => {
          toast.success("Updated!");
          handleClose();
        },
      }
    );
  };

  const onSub = (data: CreateGradingComponentFormData) => {
    if (isEditMode) {
      onUpdate(data);
    } else {
      onCreate(data);
    }
  };

  useEffect(() => {
    methods.reset(defaults ?? {});
  }, [defaults]);
  return (
    <>
      <FormModal
        onOpenChange={handleClose}
        open={isOpen}
        title={isEditMode ? "Edit Component" : "Add Component"}
      >
        <FormProvider {...methods}>
          <form
            id="component-create"
            className="flex flex-col gap-4 w-full"
            onSubmit={methods.handleSubmit(onSub)}
          >
            <>
              <Input label="Enter name" name="name" />
              <Select
                label="Select type"
                name="assessment_type"
                options={assessmentTypes}
              />
              <Input label="Max score" name="max_score" />
              <Input label="Weight(%)" name="weight" />
            </>
          </form>

          <div className="flex gap-6 *:flex-1">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              loading={isCreatePending || isUpdatePending}
              type="submit"
              form="component-create"
            >
              {isEditMode ? "Edit Component" : "Create Component"}
            </Button>
          </div>
        </FormProvider>
      </FormModal>
    </>
  );
}
