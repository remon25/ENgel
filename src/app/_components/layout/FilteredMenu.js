"use client";
import { useState } from "react";
import MenuItem from "../menu/MenuItem";
import SearchBar from "./SearchBar";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import Link from "next/link";

export default function FilteredMenu({ menu, categories }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredMenu = menu.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeCategory === "all" || item.category === activeCategory) // Filter by category if activeCategory is set
  );

  const handleCategoryChange = (event) => {
    setActiveCategory(event.target.value);
  };

  return (
    <section className="home-menu">
      {/* Sticky SearchBar */}
      <div className="sticky top-0 z-[11] bg-white max-w-6xl mx-auto">
        <div className="flex items-center">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <div className="w-full pt-2 px-4  relative mx-auto text-gray-600">
            <select
              id="category-select"
              className="w-full border-2 border-gray-300 bg-white h-10 rounded-lg text-xs focus:outline-none"
              value={activeCategory}
              onChange={handleCategoryChange}
            >
              <option value="all">Alle</option>
              {categories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full p-4 mx-auto">
          <div className="p-4 flex items-center justify-around border-t-gray-300 border-b-gray-300 border-[1px] rounded-[5px]">
            {categories.map((c) => (
              <Link
                className="text-sm sm:text-lg font-semibold"
                key={c._id}
                href={`/categories/${c._id}`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Category Dropdown */}

      <section
        id="Projects"
        className="menu-items-section w-fit mx-auto grid grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5"
      >
        {filteredMenu.map((item, index) => (
          <MenuItem
            key={`${item._id}-${index}`}
            menuItemInfo={item}
            category={categories?.find((cat) => cat?._id === item.category)?.name}
            isOffersCategory={false}
          />
        ))}
      </section>
    </section>
  );
}
