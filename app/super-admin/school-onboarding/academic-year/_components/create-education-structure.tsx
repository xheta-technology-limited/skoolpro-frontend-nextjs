"use client";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { Text } from "@/components/ui";
import {
  CompactCheckbox,
  DatePicker,
  Input,
  Select,
} from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { useSearchParams } from "next/navigation";
import { AddSquare } from "iconsax-reactjs";

import {
  AcademicYearFormData,
  academicYearSchema,
} from "@/features/academic-year";
import { zodResolver } from "@hookform/resolvers/zod";
import { SESSION_TYPE_OPTIONS } from "../constants";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import clsx from "clsx";

export default function CreateEducationStructure() {
  const router = useProgressRouter();
  const searchParams = useSearchParams();
  const methods = useForm<AcademicYearFormData>({
    //TODO: make one for education structure
    defaultValues: {
      terms: [
        { name: "", starts_on: "", ends_on: "" },
        { name: "", starts_on: "", ends_on: "" },
        { name: "", starts_on: "", ends_on: "" },
      ],
    },
    resolver: zodResolver(academicYearSchema), //TODO: change this. Make a schema for this
  });

  const onSubmit = () => {
    alert("clicked fr fr");
  };
  const open = searchParams.get("open");
  const current = searchParams.get("step");
  const isOpen = open === "true" && current === "2";

  return (
    <>
      <FormModal
        title="Create Academic Year"
        open={isOpen}
        onOpenChange={() =>
          router.replace("/super-admin/school-onboarding/academic-year")
        }
      >
        <div className="flex flex-col gap-8">
          <div className="flex gap-4">
            <LadderSelect
              name="Nigerian Ladder"
              info={[
                "Nursery",
                "Primary",
                "Junior secondary",
                "Senior",
                "14 levels",
              ]}
              isActive={true}
            />
            <LadderSelect
              name="Nigerian Ladder"
              info={[
                "Nursery",
                "Primary",
                "Junior secondary",
                "Senior",
                "14 levels",
              ]}
            />
          </div>
          <Text scale={"content"}>Stages School Offer</Text>
          <FormProvider {...methods}>
            <form
              className="flex flex-col sm:h-auto gap-6 w-full bg-primary-bg"
              onSubmit={methods.handleSubmit(onSubmit)}
              id="le-form"
            >
              <CompactCheckbox
                label="primary"
                name="something dumb for now"
                id="sumdumb"
              />
              <CompactCheckbox
                label="second"
                name="something dumb fo"
                id="sumstupb"
              />
            </form>
          </FormProvider>

          <Text scale={"content"}>Resulting ladder</Text>

          {Array.from({ length: 5 }).map((_, index) => (
            <Ladder
              key={index}
              name="Primary"
              stage={index}
              items={[
                { name: "Foofoo", age: 45 },
                { name: "She", age: 78 },
                { name: "Whodat?", age: 90 },
              ]}
            />
          ))}

          <div className="flex *:flex-1 gap-6">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
            >
              Continue
            </Button>
          </div>
        </div>
      </FormModal>
    </>
  );
}

interface LadderSelectProps {
  name: string;
  info: string[];
  isActive?: boolean;
}
function LadderSelect({ name, info, isActive = false }: LadderSelectProps) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-2 rounded-ml bg-base-white border p-4 ",
        isActive && "border-primary"
      )}
    >
      <Text className="text-primary" weight={"standard"} scale={"content"}>
        {name}
      </Text>
      <div className="flex items-center gap-4">
        {info.map((inf) => (
          <Text
            className="text-[0.75rem]"
            weight={"standard"}
            scale={"caption"}
          >
            {inf}
          </Text>
        ))}
      </div>
    </div>
  );
}

interface LadderItem {
  name: string;
  age: number;
}
interface LadderProps {
  name: string;
  stage: number;
  items: LadderItem[];
}
function Ladder({ name, stage, items }: LadderProps) {
  return (
    <div className="rounded-ml pb-4 flex flex-col gap-4 border border-primary-100">
      <div className="flex w-full justify-between bg-primary-bg border border-primary">
        <Text
          className="text-neutrals-text-body-light-1"
          weight={"accent"}
          scale={"content"}
        >
          {name}
        </Text>
        <Text weight={"standard"} scale={"caption"}>
          Stage {stage}
        </Text>
      </div>

      <div className="flex-1 px-5 flex flex-col gap-4">
        {items.map((item) => (
          <div className="border border-grays-borders rounded-[8px] flex justify-between p-4">
            <Text weight={"standard"} scale={"caption"}>
              {item.name}
            </Text>
            <Text
              className="text-[0.75rem] text-neutrals-700"
              weight={"standard"}
              scale={"caption"}
            >{`Age ${item.age}`}</Text>
          </div>
        ))}
      </div>
    </div>
  );
}
