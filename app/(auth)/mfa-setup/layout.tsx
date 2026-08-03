import { AdmiralBlue11 } from "@/components/icons/logos";
import Link from "next/link";
import Image from "next/image";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <div className="max-w-133.5">{children}</div>
      </div>
    </div>
  );
}
