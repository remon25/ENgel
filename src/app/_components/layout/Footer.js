import Image from "next/image";
import Facebook from "../icons/Facebook";
import Instagram from "../icons/Instagram";
import Whatsapp from "../icons/Whatsapp";
import Link from "next/link";
import OpenHours from "./OpenHours";

export default function Footer() {
  return (
    <>
      <footer className="mt-16">
        <div className="bg-gray-500 pt-4">
          <div className="max-w-screen-lg px-4 sm:px-6 text-gray-800 sm:grid md:grid-cols-4 sm:grid-cols-2 text-center md:text-left sm:te mx-auto">
            <div className="p-5 flex justify-center md:justify-start items-center">
              <Image src={"/logo.png"} alt="" width={150} height={150} />
            </div>
            <div className="p-5 text-neutral-100">
              <div className="text-md uppercase text-white font-bold">
                Ressourcen
              </div>
              <a className="my-3 block" href="/#">
                Vorgestellte Produkte
                <span className="text-teal-600 text-xs p-1"></span>
              </a>
              <a className="my-3 block" href="/#">
                Alle Produkte{" "}
                <span className="text-teal-600 text-xs p-1"></span>
              </a>
            </div>
            <div className="p-5 text-neutral-100">
              <div className="text-md uppercase text-white font-bold">
                Kontakt
              </div>
              <a className="my-3 block" href="/#">
                Krummholzberg 3 <br /> 21073 Hamburg
                <span className="text-teal-600 text-xs p-1"></span>
              </a>
              <a className="text-nowrap block my-3" href="tel:15216722182">
                15216722182
              </a>
            </div>
            <div className="p-5 text-neutral-100">
              <div className="text-md uppercase text-white font-bold">
                Unterstützung
              </div>
              <Link href={"/terms-and-conditions"} className="my-3 block">
                AGB
              </Link>
              <Link href={"/privacy-policy"} className="my-3 block">
                Datenschutzerklärung
              </Link>
              <span className="text-xs">Steuernummer: 47/600/02122</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-500 pt-2">
          <div
            className="flex pb-5 px-3 m-auto pt-5 border-t text-gray-800 text-sm flex-col
      max-w-screen-lg items-center"
          >
            <div className="md:flex-auto md:flex-row mt-2 flex-row flex">
              <a href="/#" className="w-6 mx-2">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="/#" className="w-6 mx-3">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="/#" className="w-6 mx-2">
                <Whatsapp className="w-6 h-6" />
              </a>
            </div>
            <div>
              <a
                className="my-3 block text-white text-[14px]"
                href="mailto:angelwardparfumier@gmail.com"
              >
                angelwardparfumier@gmail.com
                <span className="text-teal-600 text-xs p-1"></span>
              </a>
            </div>
            <div className="my-5 text-neutral-50">
              {" "}
              © ENGEL. Alle Rechte vorbehalten.
            </div>
            <div className="w-full text-[15px] italic text-center text-neutral-50 pb-2">
              Entworfen und entwickelt von{" "}
              <Link
                className="font-semibold"
                href="https://ooomedia.de/"
                target="_blank"
              >
                ooomedia
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
