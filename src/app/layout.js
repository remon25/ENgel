import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "./_components/layout/Header";
import Footer from "./_components/layout/Footer";
import AppProvider from "./_components/AppContext";
import { Toaster } from "react-hot-toast";
import Sidebar from "./_components/layout/Sidebar";
import MobileCart from "./_components/layout/MobileCart";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata = {
  title: {
    template: "%s | ENGEL",
    default: "ENGEL",
  },
  description:
    "Engel Company ist ein führendes Unternehmen im Bereich der Parfüm- und Duftstoffindustrie. Wir spezialisieren uns auf den Verkauf hochwertiger Düfte, die Eleganz und Raffinesse verkörpern. Unsere Produktpalette umfasst exklusive Parfüms für Damen und Herren, die mit sorgfältig ausgewählten Inhaltsstoffen hergestellt werden, um ein einzigartiges Dufterlebnis zu bieten.Bei Engel Company legen wir Wert auf Qualität, Innovation und Kundenzufriedenheit. Unser Ziel ist es, die Sinne zu begeistern und das Selbstbewusstsein unserer Kunden mit unseren unverwechselbaren Duftkreationen zu stärken. Entdecken Sie mit uns die Welt der luxuriösen Düfte und lassen Sie sich von unserer Leidenschaft für Parfümerie inspirieren.",
  icons: {
    icon: "/logo-favi.png",
  },
  openGraph: {
    type: "website",
    url: "https://engel.de",
    title: "ENGEL",
    description:
      "Engel Company ist ein führendes Unternehmen im Bereich der Parfüm- und Duftstoffindustrie. Wir spezialisieren uns auf den Verkauf hochwertiger Düfte, die Eleganz und Raffinesse verkörpern. Unsere Produktpalette umfasst exklusive Parfüms für Damen und Herren, die mit sorgfältig ausgewählten Inhaltsstoffen hergestellt werden, um ein einzigartiges Dufterlebnis zu bieten.Bei Engel Company legen wir Wert auf Qualität, Innovation und Kundenzufriedenheit. Unser Ziel ist es, die Sinne zu begeistern und das Selbstbewusstsein unserer Kunden mit unseren unverwechselbaren Duftkreationen zu stärken. Entdecken Sie mit uns die Welt der luxuriösen Düfte und lassen Sie sich von unserer Leidenschaft für Parfümerie inspirieren.",
    images: [
      {
        url: "/logo-og.jpg",
        width: 1200,
        height: 630,
        alt: "ENGEL",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className}`}
        style={{ backgroundColor: "#FcFcFc" }}
      >
        <AppProvider>
          <main
            style={{ minHeight: "100vh", paddingTop: "130px" }}
            className=""
          >
            <Toaster />
            <Header />
            <Sidebar />
            <MobileCart />
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
