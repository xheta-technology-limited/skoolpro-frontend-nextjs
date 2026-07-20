import Button from "@/components/ui/button/button";
import Text from "@/components/ui/text/text";
import TextArea from "@/components/ui/form/textarea/text-area";
import Image from "next/image";
import { Select } from "@/components/ui/form";
import { FormProvider, useForm } from "react-hook-form";
import { Navbar } from "./_components";

export default function Home() {
  return (
    <>
      <Navbar />
    </>
    // <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    //   <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">

    //   </main>
    // </div>
  );
}
