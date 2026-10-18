"use client";
import { ArrowRight3, UserOctagon } from "iconsax-reactjs";
import { Text } from "@/components/ui";
import { useProgressRouter } from "@/features/page-loader";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/animations";
import { TableDocument } from "iconsax-reactjs";
import { Group } from "../constants";

interface Props {
  page: Group;
  className?: string;
}

export default function PageCard({ page, className }: Props) {
  const router = useProgressRouter();
  return (
    <button
      onClick={() => router.push(page.pageUrl)}
      className={cn("text-left flex flex-col gap-2", className)}
      aria-label={page.label}
    >
      <div className="bg-white rounded-ml p-4">
        <div className="flex items-center gap-4">
          <div className="h-11.25 w-11.25 bg-base-white rounded-[9px] p-2.5">
            <TableDocument variant="Bulk" size={24} className="text-primary" />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Text
            weight={"accent"}
            scale={"content"}
            className="text-neutrals-900"
          >
            {page.label}
          </Text>

          <ArrowRight3 variant="Bulk" size={24} className="text-primary" />
        </div>
      </div>
    </button>
  );
}
