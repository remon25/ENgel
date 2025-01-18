"use client";
import { useContext, useEffect, useState } from "react";
import { cartContext } from "../AppContext";
import toast from "react-hot-toast";
import Image from "next/image";
import Cart from "../icons/Cart";
import Link from "next/link";

export default function MenuItem({ menuItemInfo, isOffersCategory }) {
  const {
    name,
    description,
    bannerImage,
    price,
    beforeSalePrice,
    sizes,
    extraIngredientPrice,
    _id,
  } = menuItemInfo;
  const [selectedSize, setSelectedSize] = useState(sizes?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { addToCart } = useContext(cartContext);
  const [category, setCategory] = useState(null);

  function handlePopupToggle() {
    if (!showPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    setShowPopup((prev) => !prev);
  }

  function handleCancel() {
    setShowPopup(false);
    document.body.style.overflow = "auto";
  }

  async function handleAddToCartButtonClick() {
    const hasOptions = sizes.length > 0 || extraIngredientPrice.length > 0;
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }
    addToCart(menuItemInfo, selectedSize, selectedExtras);
    await new Promise((resolve) => setTimeout(resolve, 100));
    setShowPopup(false);
    toast.success(`Added ${name} to cart`);
  }

  function handleExtrasClick(ev, extraThing) {
    const checked = ev.target.checked;
    if (checked) {
      setSelectedExtras((prev) => [...prev, extraThing]);
    } else {
      setSelectedExtras((prev) => {
        return prev.filter((e) => e.name !== extraThing.name);
      });
    }
  }

  useEffect(() => {
    async function fetchProduct() {
      // Fetch category based on category ID from product
      try {
        const categoryResponse = await fetch(`/api/categories`);
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json();

          setCategory(
            categoryData.find((cat) => cat._id === menuItemInfo.category).name
          );
        }
      } catch (error) {
        console.error("Fehler beim Laden des Produkts:", error);
      }
    }
    fetchProduct();
  }, [menuItemInfo.category]);

  let selectedPrice = price;

  if (selectedSize) {
    selectedPrice += selectedSize.price;
  }
  if (selectedExtras?.length > 0) {
    for (const extra of selectedExtras) {
      selectedPrice += extra.price;
    }
  }

  return (
    <>
      <div className="w-60 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
        <Link href={`/products/${_id}`}>
          <div className="bg-[#eee]">
            <Image
              width={250}
              height={250}
              src={bannerImage || "/default-menu.png"}
              alt="Product"
              className="h-60 w-60 object-cover rounded-t-xl"
            />
          </div>
          <div className="px-4 py-3 w-60">
            <span className="text-gray-400 mr-3 uppercase text-xs">
              {category || ""}
            </span>
            <p className="text-lg font-bold text-black truncate block capitalize">
              {name}
            </p>
            <div className="flex items-center">
              <p className="text-lg font-semibold text-black cursor-auto my-3">
                <span className="text-gray-500 mr-3 uppercase text-xs">ab</span>{" "}
                {price} €
              </p>
              <del>
                <p className="text-sm text-gray-600 cursor-auto ml-2">
                  {beforeSalePrice && beforeSalePrice > 0 && beforeSalePrice + "€"} 
                </p>
              </del>
              <div className="ml-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-bag-plus"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                  />
                  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
