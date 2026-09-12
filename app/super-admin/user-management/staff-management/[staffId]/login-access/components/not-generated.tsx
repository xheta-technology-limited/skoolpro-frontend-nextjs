"use client";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/form";
import { AddSquare } from "iconsax-reactjs";
import Item from "../../teaching-profile/_components/item";
import { Dispatch, SetStateAction } from "react";

const dummyRoles = [
  { id: "1", name: "Teacher" },
  { id: "2", name: "Principal" },
  { id: "3", name: "Janitor" },
  { id: "4", name: "Chief Security Officer" },
];

interface Props {
  setGenerated: Dispatch<SetStateAction<boolean>>;
  setPassword: Dispatch<SetStateAction<string>>;
}
export default function NotGenerated({ setGenerated, setPassword }: Props) {
  const onGenerate = () => {
    alert("Run the api first");
    setPassword("clashRoyale420");
    setGenerated(true);
  };
  return (
    <>
      <Text className="text-neutrals-700 mb-7.5">LOGIN ACCESS</Text>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 lg:gap-8 p-2">
        <div className="flex flex-col gap-4">
          <Text className="text-neutrals-700">SIGN IN EMAIL</Text>
          {/* This should be loading if it's still fetching the email or something. Haven't thought this through yet */}
          <Input value={""} isLoading disabled name="placeholder_name" />
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between">
            <Text className="text-neutrals-700">ROLES</Text>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={
                <AddSquare variant="Bulk" size={16} className="text-primary" />
              }
            >
              Add
            </Button>
          </div>
          <div className="rounded-ml bg-primary-bg gap-4 p-2 flex flex-col">
            {dummyRoles.map((sub) => (
              <Item
                key={sub.id}
                label={sub.name}
                onButtonClick={() => alert("Delete subject")}
              />
            ))}
          </div>
        </div>
      </div>
      <Button className="justify-self-end" onClick={onGenerate}>
        Create login and generate password
      </Button>
    </>
  );
}
