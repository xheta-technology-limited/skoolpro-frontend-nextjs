"use client";

import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { usePathname, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { Input, Select } from "@/components/ui/form";
import { InfoCircle, TickSquare } from "iconsax-reactjs";
import { Button } from "@/components/ui/custom-button";
import { Text } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreatePassMarkFormData,
  createPassMarkSchema,
} from "@/features/grade-scales/schemas/create-pass-mark-schema";

//TODO: Make this also double as editing a grade scale
export default function AddPassMark() {
  const params = usePathname();
  const searchParams = useSearchParams();
  const router = useProgressRouter();

  const isOpen =
    params.includes("/grading") && searchParams.get("add-pass-mark") === "true";

  const handleClose = () =>
    router.push("/super-admin/school-onboarding/grading");

  const methods = useForm<CreatePassMarkFormData>({
    defaultValues: {},
    resolver: zodResolver(createPassMarkSchema),
  });

  return (
    <FormModal onOpenChange={handleClose} open={isOpen} title="Set Pass Mark">
      <FormProvider {...methods}>
        <form id="scheme-create" className="flex flex-col gap-4 w-full">
          <Select
            name="scope"
            label="Select scope"
            options={[
              { value: "general", label: "General (whole school)" },
              { value: "programme", label: "Program (a stage)" },
              { value: "class", label: "A specific class" },
            ]}
          />

          {/* TODO: Make this only show if the scope is class */}
          <Select
            name="class_section_id"
            label="Select class"
            options={[
              {
                value: "subject_assignment",
                label: "TODO: Fetch from backend",
              },
            ]}
          />
          {/* TODO: Make this only show if scope is... the other */}
          <Select
            name="education_stage_id"
            label="Select stage"
            options={[
              {
                value: "subject_assignment",
                label: "TODO: Fetch from backend",
              },
            ]}
          />
          <Input label="Enter pass mark(0 - 100)" name="mark" />

          <div className="flex items-center gap-2">
            <InfoCircle variant="Bulk" size={24} color="#0301FF" />
            <Text scale={"content"} className="text-neutrals-700">
              The subject-level pass mark is set in the Curriculum module, on
              the subject itself — not here.
            </Text>
          </div>
        </form>

        <div className="flex gap-6 *:flex-1">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="scheme-create"
            onClick={() => alert("some api stuff")}
          >
            Create Pass Mark
          </Button>
        </div>
      </FormProvider>
    </FormModal>
  );
}
