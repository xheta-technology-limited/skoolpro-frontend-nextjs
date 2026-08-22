"use client";
import { Text } from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/form";
import { useUserStore } from "@/features/user/user.store";
import { getNameInitials } from "@/lib/helpers/get-name-initials";
import { titleCase } from "@/lib/helpers/string-to-title-case";
import { Notification } from "iconsax-reactjs";
import { useState } from "react";

export default function StatusBar() {
  const [searchValue, setSearchValue] = useState("");
  const userData = useUserStore((s) => s.data);
  const userName = `${userData.first_name} ${userData.last_name}`;
  return (
    <div className="flex py-4 items-center justify-between bg-white">
      <div>
        <Input search name="" value={searchValue} />
      </div>
      <div className="flex items-center ">
        <div className="pr-6 border-r border-r-grays-borders mr-6">
          <Notification size={32} variant="Bulk" />
        </div>
        <div className="gap-2 flex items-center mr-3">
          <Avatar size="sm">
            <AvatarImage src={userData.profile_image || ""} />
            <AvatarFallback>{getNameInitials(userName)}</AvatarFallback>
          </Avatar>

          <Text scale={"content"} weight={"standard"}>
            {userName}
          </Text>
        </div>
        <div className="bg-secondary-800 px-2 py-1 rounded-[8px] text-[0.875rem] text-white">
          {titleCase(userData.active_role || "")}
        </div>
      </div>
    </div>
  );
}
