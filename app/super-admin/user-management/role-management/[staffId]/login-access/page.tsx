"use client";

import { useState } from "react";
import NotGenerated from "./components/not-generated";
import Generated from "./components/generated";
import { useParams } from "next/navigation";
import { useGetStaff } from "@/features/user-management/staff-management/api/get-staff";
import { useCreateStaffLogin } from "@/features/user-management/staff-management/api/create-staff-login";
import { useGetLinkedUser } from "@/features/user-management/staff-management/api/get-linked-user";
import Spinner from "@/components/animations/spinner/spinner";
import { Button } from "@/components/ui/custom-button";
import { NoData } from "@/components/icons";

export default function LoginAccess() {
  const [password, setPassword] = useState<string | undefined>(undefined);
  const params = useParams<{ staffId: string }>();

  const userID = params.staffId;
  const {
    data: profileData,
    isPending,
    error,
    isRefetching,
    refetch,
  } = useGetLinkedUser(userID);

  const [draftRoles, setDraftRoles] = useState<string[] | undefined>();

  const selectedRoles = draftRoles ?? profileData?.roles;

  const { mutate, isPending: isMutatePending } = useCreateStaffLogin(userID);

  if (isPending) {
    return (
      <div className="w-full flex items-center justify-center py-7">
        <Spinner size={70} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-fit mx-auto">
        <NoData
          variant="signal"
          title="Something went Wrong"
          subTitle={error.message || ""}
          className="w-97.5 h-143.75"
        />
        <Button
          className="mt-3 w-full"
          loading={isRefetching}
          onClick={() => refetch()}
          size="lg"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      {profileData ? (
        <Generated
          data={profileData}
          password={password}
          setPassword={setPassword}
        />
      ) : (
        <NotGenerated
          setPassword={setPassword}
          mutate={mutate}
          isPending={isPending}
          profileData={profileData}
          isMutatePending={isMutatePending}
          selectedRoles={selectedRoles || []}
          setDraftRoles={setDraftRoles}
        />
      )}
    </>
  );
}
