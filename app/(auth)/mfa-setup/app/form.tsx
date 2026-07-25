"use client";
import OTP from "@/components/ui/custom-otp-input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/custom-button";
import { useState } from "react";
import { SuccessModal } from "@/components/common";

export default function Form() {
  const { register, handleSubmit } = useForm();
  const [success, setSuccess] = useState(false);
  const [otp, setOtp] = useState("");
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSuccess(true);
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
    </>
  );
}
