"use client";

import FilteredMenu from "@/app/_components/layout/FilteredMenu";
import SearchBar from "@/app/_components/layout/SearchBar";
import Spinner from "@/app/_components/layout/Spinner";
import MenuItem from "@/app/_components/menu/MenuItem";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function CategoryPage() {
  const [products, setProducts] = useState(null); // Null indicates loading state
  const [error, setError] = useState(false); // Track if there's an error
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        const response = await fetch(`/api/products?category=${id}`);
        if (!response.ok) throw new Error("Failed to load data");

        const data = await response.json();

        if (!data || data.length === 0) {
          setError(true); // No products found for the category
        } else {
          setProducts(data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError(true); // Set error state if fetching fails
      }
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/categories`);
        if (!response.ok) throw new Error("Failed to load data");

        const data = await response.json();

        if (!data || data.length === 0) {
          setError(true); // No products found for the category
        } else {
          setCategories(data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError(true); // Set error state if fetching fails
      }
    }

    fetchData();
  }, []);

  const filteredMenu = products?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show spinner while loading
  if (products === null && !error) {
    return (
      <div className="w-full h-screen flex items-center justify-center overflow-hidden">
        <Spinner />
      </div>
    );
  }

  // Show "Not Found" message if there's an error or no products
  if (error || !products || products.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center overflow-hidden">
        <h1 className="text-2xl font-bold text-red-500">Category Not Found</h1>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-[#222] text-left font-bold text-2xl md:text-2xl mb-2 mt-14 p-5 max-w-6xl mx-auto">
        {products[0]?.category?.name} Produkte
      </h1>

      <div className="sticky top-0 z-[11] bg-white max-w-6xl mx-auto">
        <div className="flex items-center">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      <section
        id="Projects"
        className="menu-items-section w-fit mx-auto grid grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5"
      >
        {filteredMenu.map((item, index) => (
          <MenuItem
            key={`${item._id}-${index}`}
            menuItemInfo={item}
            category={item.category.name}
            isOffersCategory={false}
          />
        ))}
      </section>

      {/* <FilteredMenu menu={products} categories={categories} /> */}
    </>
  );
}
