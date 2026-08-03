"use client";
import { Button } from "@/components/ui/custom-button";
import OTP from "@/components/ui/custom-otp-input";
import { Text } from "@/components/ui";
import { formatCountdown } from "@/lib/utils/format-countdown";
import { useResendCountdown } from "@/features/auth/hooks";
import { useEffect, useState } from "react";
import { useForgotPassword } from "@/features/auth/api/forgot-password";
import { useResetPasswordStore } from "@/features/auth/auth-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function OTPCode() {
  const [otp, setOtp] = useState("");
  const { seconds, start: startCountdown } = useResendCountdown();
  const storeEmail = useResetPasswordStore((state) => state.data.login);
  const updateStoreField = useResetPasswordStore((state) => state.updateField);
  const { mutate: resendMutate, isPending: resendPending } =
    useForgotPassword();

  const router = useRouter();

  const resendCode = () => {
    if (!storeEmail) {
      throw new Error("No valid email to request OTP");
    }
    resendMutate(
      { login: storeEmail },
      {
        onSuccess: () => {
          startCountdown();
          toast.message("OTP sent!");
        },
      }
    );
  };

  useEffect(() => {
    startCountdown();
  }, []);

  return (
    <div className="flex flex-col">
      <Text scale={"content"} className="font-normal text-neutral-900 mb-12">
        Enter the OTP sent to your email
      </Text>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateStoreField("code", otp);
          router.push("/update-password");
        }}
      >
        <OTP
          value={otp}
          onChange={(e) => setOtp(e)}
          name="otp"
          length={6}
          className="mb-6 justify-self-center"
        />
        <div className="flex items-center justify-between mb-6">
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            disabled={seconds > 0}
            loading={resendPending}
            onClick={resendCode}
          >
            Resend
          </Button>
          {seconds > 0 && (
            <Text
              scale={"content"}
              className="font-normal text-neutral-900 tabular-nums"
            >
              Resend code in {formatCountdown(seconds)}
            </Text>
          )}
        </div>
        <Button
          disabled={otp.length < 6}
          type="submit"
          size="lg"
          className="min-w-0 flex-1"
        >
          Verify
        </Button>
      </form>
    </div>
  );
}
