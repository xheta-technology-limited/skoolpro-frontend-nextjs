"use client";
import { AddSquare } from "iconsax-reactjs";
import { ButtonLink } from "@/components/ui/custom-button";

export default function HeaderButton() {
  return (
    <ButtonLink
      href={"/super-admin/user-management/role-management?add-role=true"}
      leftIcon={
        <AddSquare size={20} variant="Bulk" className="text-base-white" />
      }
    >
      Create role
    </ButtonLink>
  );
}
