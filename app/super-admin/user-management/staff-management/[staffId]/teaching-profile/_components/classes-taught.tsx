"use client";
import { Button } from "@/components/ui/custom-button";
import { Text } from "@/components/ui";
import { AddSquare } from "iconsax-reactjs";
import Item from "./item";
import { Checkbox } from "@/components/ui/form";
import { FormProvider, useForm } from "react-hook-form";

type subject = {
  id: string;
  name: string;
};
interface Props {
  classes: subject[];
}
export default function ClassesTaught({ classes }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Text className="text-neutrals-700">CLASSES TAUGHT</Text>

        <Button
          variant="secondary"
          size="sm"
          leftIcon={
            <AddSquare variant="Bulk" size={16} className="text-primary" />
          }
        >
          Add
        </Button>
      </div>

      <div className="rounded-ml bg-primary-bg gap-4 p-2 flex flex-col">
        {classes.map((sub) => (
          <Item
            label={sub.name}
            onButtonClick={() => alert("Delete subject")}
          />
        ))}
      </div>
    </div>
  );
}
