import Image from "next/image";
import star from "@/assets/star.svg";
import pointer from "@/assets/pointer.svg";
import Group from "@/assets/group.svg";

const Hero = () => {
  return (
    <div
      className="container mx-auto mt-3 rounded-[3rem] px-5 py-4"
      style={{ backgroundColor: "var(--dark-blue)" }}
    >
      {/* small dot, top right */}
      <div className="flex justify-end">
        <div className="h-4 w-4 rounded-full bg-white" />
      </div>

      <div>
        <Image src={star} alt="" />

        <h3 className="text-center font-[Poppins-bold] text-[30px] leading-tight text-white md:text-[53px]">
          All-in-One School Management Software for Seamless Education:
          <span className="text-[#FFDF93]">
            {" "}
            Manage Classes, Student Data, Exams, and More.{" "}
          </span>
        </h3>

        <p className="mx-auto mt-3 w-full text-center text-[20px] text-white md:w-[83%]">
          Empower your institution with Skoolpro, a robust system designed to
          simplify school management. From handling student data and tracking
          attendance to managing classes and engaging with students and parents.
        </p>

        <div className="mx-auto mt-5 text-center">
          <button
            className="rounded-2xl px-3 py-2 text-[var(--light-blue)]"
            style={{ backgroundColor: "#FFDF93" }}
          >
            Get started for free
            <Image
              src={pointer}
              alt="arrow"
              className="ml-1 inline-block h-10 w-auto"
            />
          </button>
        </div>

        {/* small dot, bottom left */}
        <div className="mt-4 pl-[18%]">
          <div className="h-4 w-4 rounded-full bg-[#FFDF93]" />
        </div>

        <div className="mt-3 flex justify-end pr-[15%]">
          <Image src={Group} alt="star-icon" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
