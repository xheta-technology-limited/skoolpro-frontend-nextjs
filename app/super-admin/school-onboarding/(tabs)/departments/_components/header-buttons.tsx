"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/custom-button";
import { useProgressRouter } from "@/features/page-loader";
import { AddSquare } from "iconsax-reactjs";

/**
 * Header actions for the departments tab. Each dialog param is set on top of
 * the current query string so existing `q`/`status` filters survive.
 */
export default function ActionButtons() {
  const router = useProgressRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function openDialog(param: "provision-defaults" | "add-department") {
    const params = new URLSearchParams(searchParams.toString());
    params.set(param, "true");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const onProvision = () => openDialog("provision-defaults");
  const onAdd = () => openDialog("add-department");
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
