import AboutSection from "./_components/AboutSection";
import PerfumeShowcase from "./_components/Commitment";
import Hero from "./_components/layout/Hero";
import HomeMenu from "./_components/layout/HomeMenu";
import Sidebar from "./_components/layout/Sidebar";
import NewsletterSubscription from "./_components/StayConnected";
import WhyChooseUs from "./_components/Whyus";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <HomeMenu />
      <WhyChooseUs />
      <PerfumeShowcase />
      <NewsletterSubscription/>
    </>
  );
}
