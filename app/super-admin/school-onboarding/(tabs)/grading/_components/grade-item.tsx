"use client";
import { Spinner } from "@/components/animations";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { titleCase } from "@/lib/helpers";
import { AddSquare } from "iconsax-reactjs";
import { ReactNode } from "react";

interface Props {
  label: string;
  subLabel: string;
  buttonText: string;
  buttonFunc: () => void;
  isLoading: boolean;
  children: ReactNode;
}

export default function GradeItem({
  label,
  subLabel,
  buttonFunc,
  buttonText,
  children,
  isLoading,
}: Props) {
  return (
    <div>
      <div className="w-full mb-8 flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-col gap-1 text-left max-w-146.5">
          <div className="flex gap-2 items-center">
            <Text
              className="text-neutrals-800"
              scale={"highlightMobile"}
              weight={"accent"}
            >
              {titleCase(label ?? "")}
            </Text>
            {isLoading && <Spinner size={16} color="#5A5555" />}
          </div>

          <Text className="text-neutrals-700" scale={"contentMobile"}>
            {subLabel}
          </Text>
        </div>

        <Button
          onClick={buttonFunc}
          leftIcon={
            <AddSquare variant="Bulk" size={16} className="text-primary" />
          }
          variant="secondary"
          className="px-6 whitespace-nowrap"
          size="sm"
        >
          {buttonText}
        </Button>
      </div>

      <div>{children}</div>
    </div>
  );
}
