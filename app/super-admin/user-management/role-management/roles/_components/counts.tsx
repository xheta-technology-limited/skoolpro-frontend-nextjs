"use client";
import { Text } from "@/components/ui";
import { useGetRoleStats } from "@/features/role-management/api/get-stats";
import { useEffect } from "react";

export default function Counts() {
  const { data, isPending } = useGetRoleStats({ refetchOnWindowFocus: false });

  if (!data || isPending) {
    return null;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
      <Item label={"Roles"} value={data?.total_roles} />
      <Item label={"System protected"} value={data?.system_roles} />
      <Item label={"Custom"} value={data?.custom_roles} />
      <Item label={"Permissions available"} value={data?.total_permissions} />
    </div>
  );
}

const Item = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="p-4 rounded-ml border-primary-100 border overflow-hidden">
      <Text scale={"caption"} className="text-neutrals-800">
        {label}
      </Text>
      <Text scale={"feature"} weight={"accent"} className="text-neutrals-800">
        {value}
      </Text>
    </div>
  );
};
