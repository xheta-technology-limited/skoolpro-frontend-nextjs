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
    <>
      <section className="container mx-auto">
        <div className="mb-6 w-fit rounded-[5px] bg-[#FFDF93] px-[10px] pb-[1px] pt-[3px]">
          <Text as="h4" weight={"bold"} scale={"heading4"}>
            Why choose Skoolpro
          </Text>
        </div>
        <p>
          Skoolpro is an all-in-one education management platform designed to
          simplify <br />
          school operations.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-8 min-[481px]:grid-cols-2 min-[787px]:grid-cols-3">
          {data.map((dat) => (
            <div
              key={dat.id}
              className="rounded-[2.3rem] border border-t-0 p-8"
              style={{ borderColor: dat.color }}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={dat.img}
                  alt="laptop-icon"
                  className="h-auto max-w-full"
                  width={100}
                  height={100}
                />
                <Text
                  as="h4"
                  weight={"accent"}
                  scale={"feature"}
                  className="w-44"
                >
                  {dat.heading}
                </Text>
              </div>
              <hr className="my-4 border-t-2 border-[#ABAAFF]" />
              <div>
                <Text as="p" weight={"standard"} scale={"highlight"}>
                  {dat.body}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto mt-24">
        <div className="relative mt-5 grid grid-cols-1 bg-primary justify-between rounded-4xl p-8 min-[787px]:grid-cols-2">
          <div className="max-w-125">
            <Text
              as="h4"
              scale={"heading4"}
              weight={"bold"}
              className="text-white"
            >
              Let's make things happen
            </Text>
            <p className="my-4 text-white">
              Contact us today to learn more about how our digital management
              tool can help your business grow and succeed online.
            </p>
            <button
              className="rounded-2xl px-3 py-2 font-normal text-[var(--light-blue)]"
              style={{ backgroundColor: "#FFDF93" }}
            >
              Get started for free{" "}
              <Image
                src="/images/cta-pointer.png"
                alt="arrow"
                className="inline-block h-10 w-auto max-w-full"
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
            className="absolute right-[3%] top-[-25%] hidden max-w-full min-[787px]:block"
          />
        </div>
      </section>
    </>
  );
};

export default WhyUS;
