"use client";
import OTP from "@/components/ui/custom-otp-input";
import { Button } from "@/components/ui/custom-button";
import { useState } from "react";
import { SuccessModal } from "@/components/common";
import { useConfirmMfaCode } from "@/features/auth/api/mfa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Form() {
  const [success, setSuccess] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const { mutate, isPending } = useConfirmMfaCode();

  const onSubmit = () => {
    mutate({ code: otp }, { onSuccess: () => setSuccess(true) });
  };

  return (
    <>
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
          onClick={() => toast("TODO: navigate to dashboard")}
        >
          Cancel
        </Button>
        <Button
          disabled={otp.length < 6}
          type="submit"
          size="lg"
          className="min-w-0 flex-1"
          loading={isPending}
          onClick={onSubmit}
        >
          Enable
        </Button>
      </div>

      <SuccessModal
        isOpen={success}
        onClose={() => setSuccess(false)}
        subheading="Multi factor authentication has been enabled. This will be required in your subsequent login."
      >
        <Button size="lg" onClick={() => router.replace("/onboarding")}>
          Proceed to dashboard
        </Button>
      </SuccessModal>
    </>
  );
}
