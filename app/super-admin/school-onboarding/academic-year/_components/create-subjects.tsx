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

export default function CreateSubjects() {
  const router = useProgressRouter();
  const searchParams = useSearchParams();
  const methods = useForm<ClassSectionsFormData>({
    defaultValues: {},
    resolver: zodResolver(classSectionsSchema),
  });
  const levelController = useForm<{ class: string }>();

  const onSubmit = () => {
    router.push(
      "/super-admin/school-onboarding/academic-year?open=true&step=preview"
    );
  };
  const open = searchParams.get("open");
  const current = searchParams.get("step");
  const isOpen = open === "true" && current === "4";

  return (
    <>
      <FormModal
        title="Create Subjects"
        open={isOpen}
        onOpenChange={() =>
          router.replace("/super-admin/school-onboarding/academic-year")
        }
      >
        <div className="flex flex-col gap-4 max-w-full">
          <Text className="text-neutrals-700" scale={"content"}>
            Add a subject
          </Text>
          <FormProvider {...methods}>
            <form
              id="create-class-section-form"
              className="sm:h-auto gap-4 w-full grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <Input name="arm_name" label="Arm Name" />
              <Input name="arm_name" label="Arm Code" />
              <Select name="name" options={DUMMY_CAMPUSES} label="Campus" />
              <Select
                name="code"
                options={DUMMY_CLASS_TEACHERS}
                label="Class Teacher"
              />
            </form>
            <Button
              type="button"
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
                Add Subject
              </Text>
            </Button>
          </FormProvider>
          <Text className="text-neutrals-700" scale={"content"}>
            Subject catalog
          </Text>
          ////Table goes here
          <>
            <Text className="text-neutrals-700" scale={"content"}>
              Add a subject
            </Text>
            <FormProvider {...methods}>
              <form
                id="create-class-section-form"
                className="sm:h-auto gap-4 w-full grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]"
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                <Select name="name" options={DUMMY_CAMPUSES} label="Campus" />
                <Select
                  name="code"
                  options={DUMMY_CLASS_TEACHERS}
                  label="Class Teacher"
                />
                <Select name="name" options={DUMMY_CAMPUSES} label="Campus" />
                <Select
                  name="code"
                  options={DUMMY_CLASS_TEACHERS}
                  label="Class Teacher"
                />
                <Select name="name" options={DUMMY_CAMPUSES} label="Campus" />
                <Select
                  name="code"
                  options={DUMMY_CLASS_TEACHERS}
                  label="Class Teacher"
                />
              </form>
              <Button
                type="button"
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
                  Add Subject
                </Text>
              </Button>
            </FormProvider>
          </>
          <Button
            type="button"
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
              size="lg"
              className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
            >
              Finish Setup
            </Button>
          </div>
        </div>
      </FormModal>
    </>
  );
}
