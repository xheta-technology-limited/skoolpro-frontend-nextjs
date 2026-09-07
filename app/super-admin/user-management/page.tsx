import { Text } from "@/components/ui";
import { USERS } from "./constants";
import ManagementCard from "./_components/card";
export default function UserManagement() {
  return (
    <>
      <Text weight={"accent"} scale={"feature"} className="text-neutrals-900">
        User management
      </Text>

      <div className="h-17.25" />

      <div className="flex gap-6 flex-wrap">
        {USERS.map((group) => (
          <ManagementCard
            key={group.role}
            className="md:min-w-50 lg:min-w-81 flex-1"
            group={group}
          />
        ))}
      </div>
    </>
  );
}
