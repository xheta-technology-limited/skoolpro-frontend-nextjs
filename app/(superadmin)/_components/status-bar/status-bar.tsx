"use client";
import { Input } from "@/components/ui/form";
import { Notification } from "iconsax-reactjs";
import { useState } from "react";

export default function StatusBar() {
  const [searchValue, setSearchValue] = useState("");
  return (
    <div className="flex py-4 items-center justify-between bg-white">
      <div>
        <Input search name="" value={searchValue} />
      </div>
      <div className="flex items-center ">
        <div className="pr-6 border-r border-r-grays-borders mr-6">
          <Notification size={32} variant="Bulk" />
        </div>
        <div className="gap-2 flex items-center mr-3">name and avatar here</div>
        <div className="bg-secondary-800 px-2 py-1 rounded-[8px] text-[0.875rem] text-white">
          role will go here
        </div>
      </div>
    </div>
  );
}
