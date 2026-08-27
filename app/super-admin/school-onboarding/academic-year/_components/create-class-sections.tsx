"use client";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { Text } from "@/components/ui";
import { DatePicker, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { useSearchParams } from "next/navigation";
import { AddSquare } from "iconsax-reactjs";

import {
  AcademicYearFormData,
  academicYearSchema,
  ClassSectionsFormData,
  classSectionsSchema,
} from "@/features/academic-year";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type Arm,
  DUMMY_CAMPUSES,
  DUMMY_CLASSES,
  DUMMY_CLASS_STATUSES,
  DUMMY_CLASS_TEACHERS,
  DUMMY_ARMS,
} from "../constants";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";

export default function CreateClassSections() {
  const router = useProgressRouter();
  const searchParams = useSearchParams();
  const methods = useForm<ClassSectionsFormData>({
    defaultValues: {},
    resolver: zodResolver(classSectionsSchema),
  });
  const levelController = useForm<{ class: string }>();

  const onSubmit = () => {
    alert("did that shit");
  };
  const open = searchParams.get("open");
  const current = searchParams.get("step");
  const isOpen = open === "true" && current === "3";

  return (
    <>
      <FormModal
        title="Create Class Sections"
        open={isOpen}
        onOpenChange={() =>
          router.replace("/super-admin/school-onboarding/academic-year")
        }
      >
        <div className="flex flex-col gap-4 max-w-full">
          <Text className="text-neutrals-700" scale={"content"}>
            Level
          </Text>
          <FormProvider {...levelController}>
            <form>
              <Select
                options={DUMMY_CLASSES}
                name="class"
                label="Select Class"
              />
            </form>
          </FormProvider>
          <Text className="text-neutrals-700" scale={"content"}>
            Arms of $use_watch_label_goes_here
          </Text>
          {DUMMY_ARMS.map((arm) => (
            <Arm key={arm.name} arm={arm} />
          ))}
          <Text className="text-neutrals-700" scale={"content"}>
            Add an arm to $use_watch_label_goes_here
          </Text>
          <FormProvider {...methods}>
            <form
              id="create-class-section-form"
              className="sm:h-auto gap-4 w-full grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <Input name="arm_name" label="Arm Name" />
              <Input name="arm_code" label="Arm Code" />
              <Select name="campus" options={DUMMY_CAMPUSES} label="Campus" />
              <Select
                name="class_teacher"
                options={DUMMY_CLASS_TEACHERS}
                label="Class Teacher"
              />
              <Input name="class_capacity" label="Class Capacity" />
              <Select
                name="class_status"
                options={DUMMY_CLASS_STATUSES}
                label="Class Status"
              />
            </form>
            <Button
              type="submit"
              form="create-class-section-form"
              variant="secondary"
              size="sm"
              className="justify-self-end max-w-fit ml-auto"
            >
              <AddSquare variant="Bulk" size={16} className="text-primary" />
              <Text
                className="text-primary"
                weight={"standard"}
                scale={"caption"}
              >
                Add Arm
              </Text>
            </Button>
            <div className="flex *:flex-1 gap-6">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
                onClick={() =>
                  router.replace("/super-admin/school-onboarding/academic-year")
                }
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  router.push(
                    "/super-admin/school-onboarding/academic-year?open=true&step=4"
                  )
                }
                size="lg"
                className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
              >
                Continue
              </Button>
            </div>
          </FormProvider>
        </div>
      </FormModal>
    </>
  );
}

interface ArmProps {
  arm: Arm;
}
function Arm({ arm }: ArmProps) {
  const { arm: code, name, branch, campus, teacher, capacity } = arm;
  return (
    <div className="border border-grays-borders rounded-[8px] flex items-center gap-3 p-4">
      <div className="bg-primary-100 rounded-[8px] p-2">
        <Text weight={"bold"} scale={"caption"}>
          {code}
        </Text>
      </div>
      <div className="flex gap-1 flex-col">
        <div className="flex gap-3">
          <Text className="text-neutrals-900 font-normal" scale={"caption"}>
            {name}
          </Text>

          <Text scale={"caption"} className="text-[0.75rem] text-neutrals-700">
            {`• ${branch}`}
          </Text>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <Text
            weight={"standard"}
            scale={"caption"}
            className="text-[0.75rem] text-neutrals-700"
          >{`Class teacher: ${teacher}`}</Text>
          <Text
            weight={"standard"}
            scale={"caption"}
            className="text-[0.75rem] text-neutrals-700"
          >{`Capacity: ${capacity}`}</Text>
          <Text
            weight={"standard"}
            scale={"caption"}
            className="text-[0.75rem] text-neutrals-700"
          >
            {campus}
          </Text>
        </div>
      </div>
    </div>
  );
}
