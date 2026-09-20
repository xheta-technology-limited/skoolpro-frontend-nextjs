"use client";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { CompactCheckbox, Input } from "@/components/ui/form";
import FormModal from "@/components/ui/form-modal";
import { Dispatch, SetStateAction, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AddSquare } from "iconsax-reactjs";
import Item from "../../teaching-profile/_components/item";
import {
  StaffLoginResponse,
  CreateStaffLoginData,
} from "@/features/user-management/staff-management/api/create-staff-login";
import { ServerErrorResponse } from "@/types/api";
import { UseMutateFunction } from "@tanstack/react-query";
import { Staff } from "@/features/user-management/staff-management/types/api/staff";
import { LinkedUser } from "@/features/user-management/staff-management";

const dummyRoles = [
  { id: "1", name: "Teacher" },
  { id: "2", name: "Principal" },
  { id: "3", name: "Janitor" },
  { id: "4", name: "Chief Security Officer" },
];

interface Props {
  setPassword: Dispatch<SetStateAction<string | undefined>>;
  profileData: LinkedUser;
  mutate: UseMutateFunction<
    StaffLoginResponse,
    ServerErrorResponse,
    CreateStaffLoginData,
    unknown
  >;
  isMutatePending: boolean;
  isPending: boolean;
  setSelectedRoles: Dispatch<SetStateAction<string[] | undefined>>;
  selectedRoles: string[];
}
export default function NotGenerated({
  setPassword,
  mutate,
  isMutatePending,
  profileData,
  isPending,
  selectedRoles,
  setSelectedRoles,
}: Props) {
  const [email, setEmail] = useState<string | undefined>(
    profileData?.email || undefined
  );
  // const [selectedRoles, setSelectedRoles] = useState(dummyRoles);
  const [isOpen, setIsOpen] = useState(false);

  const methods = useForm<{ role_ids: string[] }>({
    defaultValues: selectedRoles
      ? { role_ids: selectedRoles.map((role) => role) }
      : {},
  });

  const onSubmit = (data: { role_ids: string[] }) => {
    setSelectedRoles(
      dummyRoles
        .filter((role) => data.role_ids.includes(role.id))
        .map((role) => role.name)
    );
    setIsOpen(false);
  };

  const onGenerate = () => {
    mutate(
      {
        email: email || undefined,
        roles: selectedRoles.map((role) => role),
      },
      {
        onSuccess: (data) => {
          setPassword(data.temporary_password);
        },
      }
    );
  };

  return (
    <>
      <Text className="text-neutrals-700 mb-7.5">LOGIN ACCESS</Text>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 lg:gap-8 p-2">
        <div className="flex flex-col gap-4">
          <Text className="text-neutrals-700">SIGN IN EMAIL</Text>
          {/* This should be loading if it's still fetching the email or something. Haven't thought this through yet */}
          <Input
            value={email}
            onChange={(e) =>
              setEmail((e as React.ChangeEvent<HTMLInputElement>).target.value)
            }
            isLoading={isPending}
            name="email"
          />
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
              onClick={() => setIsOpen(true)}
            >
              Add
            </Button>
          </div>
          <div className="rounded-ml bg-primary-bg gap-4 p-2 flex flex-col">
            {selectedRoles.map((role) => (
              <Item
                key={role}
                label={role}
                onButtonClick={() =>
                  setSelectedRoles(selectedRoles.filter((sub) => sub !== role))
                }
              />
            ))}
          </div>
        </div>
      </div>

      <FormModal open={isOpen} onOpenChange={setIsOpen} title="Add Role">
        <FormProvider {...methods}>
          <form
            id="add-role-form"
            className="flex flex-col gap-4"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-4 bg-primary-bg rounded-ml p-2 max-h-96 overflow-y-auto">
              {dummyRoles.map((role) => (
                <CompactCheckbox
                  key={role.id}
                  id={role.id}
                  name="role_ids"
                  label={role.name}
                  value={role.id}
                />
              ))}
            </div>
          </form>
        </FormProvider>

        <div className="flex gap-6 *:flex-1">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form="add-role-form">
            Add
          </Button>
        </div>
      </FormModal>

      <Button
        className="justify-self-end"
        onClick={onGenerate}
        loading={isMutatePending}
      >
        Create login and generate password
      </Button>
    </>
  );
}
