"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuthenticatorSetup } from "@/features/auth/api/mfa";
import { Text } from "@/components/ui";
import QRCode from "qrcode";

export function SetupCard() {
  const { data, mutate, isPending } = useAuthenticatorSetup();
  const [src, setSrc] = useState("");

  useEffect(() => {
    mutate(
      {},
      {
        onSuccess: (data) => {
          QRCode.toDataURL(data?.qr_code_url!!, (err, url) => {
            if (!err) {
              setSrc(url);
            } else {
              console.log("error here, gang: ", err);
            }
          });
        },
      }
    );
  }, []);

  return (
    <>
      <Image
        className="mx-auto"
        src={src ?? ""}
        width={179}
        height={179}
        alt="qr-code"
      />
      <Text>{`Scan the QR code below with your authenticator app or enter the text code (${
        isPending ? (
          <span className="italic">Loading...</span>
        ) : (
          data?.secret || "__"
        )
      }) on the authenticator app`}</Text>
    </>
  );
}
