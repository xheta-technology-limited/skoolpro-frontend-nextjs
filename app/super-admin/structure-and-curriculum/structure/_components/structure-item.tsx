"use client";
import { Spinner } from "@/components/animations";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { titleCase } from "@/lib/helpers";
import { AddSquare } from "iconsax-reactjs";
import { ReactNode } from "react";

interface Props {
  label: string;
  primaryButtonText: string;
  primaryButtonFunc: () => void;
  secondaryButtonText: string;
  secondaryButtonFunc: () => void;

  isLoading: boolean;
  children: ReactNode;
}

export default function StructureItem({
  label,
  secondaryButtonText,
  secondaryButtonFunc,
  primaryButtonText,
  primaryButtonFunc,
  children,
  isLoading,
}: Props) {
  return (
    <div>
      <div className="w-full mb-8 flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-col gap-1 text-left max-w-146.5">
          <div className="flex gap-2 items-center">
            <Text className="text-neutrals-700" scale={"content"}>
              {titleCase(label ?? "")}
            </Text>
            {isLoading && <Spinner size={16} color="#5A5555" />}
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <Button
            onClick={primaryButtonFunc}
            leftIcon={
              <AddSquare variant="Bulk" size={16} className="text-primary" />
            }
            variant="secondary"
            className="px-6 whitespace-nowrap"
            size="sm"
          >
            {primaryButtonText}
          </Button>

          {secondaryButtonText && (
            <Button
              onClick={secondaryButtonFunc}
              leftIcon={
                <AddSquare variant="Bulk" size={16} className="text-primary" />
              }
              variant="secondary"
              className="px-6 whitespace-nowrap"
              size="sm"
            >
              {secondaryButtonText}
            </Button>
          )}
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}
