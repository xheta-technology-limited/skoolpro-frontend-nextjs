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
export default function AddPromotionRule() {
  const params = usePathname();
  const searchParams = useSearchParams();
  const router = useProgressRouter();

  const isOpen =
    params.includes("/grading") &&
    searchParams.get("add-promotion-rule") === "true";

  const handleClose = () =>
    router.push("/super-admin/school-onboarding/grading");

  const methods = useForm<CreatePassMarkFormData>({
    defaultValues: {},
    resolver: zodResolver(createPassMarkSchema),
  });

  return (
    <FormModal onOpenChange={handleClose} open={isOpen} title="Set Pass Mark">
      <FormProvider {...methods}>
        <form id="set-promotion-rule" className="flex flex-col gap-4 w-full">
          <Select
            name="scope"
            label="Select scope"
            options={[
              { value: "school", label: "General (whole school)" },
              { value: "stage", label: "Program (a stage)" },
              { value: "level", label: "A specific class" },
            ]}
          />
          <Input label="Enter minimum average" name="minimum_average" />
          <Input
            label="Enter attendance requirement(%)"
            name="attendance_requirement"
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
        </form>

        <div className="flex gap-6 *:flex-1">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="set-promotion-rule"
            onClick={() => alert("some api stuff")}
          >
            Create Rule
          </Button>
        </div>
      </FormProvider>
    </FormModal>
  );
}
