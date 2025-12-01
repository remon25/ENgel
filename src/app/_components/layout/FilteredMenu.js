"use client";
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import MenuItemOld from "../menu/MenuItemOld";
import Spinner from "./Spinner";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilteredMenu({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  const itemsPerPage = 12;

  // Update URL when pagination, search, or category changes
  const updateUrl = (page, search, category) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page);
    if (search) params.set("search", search);
    if (category !== "all") params.set("category", category);

    const newUrl =
      params.toString() === "" ? window.location.pathname : `?${params}`;
    router.push(newUrl, { shallow: true });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateUrl(newPage, searchQuery, activeCategory);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
    updateUrl(1, value, activeCategory);
  };

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setActiveCategory(newCategory);
    setCurrentPage(1);
    updateUrl(1, searchQuery, newCategory);
  };

  // Fetch on page change or filter change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          paginated: "true",
          page: currentPage,
          limit: itemsPerPage,
        });

        if (searchQuery) {
          params.append("search", searchQuery);
        }

        if (activeCategory !== "all") {
          params.append("category", activeCategory);
        }

        const response = await fetch(`/api/products?${params}`);
        const data = await response.json();

        if (response.ok) {
          setFilteredMenu(data.products);
          setTotalPages(data.pagination.totalPages);
          setTotalProducts(data.pagination.totalProducts);
        } else {
          console.error("Failed to fetch products:", data.error);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, searchQuery, activeCategory]);

  return (
    <section className="home-menu">
      {/* Sticky SearchBar */}
      <div className="z-[11] bg-white max-w-6xl mx-auto">
        <div className="flex items-center">
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
          <div className="w-full pt-2 px-4 relative mx-auto text-gray-600">
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
      </div>

      {/* Products Container with Overlay Loading State */}
      <div className={loading ? "pointer-events-none relative" : "relative"}>
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center z-10 bg-white my-28">
            <Spinner />
          </div>
        )}

        {/* Menu Items Grid */}
        {filteredMenu.length > 0 && (
          <section
            id="Projects"
            className="menu-items-section w-fit mx-auto grid grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5"
          >
            {filteredMenu.map((item, index) => (
              <MenuItemOld
                key={`${item._id}-${index}`}
                menuItemInfo={item}
                category={
                  categories?.find((cat) => cat?._id === item.category._id)
                    ?.name
                }
                isOffersCategory={false}
              />
            ))}
          </section>
        )}

        {/* No Results */}
        {filteredMenu.length === 0 && !loading && (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-600 text-lg">Keine Produkte gefunden</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 mt-10 mb-5">
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
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
                  handlePageChange(Math.min(currentPage + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm md:px-4 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Weiter
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        {totalProducts > 0 && (
          <div className="text-center text-sm text-gray-600 mb-5">
            Zeige {(currentPage - 1) * itemsPerPage + 1} bis{" "}
            {Math.min(currentPage * itemsPerPage, totalProducts)} von{" "}
            {totalProducts}
          </div>
        )}
      </div>
    </section>
  );
}
