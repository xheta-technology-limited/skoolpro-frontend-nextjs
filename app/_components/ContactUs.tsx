"use client";

import {
  IconBrandFacebook,
  IconBrandX,
  IconChevronDown,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import { InstagramLogoIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { FaLinkedinIn } from "react-icons/fa";
import { Text } from "@/components/ui";

const ContactUs = () => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <section className="mx-4 sm:mx-8 md:mx-16 lg:mx-20 xl:mx-25 mt-8 md:mt-15 lg:mt-25 xl:lg:mt-[135px] mb-[117px] lg:mb-[127px]">
      <div className="flex flex-col">
        <div className="flex w-fit items-center justify-center rounded-[5px] bg-[#FFDF93] px-2.5">
          <Text as="h4" weight={"bold"} scale={"heading4"}>
            Contact Us
          </Text>
        </div>
        <p className="mt-6 w-full md:w-[55%]">
          Get in touch with Skoolpro: Let’s discuss your school <br />{" "}management needs...
        </p>
      </div>

      <div className="mt-8 md:mt-10 lg:mt-12 flex w-full flex-col sm:flex-row">
  {/* left / blue panel */}
  <div className="w-full rounded-tl-[24px] rounded-tr-[24px] bg-primary p-4 py-8 sm:rounded-tr-none sm:rounded-tl-[48px] sm:rounded-bl-[48px] sm:p-12">
    <Text as="h3" weight={"accent"} scale={"feature"} className="text-white">
      Get in touch
    </Text>
    <p className="mb-8 mt-4 font-[Poppins] text-[14px] text-[#f3f3f3]">
      We'd love to hear from you. Our friendly team is always here <br />
      to chat.
    </p>

    <div className="flex flex-col justify-between gap-8 sm:gap-25 md:gap-30 lg:gap-50 xl:gap-[222px]">
      <div>
        <div className="flex items-start gap-3 text-white">
          <span>
            <IconMail stroke={1} />
          </span>
          <div className="flex flex-col gap-3">
            <Text as="span" scale={"highlight"} weight={"bold"} className="text-white">
              Chat to us
            </Text>
            <span className="text-[14px] text-[#E9D7FE]">
              Our friendly team is here to help.
            </span>
            <Link href="/" className="text-[14px] text-white no-underline">
              <Text as="span" weight={"accent"} scale={"content"} className="text-white">
                support@skoolpro.com
              </Text>
            </Link>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-3 text-white">
          <span>
            <IconPhone stroke={1} />
          </span>
          <div className="flex flex-col gap-3">
            <Text as="span" scale={"highlight"} weight={"bold"} className="text-white">
              Phone
            </Text>
            <span className="text-[14px] text-[#E9D7FE]">
              Mon-Fri from 8am to 5pm.
            </span>
            <Link href="/" className="text-[14px] text-white no-underline">
              <Text as="span" weight={"accent"} scale={"content"} className="text-white">
                +234 906 543 9876
              </Text>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex text-white">
  <div className="flex h-[60px] w-[60px] items-center justify-center">
    <IconBrandX size={24} />
  </div>
  <div className="flex h-[60px] w-[60px] items-center justify-center">
    <IconBrandFacebook size={24} />
  </div>
  <div className="flex h-[60px] w-[60px] items-center justify-center">
    <FaLinkedinIn size={24} />
  </div>
  <div className="flex h-[60px] w-[60px] items-center justify-center">
    <InstagramLogoIcon size={24} weight="fill" />
  </div>
</div>
    </div>
  </div>

  {/* right / white panel */}
  <div className="flex w-full items-center rounded-bl-[24px] rounded-br-[24px] bg-[#F3F3F3] px-4 py-8 sm:rounded-bl-none sm:rounded-tr-[48px] sm:rounded-br-[48px] sm:px-12 sm:py-24">
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full flex-col gap-2">
  <label htmlFor="name">
    <Text as="span" weight={"accent"} scale={"caption"}>
      Name
    </Text>
  </label>
  <input
    type="text"
    id="name"
    name="name"
    placeholder="Your name"
    className="w-full rounded-[8px] border border-[#D0D5DD] bg-white px-4 py-3 shadow-[0px_1px_2px_0px_#1018280D]"
  />
</div>

<div className="flex w-full flex-col gap-2">
  <label htmlFor="email">
    <Text as="span" weight={"accent"} scale={"caption"}>
      Email
    </Text>
  </label>
  <input
    type="text"
    id="email"
    name="email"
    placeholder="you@company.com"
    className="w-full rounded-[8px] border border-[#D0D5DD] bg-white px-4 py-3 shadow-[0px_1px_2px_0px_#1018280D]"
  />
</div>

        <div className="flex flex-col gap-2">
  <label htmlFor="phone">
    <Text as="span" weight={"accent"} scale={"caption"}>
      Phone number
    </Text>
  </label>
  <div className="flex h-12 w-full items-center rounded-[8px] border border-[#D0D5DD] bg-white shadow-[0px_1px_2px_0px_#1018280D]">
    {/* country dropdown */}
    <div className="relative flex h-12 w-[84px] shrink-0 items-center">
      <select
        aria-label="Country code"
        className="h-12 w-full appearance-none bg-transparent py-3 pr-3 pl-4 text-sm outline-none"
        defaultValue="NGN"
      >
        <option value="NGN">NGN</option>
        <option value="USD">USD</option>
        <option value="GBP">GBP</option>
      </select>
      <IconChevronDown
        size={16}
        className="pointer-events-none absolute right-3"
      />
    </div>

    {/* divider */}
    <div className="h-6 w-px shrink-0 bg-[#D0D5DD]" />

    <input
      type="tel"
      id="phone"
      name="phone"
      placeholder="+234 908 345 6758"
      className="h-12 w-full border-none px-4 py-3 text-sm outline-none"
    />
  </div>
</div>

        <div className="flex flex-col gap-2">
  <label htmlFor="message">
    <Text as="span" weight={"accent"} scale={"caption"}>
      How can we help
    </Text>
  </label>
  <textarea
    id="message"
    name="message"
    placeholder="Tell us a little about the project"
    className="h-[131px] w-full resize-none rounded-[8px] border border-[#D0D5DD] bg-white px-[14px] py-[10px] shadow-[0px_1px_2px_0px_#1018280D] outline-none"
  />
</div>

        <button
          type="submit"
          className="mt-4 rounded-ml bg-primary py-2 text-[14px] text-white"
        >
          Send message
        </button>
      </div>
    </form>
  </div>
</div>
    </section>
  );
};

export default ContactUs;
