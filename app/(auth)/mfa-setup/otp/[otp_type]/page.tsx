"use client";
import { useState } from "react";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import Image from "next/image";
import OTP from "@/components/ui/custom-otp-input";
import { useForm } from "react-hook-form";
import { SuccessModal } from "@/components/common";

export default async function Email({
  params,
}: {
  params: Promise<{ otp_type: "email" | "sms" }>;
}) {
  const { otp_type } = await params;
  const { register, handleSubmit } = useForm();
  const [success, setSuccess] = useState(false);
  const [otp, setOtp] = useState("");
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
            Enter the OTP sent to your email or phone number
          </Text>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);

          console.log(formData.get("otp"));
        }}
      >
        <OTP
          value={otp}
          onChange={(e) => setOtp(e)}
          name="otp"
          length={6}
          className="mb-6 justify-self-center"
        />

        <div className="flex gap-6 justify-between items-center">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="min-w-0 flex-1"
          >
            Cancel
          </Button>
          <Button
            disabled={otp.length < 6}
            type="submit"
            size="lg"
            className="min-w-0 flex-1"
          >
            Enable
          </Button>
        </div>
      </form>

      <SuccessModal
        isOpen={success}
        onClose={() => setSuccess(false)}
        subheading="Multi factor authentication has been enabled. This will be required in your subsequent login."
      >
        <Button size="lg">Proceed to dashboard</Button>
      </SuccessModal>
    </section>
  );
}
