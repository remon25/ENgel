import Image from "next/image";
import banner from "/public/hero.png";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="px-7 lg:px-10 max-w-6xl mx-auto flex flex-col gap-y-10 lg:flex-row items-center gap-x-10 justify-center py-10 lg:py-14 dark:bg-gray-800">
      <div className="lg:w-[650px] lg:px-5 flex flex-col gap-y-5">
        <h1 className="text-4xl md:text-5xl xl:text-[50px] leading-[1.2] md:max-w-xl md:mx-auto md:text-center lg:text-left lg:mx-0 lg:max-w-full font-semibold dark:text-white">
          Erleben Sie die Essenz luxuriöser Düfte online
        </h1>
        <p className="text-sm md:max-w-xl md:mx-auto lg:mx-0 lg:max-w-full md:text-center lg:text-left dark:text-gray-300">
          Mit unseren effizienten Online-Services können Sie Ihr
          Einkaufserlebnis vereinfachen und wertvolle Zeit sparen.
        </p>
        <div className="flex gap-x-5 flex-col gap-y-2.5 lg:flex-row">
          <a
            href="#"
            className="flex w-full lg:w-fit items-center text-white justify-center  bg-[#d4af5e] px-6 py-3.5 font-semibold hover:shadow-lg hover:drop-shadow transition duration-200"
          >
            <span>Jetzt einkaufen</span>
            <ArrowRight className="ml-2" />
          </a>
        </div>
      </div>
      <div className="hero-image md:px-5 lg:px-0 w-full lg:w-1/2 rounded-3xl md:pt-2 lg:pt-0 relative isolate z-10">
        <Image className="rounded-3xl w-full" src={banner} alt="" />
      </div>
    </div>
  );
}
