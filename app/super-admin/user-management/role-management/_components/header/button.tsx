"use client";
import { AddSquare } from "iconsax-reactjs";
import { ButtonLink } from "@/components/ui/custom-button";

export default function HeaderButton() {
  return (
    <div className="flex gap-6 items-center">
      <ButtonLink
        variant="secondary"
        href={"?clone-role=true"}
        leftIcon={
          <AddSquare size={20} variant="Bulk" className="text-primary" />
        }
      >
        Clone role
      </ButtonLink>{" "}
      <ButtonLink
        href={"?add-role=true"}
        leftIcon={
          <AddSquare size={20} variant="Bulk" className="text-base-white" />
        }
      >
        Create role
      </ButtonLink>
    </div>
  );
}
