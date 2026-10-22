"use client";

import { Button } from "@/components/ui/custom-button";
import { useProgressRouter } from "@/features/page-loader";
import { AddSquare } from "iconsax-reactjs";

export default function ActionButtons() {
  const router = useProgressRouter();

  const onSeed = () => router.push("?seed-scale=true");
  const onAdd = () => router.push("?add-comment=true");
  return (
    <div className="flex gap-4">
      <Button onClick={onSeed} variant="secondary">
        Seed grade scale
      </Button>
      <Button
        onClick={onAdd}
        leftIcon={
          <AddSquare variant="Bulk" size={20} className="text-base-white" />
        }
      >
        Add Comment
      </Button>
    </div>
  );
}
