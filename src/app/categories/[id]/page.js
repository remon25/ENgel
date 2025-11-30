"use client";

import FilteredMenu from "@/app/_components/layout/FilteredMenu";
import SearchBar from "@/app/_components/layout/SearchBar";
import Spinner from "@/app/_components/layout/Spinner";
import MenuItem from "@/app/_components/menu/MenuItem";
import MenuItemOld from "@/app/_components/menu/MenuItemOld";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function CategoryPage() {
  const [products, setProducts] = useState(null);
  const [productsError, setProductsError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    async function fetchProducts() {
      try {
        const response = await fetch(`/api/products?category=${id}`);
        if (!response.ok) throw new Error("Failed to load products");
        const data = await response.json();
        setProducts(data);
        setProductsError(false);
      } catch (error) {
        console.error("Error loading products:", error);
        setProductsError(true);
      }
    }

    async function fetchCategory() {
      try {
        const response = await fetch(`/api/categories/${id}`);
        if (!response.ok) throw new Error("Category not found");
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    }

    fetchProducts();
    fetchCategory();
  }, [id]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`/api/categories`);
        if (!response.ok) throw new Error("Failed to load categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    }

    fetchCategories();
  }, []);

  const filteredMenu = products?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (products === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center overflow-hidden">
        <Spinner />
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="w-full h-screen flex items-center justify-center overflow-hidden">
        <h1 className="text-2xl font-bold text-red-500">Category Not Found</h1>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <>
        <h1 className="text-[#222] text-left font-bold text-2xl md:text-2xl mb-2 mt-14 p-5 max-w-6xl mx-auto">
          {category?.name} Produkte
        </h1>
        <div className="w-full h-screen flex items-center justify-center overflow-hidden">
          <h1 className="text-2xl font-bold text-gray-500">
            No products found in this category.
          </h1>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-[#222] text-left font-bold text-2xl md:text-2xl mb-2 mt-14 p-5 max-w-6xl mx-auto">
        {category?.name} Produkte
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
          <MenuItemOld
            key={`${item._id}-${index}`}
            menuItemInfo={item}
            category={item.category.name}
            isOffersCategory={false}
          />
        ))}
      </section>
    </>
  );
}