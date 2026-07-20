"use client";
import Link from "next/link";
import { FaFacebookF, FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { AdmiralYellow11 } from "@/components/icons/logos";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  if (pathname !== "/") {
    return null;
  }
  return (
    <div className="py-16 bg-primary">
      <div className="container mx-auto max-w-[1625px] px-3.5">
        <div className="flex flex-col justify-between gap-4 px-2 sm:flex-row sm:items-center">
          <Link href="/">
            <AdmiralYellow11 width={200} height={67} />
          </Link>
          <div className="flex items-center gap-4 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white">
              <Link href="/" className="text-white">
                <FaXTwitter />
              </Link>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white">
              <Link href="/" className="text-white">
                <FaFacebookF />
              </Link>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white">
              <Link href="/" className="text-white">
                <FaLinkedinIn />
              </Link>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white">
              <Link href="/" className="text-white">
                <FaInstagram />
              </Link>
            </div>
          </div>
        </div>

        <div className="my-4">
          <ul className="flex list-none gap-3 pl-0 text-white">
            <li>
              <Link href="/" className="text-white no-underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/" className="text-white no-underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/" className="text-white no-underline">
                Services
              </Link>
            </li>
            <li>
              <Link href="/" className="text-white no-underline">
                Contact us
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-16 flex flex-col justify-between text-white sm:flex-row">
          <span>© Skoolpro 2026. All right reserved</span>
          <div className="mt-4 flex gap-3 sm:mt-0">
            <Link href="/" className="text-white no-underline">
              Terms of use
            </Link>
            <Link href="/" className="text-white no-underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
