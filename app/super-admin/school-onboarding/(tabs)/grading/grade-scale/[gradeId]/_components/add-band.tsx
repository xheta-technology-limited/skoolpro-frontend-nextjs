"use client";
import FormModal from "@/components/ui/form-modal";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/custom-button";
import { BooleanSelect, Input } from "@/components/ui/form";
import {
  CreateBandFormData,
  createBandSchema,
} from "@/features/grade-scales/schemas/create-band-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateBand } from "@/features/grade-scales/api/create-band";
import { useParams, useSearchParams } from "next/navigation";
import { setFormErrors } from "@/lib/helpers";
import { useUpdateBand } from "@/features/grade-scales/api/update-band";
import { useEffect } from "react";
import { toast } from "sonner";

interface Props {
  handleClose: () => void;
  isOpen: boolean;
  defaults?: CreateBandFormData;
}
export default function AddBand({ handleClose, isOpen, defaults }: Props) {
  const params = useParams<{ gradeId: string }>();
  const searchParams = useSearchParams();
  const bandId = searchParams.get("band-id");

  const methods = useForm<CreateBandFormData>({
    defaultValues: defaults ? defaults : {},
    resolver: zodResolver(createBandSchema),
  });
  const isEditMode = bandId ? true : false;
  const { mutate: createMutate, isPending: isCreatePending } = useCreateBand(
    params.gradeId || ""
  );
  const { mutate: updateMutate, isPending: isUpdatePending } = useUpdateBand();

  const onCreate = (data: CreateBandFormData) => {
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

  const onUpdate = (data: CreateBandFormData) => {
    if (!bandId) {
      alert("No band ID found");
      return;
    }
    updateMutate(
      { bandId: bandId || "", data: data },
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
  const onSub = (data: CreateBandFormData) => {
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
        title={isEditMode ? "Edit Grade Band" : "Add Grade Band"}
      >
        <FormProvider {...methods}>
          <form
            id="band-create"
            className="flex flex-col gap-4 w-full"
            onSubmit={methods.handleSubmit(onSub)}
          >
            <>
              <div className="flex gap-4">
                <Input label="Enter grade" name="label" />
                <Input label="Enter minimum score" name="min_score" />
                <Input label="Enter maximum score" name="max_score" />
              </div>

              <Input label="Enter grade point" name="grade_point" />
              <BooleanSelect
                label="Select pass or fail"
                name="is_pass"
                trueLabel="Pass"
                falseLabel="Fail"
              />
              <Input label="Enter description" name="description" />
              <Input
                label="Enter longer remark for report card"
                name="comment"
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
              form="band-create"
            >
              {isEditMode ? "Edit Band" : "Create Band"}
            </Button>
          </div>
        </FormProvider>
      </FormModal>
    </>
  );
}
