"use client";

import { useState } from "react";
import NotGenerated from "./components/not-generated";
import Generated from "./components/generated";
import { useParams } from "next/navigation";
import { useGetStaff } from "@/features/user-management/staff-management/api/get-staff";
import { useCreateStaffLogin } from "@/features/user-management/staff-management/api/create-staff-login";

export default function LoginAccess() {
  const [isGenerated, setGenerated] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const params = useParams<{ staffId: string }>();
  const userID = params.staffId;

  const {
    data: profileData,
    isPending,
    error,
    isRefetching,
    refetch,
  } = useGetStaff(userID);

  const { mutate, isPending: isMutatePending } = useCreateStaffLogin(userID);

  return (
    <>
      {!isGenerated ? (
        <NotGenerated
          setGenerated={setGenerated}
          setPassword={setPassword}
          mutate={mutate}
        />
      ) : (
        <Generated password={password} />
      )}
    </>
  );
}
