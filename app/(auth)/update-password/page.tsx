import Image from "next/image";
import LoginForm from "./Form";
import Link from "next/link";

const UpdatePassword = () => {
  return (
    <div className="py-12 px-6 h-full sm:px-14 md:px-29.25 flex flex-col items-center w-screen">
      <Link href={"/"} className="mb-20.75">
        <Image
          src={"/icons/SkoolPro_Admiral_Blue_1_1.png"}
          height={51}
          width={199}
          alt="app logo"
          loading="eager"
        />
      </Link>

      <div className="flex h-full flex-wrap gap-16.5 items-center justify-center w-full">
        <Image
          src={"/images/login_card.png"}
          height={660}
          width={640}
          alt="welcome"
          className="hidden w-64 h-auto md:w-160 sm:block"
        />

        <LoginForm />
      </div>
    </div>
  );
};

export default UpdatePassword;
