"use client";
import { Text } from "@/components/ui";
import { useAuth } from "../../../../features/auth/auth-store";
import { MFAMethod } from "@/features/auth/types/types";

export default function InfoText() {
  const methods = useAuth((state) => state.data?.available_methods);

  let methodText: string = "sms";

  if (methods?.[0]?.includes("email")) {
    methodText = "email";
  } else if (methods?.[0]?.includes("app")) {
    methodText = "authenticator app";
  }
  return (
    <Text scale={"content"} className="font-normal text-neutral-900">
      {`Enter the OTP sent to your ${methodText}`}
    </Text>
  );
}
