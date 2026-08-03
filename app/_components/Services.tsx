import { SkoolproCircle } from "@/components/icons/logos";
import { Text } from "@/components/ui";

interface ServiceItem {
  heading: string;
  textColor: string;
  subHeading: string;
  body: string;
  bg: string;
  color: string;
}

const data: ServiceItem[] = [
  {
    heading: "School Management",
    textColor: "#1d1d1d",
    subHeading: "System",
    body: "Easily manage enrolment, fee payments, staff and curriculum, result collation, and certificate printing. Skoolpro digitises your school processes, making administration a breeze.",
    bg: "#D5D5FF",
    color: "#FFDF93",
  },
  {
    heading: "Parent",
    textColor: "#ffffff",
    subHeading: "Monitoring App",
    body: "Keep parents involved in their child’s academic progress. Our app enables parents to actively monitor grades, attendance, and other important updates.",
    bg: "#010081",
    color: "#FFFFFF",
  },
  {
    heading: "Loans",
    textColor: "#ffffff",
    subHeading: "For Schools",
    body: "Provide the best learning environment with Skool Pro short- and long-term loans to develop your institution and invest in high-quality equipment.",
    bg: "#333333",
    color: "#FFFFFF",
  },
  {
    heading: "E-Learning",
    textColor: "#1d1d1d",
    subHeading: "Platform",
    body: "Enable modern online learning with Skoolpro's e-learning tools. Incorporate interactive & personalized visuals, lessons, and assignments to create seamless learning experiences.",
    bg: "#D5D5FF",
    color: "#FFDF93",
  },
  {
    heading: "CBT Exams",
    textColor: "#ffffff",
    subHeading: "Platform",
    body: "Conduct secure, computer-based exams seamlessly. Skoolpro's exam platform ensures accurate results with minimal hassle.",
    bg: "#010081",
    color: "#FFFFFF",
  },
  {
    heading: "Analytics and",
    textColor: "#ffffff",
    subHeading: "Tracking",
    body: "Take advantage of Skoolpro’s analytics tools to gain real-time insights into student performance, staff efficiency, and school growth.",
    bg: "#333333",
    color: "#FFDF93",
  },
];

const Services = () => {
  return (
    <section id="services" className="mx-4 sm:mx-8 md:mx-16 lg:mx-20 xl:mx-25">
      <div className="flex flex-col items-start gap-8 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pb-[48] sm:pt-0">
        <div className="order-2 flex flex-col gap-1 sm:order-1">
          <div className="flex w-fit items-center justify-center rounded-[5px] bg-secondary px-2.5">
            <Text as="h4" weight={"bold"} scale={"heading4"}>
              Services
            </Text>
          </div>
          <p className="mt-4 w-full md:w-[55%]">
            Skoolpro offers a wide range of helpful tools designed to meet the
            needs of educational institutions across Africa:
          </p>
        </div>
        <div className="order-1 sm:order-2 self-center">
          <SkoolproCircle height={140} width={140} className="max-w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-8 sm:mb-16 md:mb-24 lg:mb-32 xl:mb-33.75">
        {data.map((dat, index) => (
          <div 
            key={index}
            className="rounded-lg border border-[#191A23] p-6 shadow-[0px_5px_0px_0px_#191A23] md:rounded-[48px] xl:p-8.75"
            style={{ backgroundColor: dat.bg }}
          >
            <div className="mt-6">
              <span
                className="flex w-fit items-center justify-center rounded-[5px] px-2.5 text-[30px] font-medium"
                style={{
                  backgroundColor: dat.color,
                  color:
                    dat.color === "#FFFFFF" ? "var(--light-blue)" : "#1d1d1d",
                }}
              >
                {dat.heading}
              </span>
              <span
                className="flex w-fit items-center justify-center rounded-[5px] px-2.5 text-[30px] font-medium"
                style={{
                  backgroundColor: dat.color,
                  color:
                    dat.color === "#FFFFFF" ? "var(--light-blue)" : "#1d1d1d",
                }}
              >
                {dat.subHeading}
              </span>
            </div>
            <div className="mt-4 md:mt-8 lg:mt-10 xl:mt-12 min-h-28 w-[90%]" style={{ color: dat.textColor }}>
              {dat.body}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
