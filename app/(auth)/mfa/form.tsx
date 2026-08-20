"use client";
import { Button } from "@/components/ui/custom-button";
import OTP from "@/components/ui/custom-otp-input";
import {
  useConfirmOtp,
  useVerifyMFA,
  useOtpSetup as useRequestOTP,
} from "@/features/auth/api/mfa";
import { useCallback, useState } from "react";
import { useAuth } from "../../../features/auth/auth-store";
import { toast } from "sonner";
import { Text } from "@/components/ui";
import { useResendCountdown } from "@/features/auth/hooks";
import { useUserStore } from "@/features/user/user.store";
import { formatCountdown } from "@/lib/utils/format-countdown";
import { useProgressRouter } from "@/features/page-loader";

export default function OTPForm() {
  const OtpMethods = useAuth((state) => state.data?.available_methods);
  const [hasSent, setSent] = useState(false);
  const challengeId = useAuth((state) => state.data?.challenge_id);
  const primaryMethod = OtpMethods && OtpMethods[0];
  const { mutate, isPending } = useVerifyMFA();
  const { mutate: requestMutate, isPending: requestPending } = useRequestOTP();
  const [otp, setOtp] = useState("");
  const { seconds, start: startCountdown } = useResendCountdown();
  const updateUserData = useUserStore((state) => state.updateData);
  const router = useProgressRouter();
  const confirmOtp = () => {
    primaryMethod &&
      challengeId &&
      mutate(
        { method: primaryMethod, code: otp, challenge_id: challengeId },
        {
          onSuccess: (data) => {
            updateUserData(data);
            router.push("/onboarding");
          },
        }
      );
  };

  const requestOtp = useCallback(() => {
    console.log("primare: ", primaryMethod);
    console.log("all meths: ", OtpMethods);
    primaryMethod &&
      requestMutate(
        { method: primaryMethod },
        {
          onSuccess: () => {
            startCountdown();
            setSent(true);
            toast.success("OTP sent!");
          },
        }
      );
  }, [primaryMethod, requestMutate, startCountdown]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        confirmOtp();
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
          loading={requestPending}
          onClick={requestOtp}
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

      <div className="flex gap-6 justify-between items-center">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="min-w-0 flex-1"
          onClick={() => router.push("/login")}
        >
          Cancel
        </Button>
        {hasSent ? (
          <Button
            disabled={otp.length < 6}
            type="submit"
            size="lg"
            className="min-w-0 flex-1"
            loading={isPending}
          >
            Login
          </Button>
        ) : (
          <Button
            disabled={seconds > 0}
            type="button"
            size="lg"
            className="min-w-0 flex-1"
            loading={requestPending}
            onClick={requestOtp}
          >
            Send OTP
          </Button>
        )}
      </div>
    </form>
  );
}
