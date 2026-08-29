"use client";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { Text } from "@/components/ui";
import { DatePicker, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { useSearchParams } from "next/navigation";
import { AddSquare } from "iconsax-reactjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { DUMMY_CAMPUSES, DUMMY_CLASS_TEACHERS } from "../constants";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import CatalogTable from "./catalog-table";
import AssignedSubjectsTable from "./assigned-subjects-table";
import { SuccessModal } from "@/components/common";

export default function CreateSubjects() {
  const router = useProgressRouter();
  const searchParams = useSearchParams();
  const methods = useForm<any>({
    //placeholder, change when implementing api
    defaultValues: {},
    // resolver: zodResolver(),
  });
  const levelController = useForm<{ class: string }>();

  const finish = () => {
    router.push(
      "/super-admin/school-onboarding/academic-year?open=true&step=success"
    );
  };
  const open = searchParams.get("open");
  const current = searchParams.get("step");
  const isOpen = open === "true" && current === "4";
  const isSuccess = open === "true" && current === "success";

  const onCloseSuccessModal = () =>
    router.push("/super-admin/school-onboarding/academic-year");

  const addSubject = () => {
    alert("Do some API stuff");
  };
  const assignSubject = () => {
    alert("Also do some API stuff");
  };

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
              id="add-subject-form"
              className="sm:h-auto gap-4 w-full grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]"
              onSubmit={methods.handleSubmit(addSubject)}
            >
              <Input name="arm_name" label="Arm Name" />
              <Input name="arm_code" label="Arm Code" />
              <Select name="name" options={DUMMY_CAMPUSES} label="Campus" />
              <Select
                name="code"
                options={DUMMY_CLASS_TEACHERS}
                label="Class Teacher"
              />
            </form>
            <Button
              type="submit"
              form="add-subject-form"
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
          <CatalogTable />
          <>
            <Text className="text-neutrals-700" scale={"content"}>
              Assign subject to a level
            </Text>
            <FormProvider {...methods}>
              <form
                id="assign-subject-form"
                className="sm:h-auto gap-4 w-full grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]"
                onSubmit={methods.handleSubmit(assignSubject)}
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
                type="submit"
                form="assign-subject-form"
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
                  Assign Subject
                </Text>
              </Button>
            </FormProvider>
          </>
          <Text className="text-neutrals-700" scale={"content"}>
            Assigned to class_name_here
          </Text>
          <AssignedSubjectsTable />
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
              onClick={finish}
              size="lg"
              className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
            >
              Finish Setup
            </Button>
          </div>
        </div>
      </FormModal>

      <SuccessModal
        onClose={onCloseSuccessModal}
        isOpen={isSuccess}
        heading="Successful"
        subheading="Academic setup has been added successfully."
      >
        <Button size="lg" onClick={onCloseSuccessModal}>
          Dismiss
        </Button>
      </SuccessModal>
    </>
  );
}
