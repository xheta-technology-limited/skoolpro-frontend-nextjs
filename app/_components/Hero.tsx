import Image from "next/image";

const Hero = () => {
  return (
    <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-20 xl:mx-25 mt-8 sm:mt-9 md:mt-10 lg:mt-12 xl:mt-[51px] mb-8 sm:mb-16 md:mb-24 lg:mb-32 xl:mb-[135px] rounded-[3rem] bg-primary">
      <div className="max-w-[1440px] py-4 px-6 sm:px-10 md:px-16 lg:px-20 xl:px-25.25">
        {/* small dot, top right */}
        <div className="flex justify-end">
          <div className="h-4 w-4 rounded-full bg-white" />
        </div>

        <div>
          <Image width={82} height={82} src="/Union.png" alt="" />

          <h1 className="text-center font-lora text-[32px] font-semibold leading-[1.2] text-white lg:font-(family-name:--font-poppins) lg:text-[56px] lg:font-bold">
            All-in-One School Management Software for Seamless Education:
            <br />
            <span className="text-secondary">
              Manage Classes, Student Data, Exams, and More.{" "}
            </span>
          </h1>
          <p className="mx-auto mt-3 w-full max-w-2xl text-center font-lora text-[16px] font-normal leading-[1.2] text-white lg:font-(family-name:--font-poppins) lg:text-[24px]">
            Empower your institution with Skoolpro, a robust system designed to
            simplify school management. From handling student data and tracking
            attendance to managing classes and engaging with students and parents.
          </p>

          <div className="mx-auto mt-5 text-center">
            <button
              className="rounded-2xl px-3 py-2 text-primary"
              style={{ backgroundColor: "#FFDF93" }}
            >
              Get started for free
              <Image
                src="/images/cta-pointer.png"
                alt="arrow"
                className="ml-1 inline-block h-10 w-auto"
                height={48}
                width={48}
              />
            </button>
          </div>

          {/* small dot, bottom left */}
          <div className="mt-4 pl-[18%]">
            <div className="h-4 w-4 rounded-full bg-secondary" />
          </div>

          <div className="mt-3 flex justify-end pr-[15%]">
            <Image src="/Group.png" alt="star-icon" height={40} width={40} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;