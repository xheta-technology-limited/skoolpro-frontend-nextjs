"use client";
import { useState } from "react";
import { Text } from "@/components/ui";
import MfaButton from "./mfa-button";
import { Button } from "@/components/ui/custom-button";
import { useProgressRouter } from "@/features/page-loader";

const options = [
  {
    title: "Authenticator App",
    id: "app",
  },
  {
    title: "Email OTP",
    id: "email_otp",
  },
  {
    title: "SMS OTP",
    id: "sms_otp",
  },
];
export default function MfaForm() {
  const [active, setActive] = useState<string | null>(null);
  const router = useProgressRouter();

  const onProceed = () => {
    if (active && active !== "app") {
      router.push(`/mfa-setup/otp/${active}`);
    } else if (active && active === "app") {
      router.push("/mfa-setup/app");
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-6 mb-12">
        <div className="text-left">
          <Text
            scale={"feature"}
            weight={"bold"}
            className="text-neutrals-1000 mb-2"
          >
            Set up MFA
          </Text>
          <Text scale={"content"} className="font-normal text-neutral-900">
            Kindly select your preferred Multi Factor Authentication method
          </Text>
        </div>
        {options.map((op) => (
          <MfaButton
            onClick={() => setActive(op.id)}
            title={op.title}
            isActive={op.id === active}
            key={op.id}
          />
        ))}
      </div>

      <div className="flex gap-6 justify-between items-center">
        <Button variant="secondary" size="lg" className="min-w-0 flex-1">
          Cancel
        </Button>
        <Button size="lg" className="min-w-0 flex-1" onClick={onProceed}>
          Proceed
        </Button>
      </div>
    </section>
  );
}
