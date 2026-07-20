import { Text } from "@/components/ui";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="container mx-auto mt-3 rounded-[3rem] py-4 px-25.25 bg-primary">
      {/* small dot, top right */}
      <div className="flex justify-end">
        <div className="h-4 w-4 rounded-full bg-white" />
      </div>

      <div>
        <Image width={82} height={82} src="/Union.png" alt="" />

        <Text
          as="h1"
          scale={"heading1"}
          weight={"bold"}
          className="text-center text-white"
        >
          All-in-One School Management Software for Seamless Education:
          <span className="text-[#FFDF93]">
            {" "}
            Manage Classes, Student Data, Exams, and More.{" "}
          </span>
        </Text>

        <Text
          scale={"feature"}
          weight={"standard"}
          as="p"
          className="mx-auto mt-3 w-full text-center text-white"
        >
          Empower your institution with Skoolpro, a robust system designed to
          simplify school management. From handling student data and tracking
          attendance to managing classes and engaging with students and parents.
        </Text>

        <div className="mx-auto mt-5 text-center">
          <button
            className="rounded-2xl px-3 py-2 text-primary"
            style={{ backgroundColor: "#FFDF93" }}
          >
            Get started for free
            <Image
              src="/cta-pointer.png"
              alt="arrow"
              className="ml-1 inline-block h-10 w-auto"
              height={48}
              width={48}
            />
          </button>
        </div>

        {/* small dot, bottom left */}
        <div className="mt-4 pl-[18%]">
          <div className="h-4 w-4 rounded-full bg-[#FFDF93]" />
        </div>

        <div className="mt-3 flex justify-end pr-[15%]">
          <Image src="/Group.png" alt="star-icon" height={40} width={40} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
