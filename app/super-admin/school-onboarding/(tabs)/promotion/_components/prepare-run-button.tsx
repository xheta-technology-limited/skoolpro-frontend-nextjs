"use client";
import { Button } from "@/components/ui/custom-button";
import { AddSquare } from "iconsax-reactjs";

export default function PrepareRunButton() {
  return (
    <Button
      onClick={() => alert("Not implemented")}
      leftIcon={<AddSquare variant="Bulk" size={16} className="text-primary" />}
      variant="secondary"
      className="px-6"
      size="sm"
    >
      Prepare a Run
    </Button>
  );
}
