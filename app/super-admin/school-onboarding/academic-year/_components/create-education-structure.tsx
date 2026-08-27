"use client";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { Text } from "@/components/ui";
import { CompactCheckbox } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { useSearchParams } from "next/navigation";

import {
  EducationStructureFormData,
  educationStructureSchema,
} from "@/features/academic-year";
import { zodResolver } from "@hookform/resolvers/zod";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import clsx from "clsx";

export default function CreateEducationStructure() {
  const router = useProgressRouter();
  const searchParams = useSearchParams();
  const methods = useForm<EducationStructureFormData>({
    defaultValues: {},
    resolver: zodResolver(educationStructureSchema),
  });

  const onSubmit = () => {
    router.push(
      "/super-admin/school-onboarding/academic-year?open=true&step=3"
    );
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
        <div className="flex flex-col gap-4 max-w-full">
          <div className="flex gap-4 *:flex-1">
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
          <Text className="text-neutrals-700" scale={"content"}>
            Stages School Offer
          </Text>
          <FormProvider {...methods}>
            <form
              className="flex flex-col sm:h-auto gap-6 rounded-ml p-2 w-full bg-primary-bg"
              onSubmit={methods.handleSubmit(onSubmit)}
              id="create-education-structure-form"
            >
              <CompactCheckbox
                label="Primary"
                name="stages"
                id="primary"
                value="primary"
              />

              <CompactCheckbox
                label="Junior Secondary"
                name="stages"
                id="junior-secondary"
                value="junior_secondary"
              />

              <CompactCheckbox
                label="Senior Secondary"
                name="stages"
                id="senior-secondary"
                value="senior_secondary"
              />
            </form>
          </FormProvider>

          <Text className="text-neutrals-700" scale={"content"}>
            Resulting ladder
          </Text>

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
              onClick={() =>
                router.replace("/super-admin/school-onboarding/academic-year")
              }
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
              form="create-education-structure-form"
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
  className?: string;
}
function LadderSelect({
  name,
  info,
  isActive = false,
  className,
}: LadderSelectProps) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-2 rounded-ml bg-base-white border p-4  hover:cursor-pointer",
        isActive && "border-primary",
        className
      )}
    >
      <Text className="text-primary" weight={"standard"} scale={"content"}>
        {name}
      </Text>
      <div className="flex items-center gap-4 max-w-full flex-wrap">
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
  className?: string;
}
function Ladder({ name, stage, items, className }: LadderProps) {
  return (
    <div
      className={clsx(
        "rounded-ml pb-4 flex flex-col gap-4 border border-grays-borders",
        className
      )}
    >
      <div className="flex w-full justify-between bg-primary-bg border border-grays-borders px-4 py-2 rounded-tl-ml rounded-tr-ml">
        <Text
          className="text-neutrals-text-body-light-1"
          weight={"accent"}
          scale={"content"}
        >
          {name}
        </Text>
        <Text
          className="text-neutrals-text-body-light-1"
          weight={"standard"}
          scale={"caption"}
        >
          Stage {stage}
        </Text>
      </div>

      <div className="flex-1 px-5 flex flex-col gap-4">
        {items.map((item) => (
          <div className="border border-grays-borders rounded-[8px] flex justify-between p-4">
            <Text
              className="text-neutrals-900"
              weight={"standard"}
              scale={"caption"}
            >
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
