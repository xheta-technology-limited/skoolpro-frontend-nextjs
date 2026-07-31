"use client";
import { AdmiralBlue11 } from "@/components/icons/logos";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import OTP from "@/components/ui/custom-otp-input";
import { useForm } from "react-hook-form";
import { SuccessModal } from "@/components/common";
import { useConfirmOtp, useOtpSetup } from "@/features/auth/api/mfa";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function MFALogin() {
  return (
    <div className="py-12 px-6 h-full sm:px-14 md:px-29.25 flex flex-col items-center w-full">
      <Link href={"/"} className="mb-20.75">
        <AdmiralBlue11 height={51} width={199} />
      </Link>

      <div className="flex h-full flex-wrap xl:flex-nowrap gap-16.5 items-center justify-center w-full">
        <Image
          src={"/images/login_card.png"}
          height={660}
          width={640}
          alt="welcome"
          className="hidden w-64 h-auto md:w-160 sm:block"
        />
        <div className="max-w-133.5">
          <section>
            <div className="flex flex-col gap-6 mb-12">
              <div className="text-left">
                <Text
                  scale={"feature"}
                  weight={"bold"}
                  className="text-neutrals-1000 mb-2"
                >
                  MFA Login
                </Text>
                <Text
                  scale={"content"}
                  className="font-normal text-neutral-900"
                >
                  {`Enter the OTP sent to your ${"TODO: add first method here"}`}
                </Text>
              </div>
            </div>

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
                  Login
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
