"use client";

import { Button } from "@/components/ui/custom-button";
import { useProgressRouter } from "@/features/page-loader";
import { AddSquare } from "iconsax-reactjs";

export default function ActionButtons() {
  const router = useProgressRouter();

  const onProvision = () => router.push("?provision-defaults=true");
  const onAdd = () => router.push("?add-department=true");
  return (
    <div className="flex gap-4">
      <Button onClick={onProvision} variant="secondary">
        Provision defaults
      </Button>
      <Button
        onClick={onAdd}
        leftIcon={
          <AddSquare variant="Bulk" size={20} className="text-base-white" />
        }
      >
        Add Department
      </Button>
    </div>
  );
}
