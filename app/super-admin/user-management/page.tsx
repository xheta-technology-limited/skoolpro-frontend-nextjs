"use client";
import { useMemo } from "react";
import { Text } from "@/components/ui";
import { USERS } from "./constants";
import ManagementCard from "./_components/card";
import { useGetPeopleCount } from "@/features/user-management/api/get-count";

export default function UserManagement() {
  const { data, isPending } = useGetPeopleCount({
    refetchOnWindowFocus: false,
  });

  const groups = useMemo(
    () =>
      USERS.map((group) => ({
        ...group,
        total:
          group.countKey && data
            ? data[group.countKey] ?? group.total
            : group.total,
      })),
    [data]
  );

  return (
    <>
      <Text weight="accent" scale="feature" className="text-neutrals-900">
        User management
      </Text>

      <div className="h-17.25" />

      <div className="flex gap-6 flex-wrap">
        {groups.map((group) => (
          <ManagementCard
            key={group.role}
            className="md:min-w-50 lg:min-w-81 flex-1"
            group={group}
            loading={isPending}
          />
        ))}
      </div>
    </>
  );
}
