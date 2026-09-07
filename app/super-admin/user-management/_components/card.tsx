"use client";
import { ArrowRight3, UserOctagon } from "iconsax-reactjs";
import { Text } from "@/components/ui";
import { Group } from "../constants";
import { useProgressRouter } from "@/features/page-loader";
import { cn } from "@/lib/utils";

interface Props {
  group: Group;
  className?: string;
}

export default function ManagementCard({ group, className }: Props) {
  const router = useProgressRouter();
  return (
    <button
      onClick={() => router.push(group.pageUrl)}
      className={cn("text-left", className)}
      aria-label={`${group.role} management`}
    >
      <div className="bg-white rounded-ml p-4">
        <div className="flex items-center gap-4">
          <div className="h-11.25 w-11.25 bg-base-white rounded-[9px] p-2.5">
            <UserOctagon variant="Bulk" size={24} className="text-primary" />
          </div>
          <Text
            className="text-neutrals-800 max-w-25"
            scale={"content"}
            weight={"standard"}
          >
            {`${group.role} management`}
          </Text>
        </div>

        <div className="flex justify-between items-center">
          <Text
            weight={"accent"}
            scale={"feature"}
            className="text-neutrals-900"
          >
            {group.total}
          </Text>
          <ArrowRight3 variant="Bulk" size={24} className="text-primary" />
        </div>
      </div>
    </button>
  );
}
