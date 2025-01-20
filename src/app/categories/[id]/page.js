"use client";

import FilteredMenu from "@/app/_components/layout/FilteredMenu";
import Spinner from "@/app/_components/layout/Spinner";
import MenuItem from "@/app/_components/menu/MenuItem";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function CategoryPage() {
  const [products, setProducts] = useState(null); // Null indicates loading state
  const [error, setError] = useState(false); // Track if there's an error
  const [categories, setCategories] = useState([]);
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
  console.log(categories);
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

      {/* {products.map((item, index) => (
          <MenuItem
            key={`${item._id}-${index}`}
            menuItemInfo={item}
            category={item.category.name}
            isOffersCategory={false}
          />
        ))} */}

      <FilteredMenu menu={products} categories={categories} />
    </>
  );
}
