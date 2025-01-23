import Link from "next/link";

export default function page() {
  return (
    <div>
      {/* ABOUT Section */}
      <div className="w-full lg:h-screen h-full m-auto flex items-center justify-center  py-20 bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full flex flex-col justify-center items-center sm:px-4 px-2">
          {/* Main Container */}
          <div className="lg:w-[90%] w-full mx-auto flex flex-col lg:gap-10 lg:flex-row items-center justify-center">
            <div className="relative">
              {/* Side Image 1 */}
              <img
                className="absolute z-10 lg:left-[2rem] -top-4 left-[1rem] lg:w-[8rem] lg:h-[8rem] sm:w-[6rem] sm:h-[6rem] w-[3rem] h-[3rem] rounded-full"
                src="/about-3.jpeg"
                alt="Side Image"
              />
              {/* Side Image 2 */}
              <img
                className="absolute z-10 lg:top-[12rem] sm:top-[11rem] top-[5rem] sm:-left-[3rem] -left-[2rem] lg:w-[8rem] lg:h-[8rem] sm:w-[6rem] sm:h-[6rem] w-[3rem] h-[3rem] rounded-full"
                src="/about-2.jpeg"
                alt="Side Image 2"
              />
              {/* Side Image 3 */}
              <img
                className="absolute z-10 lg:top-[23rem] sm:top-[20.5rem] top-[10.5rem] left-[2rem] lg:w-[8rem] lg:h-[8rem] sm:w-[6rem] sm:h-[6rem] w-[3rem] h-[3rem] rounded-full"
                src="/about-1.jpeg"
                alt="Side Image 3"
              />
              {/* Main Image */}
              <img
                className="rounded-full relative object-cover right-0 lg:w-[30rem] lg:h-[30rem] sm:w-[25rem] sm:h-[25rem] w-[12rem] h-[12rem] outline sm:outline-offset-[.77em] outline-offset-[.37em] outline-[#d4af5e]"
                src="/about-main.jpeg"
                alt="About us"
              />
            </div>
            <div className="lg:w-[60%] my-5 p-4 w-full h-full shadow-xl shadow-[#d4af5e79] flex flex-col justify-center items-center sm:px-6 px-4 rounded-xl">
              <h2 className="text-4xl text-center text-primary dark:text-[#d4af5e] font-bold px-4 py-1 md:mt-0 mt-10 mb-5">
                Über uns
              </h2>
              <p className="md:text-xl sm:text-lg text-base mt-2 text-justify sm:px-2 dark:text-gray-300">
                Engel ist ein führendes Unternehmen im Verkauf von
                hochwertigen Düften, das für Exzellenz und Eleganz steht. Mit
                einer breiten Auswahl an erstklassigen Parfüms bieten wir
                unseren Kunden unvergleichliche Duftkreationen, die zeitlose
                Schönheit und Stil verkörpern. Jedes unserer Produkte wird
                sorgfältig ausgewählt, um höchste Qualität und
                Kundenzufriedenheit zu gewährleisten. Ob für den Alltag oder
                besondere Anlässe – Engel bringt mit seinen einzigartigen
                Düften einen Hauch von Luxus in Ihr Leben. Vertrauen Sie auf
                unsere Expertise und erleben Sie die Welt der erlesenen Parfüms.
                Das Unternehmen wird von Suleman Abo Shakha geleitet, dessen
                Vision und Leidenschaft für exquisite Düfte das Herzstück
                unseres Erfolgs bilden.
              </p>
              <Link href="/contact">
                <button className="lg:mt-10 mt-6 lg:px-6 px-4 lg:py-4 py-2 bg-[#d4af5e] rounded-sm lg:text-xl text-lg text-white font-semibold">
                  Kontakt
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
