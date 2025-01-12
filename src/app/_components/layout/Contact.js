import SectionHeader from "./SectionHeader";

export default function Contact() {
  return (
    <section className="text-center mt-24">
      <SectionHeader title={"Zögere nicht"} subtitle={"Kontaktieren Sie uns"} />
      <div className="mt-4">
        <a href="tel:15216722182" className="text-xl">
          15216722182
        </a>
      </div>
    </section>
  );
}
