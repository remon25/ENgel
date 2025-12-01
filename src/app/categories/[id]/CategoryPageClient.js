"use client";

import SearchBar from "@/app/_components/layout/SearchBar";
import Spinner from "@/app/_components/layout/Spinner";
import MenuItemOld from "@/app/_components/menu/MenuItemOld";
import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function CategoryPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams();

  const [products, setProducts] = useState(null);
  const [productsError, setProductsError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [category, setCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  const itemsPerPage = 12;

  const updateUrl = (page, search) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page);
    if (search) params.set("search", search);

    const newUrl =
      params.toString() === "" ? window.location.pathname : `?${params}`;
    router.push(newUrl, { shallow: true });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateUrl(newPage, searchQuery);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
    updateUrl(1, value);
  };


  useEffect(() => {
    if (!id) return;

    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          category: id,
          page: currentPage,
          limit: itemsPerPage,
        });

        if (searchQuery) {
          params.append("paginated", "true");
          params.append("search", searchQuery);
        }

        const response = await fetch(`/api/products?${params}`);
        if (!response.ok) throw new Error("Failed to load products");
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
        setTotalProducts(data.pagination.totalProducts);
        setProductsError(false);
      } catch (error) {
        console.error("Error loading products:", error);
        setProductsError(true);
        setProducts(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [id, currentPage, searchQuery]);

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

  if (loading && products === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center overflow-hidden">
        <Spinner />
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="w-full h-screen flex items-center justify-center overflow-hidden">
        <h1 className="text-2xl font-bold text-gray-900">Category Not Found</h1>
      </div>
    );
  }

  if (products?.length === 0 && !loading) {
    return (
      <>
        <h1 className="text-[#222] text-left font-bold text-2xl md:text-2xl mb-2 sm:mt-14 p-5 max-w-6xl mx-auto">
          {category?.name} Produkte
        </h1>
        <div className="w-full h-screen flex items-center justify-center overflow-hidden">
          <h1 className="text-2xl font-bold text-gray-500">
            {searchQuery
              ? "Keine Produkte gefunden"
              : "No products found in this category."}
          </h1>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-[#222] text-left font-bold text-2xl md:text-2xl mb-2 sm:mt-14 p-5 max-w-6xl mx-auto">
        {category?.name} Produkte
      </h1>

      <div className="sticky top-0 z-[11] bg-white max-w-6xl mx-auto">
        <div className="flex items-center">
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
        </div>
      </div>

      <div
        className={
          loading ? "opacity-50 pointer-events-none relative" : "relative"
        }
      >
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center z-10">
            <Spinner />
          </div>
        )}

        <section
          id="Projects"
          className="menu-items-section w-fit mx-auto grid grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5"
        >
          {products &&
            products.map((item, index) => (
              <MenuItemOld
                key={`${item._id}-${index}`}
                menuItemInfo={item}
                category={item.category.name}
                isOffersCategory={false}
              />
            ))}
        </section>

        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 mt-10 mb-5">
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm md:px-4 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Zurück
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  const isMobile =
                    typeof window !== "undefined" && window.innerWidth < 768;
                  if (isMobile) {
                    return (
                      page === currentPage ||
                      page === currentPage - 1 ||
                      page === currentPage + 1 ||
                      page === 1 ||
                      page === totalPages
                    );
                  }
                  return true;
                })
                .map((page, index, filtered) => {
                  if (index > 0 && filtered[index - 1] < page - 1) {
                    return (
                      <div key={`ellipsis-${page}`}>
                        <span className="px-2 py-2">...</span>
                      </div>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm rounded-lg ${
                        currentPage === page
                          ? "bg-gray-900 text-white"
                          : "border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm md:px-4 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Weiter
              </button>
            </div>
          </div>
        )}

        {totalProducts > 0 && (
          <div className="text-center text-sm text-gray-600 mb-5">
            Zeige {(currentPage - 1) * itemsPerPage + 1} bis{" "}
            {Math.min(currentPage * itemsPerPage, totalProducts)} von{" "}
            {totalProducts}
          </div>
        )}
      </div>
    </>
  );
}