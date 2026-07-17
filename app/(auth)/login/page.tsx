"use client";
import Image from "next/image";
import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <div className="py-12 px-29.25 flex flex-col items-center">
      <Image
        src={"/icons/SkoolPro_Admiral_Blue_1_1.png"}
        height={51}
        width={199}
        alt="app logo"
        className="mb-20.75"
        loading="eager"
      />
      <div className="flex flex-wrap gap-16.5 items-center">
        <Image
          src={"/images/login_card.png"}
          height={660}
          width={640}
          alt="welcome"
        />

        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
