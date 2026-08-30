"use client";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { Text } from "@/components/ui";
import { DatePicker, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { useSearchParams } from "next/navigation";
import { AddSquare } from "iconsax-reactjs";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DUMMY_CAMPUSES,
  DUMMY_CLASS_STATUSES,
  DUMMY_CLASS_TEACHERS,
} from "../constants";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { useEffect, useState } from "react";
import { useListLevels } from "@/features/academic-year/api/list-levels";
import {
  CreateArmFormData,
  createArmSchema,
} from "@/features/academic-year/schemas/create-arm";
import { useCreateArm } from "@/features/academic-year/api/create-arm";
import { toast } from "sonner";
import { setFormErrors } from "@/lib/helpers/set-form-errors";
import { useListArms } from "@/features/academic-year/api/list-arms";
import { Spinner } from "@/components/animations";
import { EducationArm } from "@/features/academic-year";
import { getTextInParentheses } from "@/lib/helpers/get-text-in-parentheses";
import { singledOutLetter } from "@/lib/helpers/single-out-letter";

export default function CreateClassSections() {
  const router = useProgressRouter();
  const searchParams = useSearchParams();
  const methods = useForm<CreateArmFormData>({
    defaultValues: {},
    resolver: zodResolver(createArmSchema),
  });
  const [activeLevel, setActiveLevel] = useState("");
  const { mutate, isPending } = useCreateArm(activeLevel);
  const { data: armsData, isFetching: isArmsFetching } = useListArms(
    activeLevel,
    { refetchOnWindowFocus: false, enabled: !!activeLevel }
  );
  const { data, isFetching } = useListLevels({ refetchOnWindowFocus: false });

  const onSubmit = (data: CreateArmFormData) => {
    mutate(
      { ...data, is_active: data.is_active === "true" ? true : false },
      {
        onSuccess: () => toast.success("Arm added successfully"),
        onError: (res) => setFormErrors(methods.setError, res.errors),
      }
    );
  };
  const open = searchParams.get("open");
  const current = searchParams.get("step");
  const isOpen = open === "true" && current === "3";

  const levelOptions =
    data?.map((level) => ({
      label: `${level.name} - ${level.stage.name}`,
      value: level.id,
    })) ?? [];
  const activeLevelLabel = activeLevel
    ? levelOptions
        .find((level) => level.value === activeLevel)
        ?.label.split("-")[0]
    : "";

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

          <Select
            options={levelOptions}
            name="class"
            label="Select Class"
            isLoading={isFetching}
            isLoadingText="Fetching levels"
            onChange={(e) => setActiveLevel(e)}
            value={activeLevel}
          />
          {activeLevel && (
            <>
              {armsData && armsData.length > 0 && (
                <>
                  <div className="flex gap-1 items-center">
                    <Text className="text-neutrals-700" scale={"content"}>
                      Arms of {activeLevelLabel}
                    </Text>
                    {isArmsFetching && <Spinner size={16} color={"#9f9c9c"} />}
                  </div>

                  {armsData?.map((arm) => (
                    <Arm key={arm.name} arm={arm} />
                  ))}
                </>
              )}

              <Text className="text-neutrals-700" scale={"content"}>
                Add an arm to {activeLevelLabel}
              </Text>
              <FormProvider {...methods}>
                <form
                  id="create-class-section-form"
                  className="sm:h-auto gap-4 w-full grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]"
                  onSubmit={methods.handleSubmit(onSubmit)}
                >
                  <Input
                    name="name"
                    label="Arm Name"
                    info="Unique within the level"
                  />
                  <Input
                    name="code"
                    label="Arm Code"
                    info="Unique within the level"
                  />
                  <Select
                    name="campus_id"
                    options={DUMMY_CAMPUSES}
                    label="Campus"
                    info="Empty picks primary campus"
                  />
                  <Select
                    name="staff_id"
                    options={DUMMY_CLASS_TEACHERS}
                    label="Class Teacher"
                    info="Staff picker"
                  />
                  <Input
                    name="capacity"
                    label="Class Capacity"
                    info="Must be greater than 1"
                  />
                  <Select
                    name="is_active"
                    options={DUMMY_CLASS_STATUSES}
                    label="Class Status"
                    info="Is this class active or not"
                  />
                </form>
                <Button
                  type="submit"
                  form="create-class-section-form"
                  variant="secondary"
                  size="sm"
                  className="justify-self-end max-w-fit ml-auto"
                  loading={isPending}
                >
                  <AddSquare
                    variant="Bulk"
                    size={16}
                    className="text-primary"
                  />
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
                      router.replace(
                        "/super-admin/school-onboarding/academic-year"
                      )
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
            </>
          )}
        </div>
      </FormModal>
    </>
  );
}

interface ArmProps {
  arm: EducationArm;
}
function Arm({ arm }: ArmProps) {
  return (
    <div className="border border-grays-borders rounded-[8px] flex items-center gap-3 p-4">
      <div className="bg-primary-100 rounded-[8px] p-2">
        <Text weight={"bold"} scale={"caption"}>
          {singledOutLetter(arm.code)}
        </Text>
      </div>
      <div className="flex gap-1 flex-col">
        <div className="flex gap-3">
          <Text className="text-neutrals-900 font-normal" scale={"caption"}>
            {arm.level.name}
          </Text>

          <Text scale={"caption"} className="text-[0.75rem] text-neutrals-700">
            {`• ${getTextInParentheses(arm.name)}`}
          </Text>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <Text
            weight={"standard"}
            scale={"caption"}
            className="text-[0.75rem] text-neutrals-700"
          >{`Class teacher: ${"empty for now"}`}</Text>
          <Text
            weight={"standard"}
            scale={"caption"}
            className="text-[0.75rem] text-neutrals-700"
          >{`Capacity: ${arm.capacity}`}</Text>
          <Text
            weight={"standard"}
            scale={"caption"}
            className="text-[0.75rem] text-neutrals-700"
          >
            {"Empty for now"}
          </Text>
        </div>
      </div>
    </div>
  );
}
