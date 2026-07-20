"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import navLogo from "@/assets/navLogo.png";
import { FaBars } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);

  const navLinksClass = toggle
    ? "absolute right-0 top-[75px] z-10 flex h-[calc(100vh-80px)] w-[250px] flex-col gap-4 bg-white pt-4 md:static md:h-auto md:w-auto md:flex-row md:items-center md:gap-6 md:bg-transparent md:pt-0"
    : "hidden mt-2 md:mt-0 md:flex md:items-center md:gap-6";

  return (
    <div className="container mx-auto py-3">
      <div className="relative flex items-center justify-between">
        <Image
          src={navLogo}
          alt="Navbar-logo"
          className="h-auto w-[150px] max-w-full md:w-auto"
        />

        <ul className={navLinksClass} style={{ fontWeight: 400 }}>
          <li>
            <Link
              href="/"
              className="list-none text-[var(--light-blue)] no-underline"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className="list-none text-[var(--light-blue)] no-underline"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className="list-none text-[var(--light-blue)] no-underline"
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className="list-none text-[var(--light-blue)] no-underline"
            >
              Contact us
            </Link>
          </li>
        </ul>

        <button
          className="rounded-[13px] px-4 py-2 font-normal text-white"
          style={{ backgroundColor: "var(--dark-blue)" }}
        >
          Book a Demo
        </button>

        {!toggle ? (
          <FaBars
            className="block cursor-pointer text-[var(--light-blue)] md:hidden"
            size={20}
            onClick={() => setToggle(!toggle)}
          />
        ) : (
          <FaTimes
            className="block cursor-pointer text-[var(--light-blue)] md:hidden"
            size={20}
            onClick={() => setToggle(!toggle)}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
