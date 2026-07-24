"use client";
import { useState } from "react";
import { Text } from "@/components/ui";
import MfaButton from "./mfa-button";
import { Button } from "@/components/ui/custom-button";

const options = [
  {
    title: "Authenticator App",
    id: "app",
  },
  {
    title: "Email OTP",
    id: "email",
  },
  {
    title: "SMS OTP",
    id: "sms",
  },
];
export default function MfaForm() {
  const [active, setActive] = useState<null | string>(null);
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
        <Button size="lg" className="min-w-0 flex-1">
          Proceed
        </Button>
      </div>
    </section>
  );
}
