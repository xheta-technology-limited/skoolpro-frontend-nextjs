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
import {
  CreateGradingComponentFormData,
  createGradingComponentSchema,
} from "@/features/grade-scales/schemas/create-grading-component-schema";

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
}
export default function AddCompenent({ handleClose, isOpen }: Props) {
  const methods = useForm<CreateGradingComponentFormData>({
    defaultValues: {},
    resolver: zodResolver(createGradingComponentSchema),
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
              <Input label="Enter name" name="label" />
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
            <Button type="submit" form="band-create">
              Create Component
            </Button>
          </div>
        </FormProvider>
      </FormModal>
    </>
  );
}
