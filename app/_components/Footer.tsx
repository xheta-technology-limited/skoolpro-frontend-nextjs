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
    <div className="bg-primary px-4 pb-13 pt-8 sm:px-8 sm:pb-16 sm:pt-9 md:px-16 md:pb-20 md:pt-10 lg:px-20 lg:pb-24 lg:pt-12 xl:px-25 xl:pb-16 xl:pt-15">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Link href="/">
          <AdmiralYellow11 width={200} height={67} />
        </Link>
        <div className="flex items-center gap-6 lg:gap-[45px] text-white">
          <div className="flex h-8 w-8 md:h-12 md:w-12 lg:h-15 lg:w-15 items-center justify-center rounded-full border border-white">
            <Link href="/" className="text-white">
              <FaXTwitter />
            </Link>
          </div>
          <div className="flex h-8 w-8 md:h-12 md:w-12 lg:h-15 lg:w-15 items-center justify-center rounded-full border border-white">
            <Link href="/" className="text-white">
              <FaFacebookF />
            </Link>
          </div>
          <div className="flex h-8 w-8 md:h-12 md:w-12 lg:h-15 lg:w-15 items-center justify-center rounded-full border border-white">
            <Link href="/" className="text-white">
              <FaLinkedinIn />
            </Link>
          </div>
          <div className="flex h-8 w-8 md:h-12 md:w-12 lg:h-15 lg:w-15 items-center justify-center rounded-full border border-white">
            <Link href="/" className="text-white">
              <FaInstagram />
            </Link>
          </div>
        </div>
      </div>

      <div className="my-8 md:my-10 lg:my-12 xl:my-15">
          <ul className="flex flex-col gap-8 pl-0 text-[18px] font-normal leading-[1.2] text-white sm:flex-row sm:gap-[54px] list-none">
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

      <hr className="border-t border-[#D5D5FF]" />

      <div className="mt-8 md:mt-13 lg:mt-16 xl:mt-[76.3px] flex flex-col justify-between text-white sm:flex-row">
        <span>© Skoolpro 2026. All rights reserved</span>
        <div className="mt-4 flex items-center gap-4 sm:mt-0">
          <Link href="/" className="text-white no-underline">
            Terms of use
          </Link>
          <div className="h-2.5 w-2.5 rounded-full bg-white" />
          <Link href="/" className="text-white no-underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;