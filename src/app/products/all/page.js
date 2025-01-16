import FilteredMenu from "@/app/_components/layout/FilteredMenu";

export default async function Page() {
  let menu = [];
  let categories = [];

  try {
    const [menuRes, categoryRes] = await Promise.all([
      fetch(`${process.env.NEXTAUTH_URL}/api/products`, {
        cache: "no-store",
      }),
      fetch(`${process.env.NEXTAUTH_URL}/api/categories`, {
        cache: "no-store",
      }),
    ]);

    if (menuRes.ok) menu = await menuRes.json();
    if (categoryRes.ok) categories = await categoryRes.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <>
      <h1 className="text-[#222] text-left font-bold text-2xl md:text-2xl mb-2 mt-14 p-5 max-w-6xl mx-auto">
        Alle Produkte
      </h1>
      <FilteredMenu menu={menu} categories={categories} />;
    </>
  );
}
