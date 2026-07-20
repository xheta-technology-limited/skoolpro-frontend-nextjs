import { Navbar, Services } from "./_components";
import { Hero } from "./_components";
import WhyUS from "./_components/WhyUs";

export default function Home() {
  return (
    <div className="w-full flex flex-col px-4">
      <Navbar />
      <Hero />
      <Services />
      <WhyUS />
    </div>
    // <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    //   <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">

    //   </main>
    // </div>
  );
}
