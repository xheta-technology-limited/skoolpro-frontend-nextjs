"use client";

import {
  IconBrandFacebook,
  IconBrandX,
  IconBrandLinkedinFilled,
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
    <section className="container mx-auto my-16">
      <div className="mb-6 w-fit rounded-[5px] bg-[#FFDF93] px-2.5 pb-px pt-0.75">
        <Text as="h4" weight={"bold"} scale={"heading4"}>
          Contact Us
        </Text>
      </div>
      <span>
        Get in touch with Skoolpro: Let’s discuss your school management <br />{" "}
        needs...
      </span>

      <div className="mt-4 flex w-full flex-col sm:flex-row">
        <div className="w-full rounded-tl-[3rem] rounded-bl-[3rem] bg-primary p-8 max-[480px]:rounded-tr-[3rem] max-[480px]:rounded-bl-none">
          <Text
            as="h3"
            weight={"accent"}
            scale={"feature"}
            className="text-white"
          >
            Get in touch
          </Text>
          <p className="mb-8 mt-4 font-[Poppins] text-[14px] text-[#f3f3f3]">
            We’love to hear from you. Our friendly team is always here <br />
            to chat.
          </p>

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-3 text-white">
                <span>
                  <IconMail stroke={1} />
                </span>
                <div className="flex flex-col gap-3">
                  <Text
                    as="span"
                    scale={"highlight"}
                    weight={"bold"}
                    className="text-white"
                  >
                    Chat to us
                  </Text>
                  <span className="text-[14px] text-[#E9D7FE]">
                    Our friendly team is here to help.
                  </span>
                  <Link
                    href="/"
                    className="text-[14px] text-white no-underline"
                  >
                    <Text
                      as="span"
                      weight={"accent"}
                      scale={"content"}
                      className="text-white"
                    >
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
                  <Text
                    as="span"
                    scale={"highlight"}
                    weight={"bold"}
                    className="text-white"
                  >
                    Phone
                  </Text>
                  <span className="text-[14px] text-[#E9D7FE]">
                    Mon-Fri from 8am to 5pm.
                  </span>
                  <Link
                    href="/"
                    className="text-[14px] text-white no-underline"
                  >
                    <Text
                      as="span"
                      weight={"accent"}
                      scale={"content"}
                      className="text-white"
                    >
                      +234 906 543 9876
                    </Text>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-10 text-white">
              <IconBrandX size={24} /> <IconBrandFacebook size={24} />{" "}
              <FaLinkedinIn size={24} />
              <InstagramLogoIcon size={24} weight="fill" />
            </div>
          </div>
        </div>

        <div className="flex w-full items-center rounded-tr-[3rem] rounded-br-[3rem] bg-[#F3F3F3] p-12 max-[480px]:rounded-tr-none max-[480px]:rounded-bl-[3rem]">
          <form onSubmit={onSubmit} className="w-full">
            <div className="flex w-full flex-col gap-3">
              <div className="flex w-full flex-col gap-1">
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
                  className="w-full rounded-[5px] border-none px-2.5 py-2 shadow-[3px_3px_3px_3px_#ddd]"
                />
              </div>

              <div className="flex w-full flex-col gap-1">
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
                  className="w-full rounded-[5px] border-none px-2.5 py-2 shadow-[3px_3px_3px_3px_#ddd]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="phone">
                  <Text as="span" weight={"accent"} scale={"caption"}>
                    Phone number
                  </Text>
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="09012345678"
                  className="w-full rounded-[5px] border-none px-2.5 py-2 shadow-[3px_3px_3px_3px_#ddd]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="message">
                  <Text as="span" weight={"accent"} scale={"caption"}>
                    How can we help
                  </Text>
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us a little about the project"
                  className="h-20 w-full rounded-[5px] border-none px-2.5 py-2 shadow-[3px_3px_3px_3px_#ddd]"
                />
              </div>

              <button
                type="submit"
                className="mt-4 bg-primary rounded-ml py-2 text-[14px] text-white"
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
