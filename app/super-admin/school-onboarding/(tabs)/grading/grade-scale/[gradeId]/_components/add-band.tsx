"use client";
import FormModal from "@/components/ui/form-modal";
import { TickSquare } from "iconsax-reactjs";
import { FormProvider, useForm } from "react-hook-form";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/form";
import { Select } from "@/components/ui/form";
import {
  CreateBandFormData,
  createBandSchema,
} from "@/features/grade-scales/schemas/create-band-schema";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  handleClose: () => void;
  isOpen: boolean;
}
export default function AddBand({ handleClose, isOpen }: Props) {
  const methods = useForm<CreateBandFormData>({
    defaultValues: {},
    resolver: zodResolver(createBandSchema),
  });
  const onSub = () => alert("it do be working");
  return (
    <>
      <FormModal
        onOpenChange={handleClose}
        open={isOpen}
        title="Add Grade Scale"
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
              <Select
                label="Select pass or fail"
                name="is_pass"
                options={[
                  { value: "true", label: "Pass" },
                  { value: "false", label: "Fail" },
                ]}
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
            <Button type="submit" form="band-create">
              Create Band
            </Button>
          </div>
        </FormProvider>
      </FormModal>
    </>
  );
}
