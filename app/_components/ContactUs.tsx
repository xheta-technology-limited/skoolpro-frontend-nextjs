"use client";

import { useState } from "react";
import {
  IconBrandFacebook,
  IconBrandX,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import { InstagramLogoIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { FaLinkedinIn } from "react-icons/fa";
import { Text } from "@/components/ui";
import { CountryCodeDropdown } from "./Dropdown";

const ContactUs = () => {
  const [countryCode, setCountryCode] = useState("NG");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="mx-auto w-full max-w-360">
      <section
        id="contact-us"
        className="mx-4 sm:mx-8 md:mx-16 lg:mx-20 xl:mx-25 mt-8 md:mt-15 lg:mt-25 xl:lg:mt-33.75 mb-29.25 lg:mb-31.75"
      >
        <div className="flex flex-col">
          <div className="flex w-fit items-center justify-center rounded-[5px] bg-secondary px-2.5">
            <Text as="h4" weight={"bold"} scale={"heading4"}>
              Contact Us
            </Text>
          </div>
          <p className="mt-6 w-full md:w-[55%]">
            Get in touch with Skoolpro: Let&apos;s discuss your school <br />{" "}
            management needs...
          </p>
        </div>

        <div className="mt-8 md:mt-10 lg:mt-12 flex w-full flex-col md:flex-row">
          {/* left / blue panel */}
          <div className="w-full rounded-tl-lg rounded-tr-lg bg-primary p-4 py-8 md:rounded-tr-none md:rounded-tl-[48px] md:rounded-bl-[48px] md:p-12">
            <Text as="h3" weight={"accent"} scale={"feature"} className="text-white">
              Get in touch
            </Text>
            <p className="mb-8 mt-4 font-[Poppins] text-[14px] text-[#f3f3f3]">
              We&apos;d love to hear from you. Our friendly team is always here <br />
              to chat.
            </p>

            <div className="flex flex-col justify-between gap-8 sm:gap-25 md:gap-30 lg:gap-50 xl:gap-55.5">
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
                    <Link href="mailto:support@skoolpro.com" className="text-[14px] text-white no-underline">
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
                    <Link href="tel:+2349065439876" className="text-[14px] text-white no-underline">
                      <Text as="span" weight={"accent"} scale={"content"} className="text-white">
                        +234 906 543 9876
                      </Text>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex text-white">
                <div className="flex h-15 w-15 items-center justify-center">
                  <IconBrandX size={24} />
                </div>
                <div className="flex h-15 w-15 items-center justify-center">
                  <IconBrandFacebook size={24} />
                </div>
                <div className="flex h-15 w-15 items-center justify-center">
                  <FaLinkedinIn size={24} />
                </div>
                <div className="flex h-15 w-15 items-center justify-center">
                  <InstagramLogoIcon size={24} weight="fill" />
                </div>
              </div>
            </div>
          </div>

          {/* right / white panel */}
          <div className="flex w-full items-center rounded-bl-lg rounded-br-lg bg-[#F3F3F3] px-4 py-8 md:rounded-bl-none md:rounded-tr-[48px] md:rounded-br-[48px] md:px-12 md:py-24">
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
                    type="email"
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
                    <CountryCodeDropdown value={countryCode} onChange={setCountryCode} />

                    {/* divider */}
                    <div className="h-6 w-0 shrink-0 bg-[#D0D5DD]" />

                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="908 345 6758"
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
                    className="h-32.75 w-full resize-none rounded-[8px] border border-[#D0D5DD] bg-white px-3.5 py-2.5 shadow-[0px_1px_2px_0px_#1018280D] outline-none"
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
    </div>
  );
};

export default ContactUs;