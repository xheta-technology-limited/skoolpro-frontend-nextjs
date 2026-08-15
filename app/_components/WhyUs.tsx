import { Text } from "@/components/ui";
import Image from "next/image";

interface WhyUsItem {
  id: number;
  img: string;
  color: string;
  heading: string;
  body: string;
}

const data: WhyUsItem[] = [
  {
    id: 1,
    img: "/images/laptop.png",
    color: "#8180FF",
    heading: "Seamless Administrative Process",
    body: "Eliminate manual errors and save time by automating administrative tasks with Skoolpro. Our platform streamlines enrolment, fee payments, and results collation for a smoother school experience.",
  },
  {
    id: 3,
    img: "/images/calendar.png",
    color: "#15B097",
    heading: "Attendance and Result Tracking",
    body: "Track student attendance and academic performance effortlessly to ensure improved student outcomes.",
  },
  {
    id: 2,
    img: "/images/note.png",
    color: "#FFD369",
    heading: "AI Integration",
    body: "Reduce workload, improve accuracy, and optimize processes, to ensure  higher productivity by taking advantage of  the power of artificial intelligence for smart automation with Skoolpro",
  },
  {
    id: 4,
    img: "/images/dollar.png",
    color: "#8180FF",
    heading: "School Fees Payment",
    body: "Simplify the fee payment process with a secure, user-friendly system. Skoolpro ensures hassle-free transactions, boosting efficiency for both parents and school administrators.",
  },
  {
    id: 5,
    img: "/images/tie.png",
    color: "#FFD369",
    heading: "Manage your Payroll",
    body: "Keep your payroll in check with our automated solution. Manage staff salaries and payments with precision, ensuring timely payouts every time.",
  },
  {
    id: 6,
    img: "/images/searchLens.png",
    color: "#15B097",
    heading: "Income and Expense Tracking",
    body: "Take charge of your school's financial health with real-time income and expense tracking. Skoolpro provides detailed reports, making financial management transparent and easier to handle.",
  },
];

const WhyUS = () => {
  return (
    <div className="mx-auto w-full max-w-360">
      <section id="why-us" className="mx-4 sm:mx-8 md:mx-16 lg:mx-20 xl:mx-25">
        <div className="flex flex-col">
          <div className="mb-[16px] md:mb-6 w-fit rounded-[5px] bg-secondary px-2.5 pb-px pt-0.75">
            <Text as="h4" weight={"bold"} scale={"heading4"}>
              Why choose Skoolpro
            </Text>
          </div>
          <p className="mb-8 md:mb-0">
            Skoolpro is an all-in-one education management platform designed to
            simplify <br />
            school operations.
          </p>
        </div>

        <div className="mt-25 md:mt-12 mb-8 md:mb-19.25 grid grid-cols-1 gap-10 min-[768px]:grid-cols-2 min-[1400px]:grid-cols-3">
          {data.map((dat) => (
            <div
              key={dat.id}
              className="rounded-lg border p-6 sm:rounded-[32px] md:rounded-[40px] md:py-9 md:px-7 lg:rounded-[44px] lg:py-8.75 lg:px-7.5 xl:rounded-[48px] xl:py-10 xl:px-8.75"
              style={{ borderColor: dat.color }}
            >
              <div className="flex items-center gap-5">
                <Image
                  src={dat.img}
                  alt="laptop-icon"
                  className="h-12 w-12 rounded-full sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 xl:h-25 xl:w-25"
                  width={100}
                  height={100}
                />

                <Text as="h4" weight={"accent"} className="w-full wrap-break-word text-[20px] xl:text-[24px]">
                  {dat.heading}
                </Text>
              </div>
              <hr className="my-4 border-t-2 border-primary-200" />
              <div>
                <Text as="p" weight={"standard"} scale={"highlight"}>
                  {dat.body}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-4 sm:mx-8 md:mx-16 lg:mx-20 xl:mx-25 my-8 sm:my-12 md:my-16 lg:my-24 xl:my-[34.83px]">
        <div className="relative grid grid-cols-1 gap-8 rounded-lg bg-primary p-7.5 min-h-139.25 sm:gap-12 sm:rounded-[32px] sm:min-h-122.5 sm:p-9 md:gap-20 md:rounded-[40px] md:min-h-107.5 md:p-11 lg:grid-cols-2 lg:gap-32 lg:rounded-[44px] lg:min-h-97.5 lg:p-13 xl:gap-68.75 xl:rounded-[48px] xl:min-h-86.75 xl:p-15">
          <div className="max-w-125 items-center">
            <Text as="h4" scale={"heading4"} weight={"bold"} className="text-white">
              Let&apos;s make things happen
            </Text>
            <p className="my-6 font-lora text-[16px] font-normal leading-[1.2] text-white lg:font-(family-name:--font-poppins) lg:text-[18px]">
              Contact us today to learn more about how our digital management
              tool can help your business grow and succeed online.
            </p>
            <button className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-6 py-2 font-lora text-[16px] font-normal leading-[1.2] text-center text-primary-1000 md:py-3 lg:font-(family-name:--font-poppins) lg:text-[24px] lg:leading-none">
              Get started for free
              <Image
                src="/images/cta-pointer.png"
                alt="arrow"
                className="h-10 w-auto max-w-full"
                width={48}
                height={48}
              />
            </button>
          </div>
          <Image
            src={"/images/cycle.png"}
            alt="wheel image"
            width={500}
            height={415}
            className="relative mx-auto mt-8 h-auto w-86 sm:w-95 md:w-105 lg:w-115 lg:absolute lg:right-[3%] lg:top-1/2 lg:mx-0 lg:mt-0 lg:-translate-y-1/2 xl:w-125"
          />
        </div>
      </section>
    </div>
  );
};

export default WhyUS;