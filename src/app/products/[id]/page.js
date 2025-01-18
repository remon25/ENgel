"use client";

import { useContext, useEffect, useState } from "react";
import Cart from "@/app/_components/icons/Cart";
import Image from "next/image";
import { useParams } from "next/navigation";
import Spinner from "@/app/_components/layout/Spinner";
import { cartContext } from "@/app/_components/AppContext";
import Link from "next/link";

export default function ProductPage() {
  const [mainImage, setMainImage] = useState(null);
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null); // State to store category data
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  const { id } = useParams();

  const { addToCart } = useContext(cartContext);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products?_id=${id}`);
        if (!response.ok)
          throw new Error("Produkt konnte nicht geladen werden");

        const data = await response.json();
        setProduct(data);
        setMainImage(data.bannerImage); // Set the main image initially
        setSelectedSize(data.sizes?.[0] || null); // Set the first size as default

        // Fetch category based on category ID from product
        const categoryResponse = await fetch(`/api/categories`);
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json();

          setCategory(categoryData.find((cat) => cat._id === data.category));
        }
      } catch (error) {
        console.error("Fehler beim Laden des Produkts:", error);
      }
    }

    fetchProduct();
  }, [id]);


  const handleAddToCart = () => {
    addToCart(product, selectedSize, [], quantity); // You can pass size and extras as needed
  };

  if (!product || !category) {
    return (
      <div className="w-full h-screen flex items-center justify-center overflow-hidden">
        <Spinner />
      </div>
    );
  }

  // Destructure only after product is available
  const {
    name,
    bannerImage,
    moreImages = [],
    description,
    sizes,
  } = product;

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  const changeImage = (newImage) => setMainImage(newImage);

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-4">
          {/* Product Images */}
          <div className="w-full md:w-1/2 px-4 mb-8">
            <Image
              width={600}
              height={600}
              placeholder="blur"
              blurDataURL={"./default-menu.png"}
              quality={80}
              src={mainImage || bannerImage || "/default-menu.png"}
              alt={name}
              className="w-full h-auto rounded-lg shadow-md mb-4"
            />
            <div className="flex gap-4 py-4 justify-center overflow-x-auto">
              {[bannerImage, ...moreImages].map((img, index) => (
                <Image
                  key={index}
                  width={50}
                  height={50}
                  src={img || "/default-menu.png"}
                  alt={`Miniaturbild ${index + 1}`}
                  className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                  onClick={() => changeImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2 px-4">
            <h2 className="text-3xl font-bold mb-2">{name}</h2>
            <p className="text-gray-600 mb-4">Seite: {product?.code}</p>
            <p className="text-gray-600 mb-4">
              Kategorie: {category.name}
            </p>{" "}
            {/* Display category name */}
            <div className="mb-4">
              <span className="text-2xl font-bold mr-2">{product.price}€</span>
              {product.price && (
                <span className="text-gray-500 line-through">
                  {product.beforeSalePrice && product.beforeSalePrice > 0 && product.beforeSalePrice + "€"}
                </span>
              )}
            </div>
            {description && (
              <div className="border-b border-gray-300 py-4 mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  Produktbeschreibung
                </h3>
                <p className="text-gray-700 mb-6">{description}</p>
              </div>
            )}
            <div className="border-b border-gray-300 py-4 mb-4">
              {sizes && (
                <>
                  <h3 className="text-lg font-semibold mb-2">Größen:</h3>
                  <div className="flex flex-wrap items-center mb-2 gap-3">
                    {sizes
                      // .sort((a, b) => {
                      //   // Extract numbers from the size name (e.g., "100ml" -> 100)
                      //   const numA = parseFloat(a.name.replace(/[^\d.]/g, ""));
                      //   const numB = parseFloat(b.name.replace(/[^\d.]/g, ""));
                      //   return numA - numB;
                      // })
                      .map((size) => (
                        <button
                          key={size._id}
                          onClick={() => setSelectedSize(size)}
                          className={`border px-3 py-1 cursor-pointer ${
                            selectedSize?._id === size._id
                              ? "bg-blue-500 text-white"
                              : "bg-white text-gray-600"
                          }`}
                        >
                          <span className="font-medium uppercase">
                            {size.name}{" "}
                          </span>
                          {size.price > 0 ? "(+" + size.price + "€" + ")" : ""}
                        </button>
                      ))}
                  </div>
                </>
              )}
            </div>
            {/* Quantity Controls */}
            <div className="inline-flex items-center mt-2 mb-5">
              <button
                onClick={decreaseQuantity}
                disabled={quantity === 1}
                className="bg-white rounded-l border text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200"
              >
                -
              </button>
              <div className="bg-gray-100 border-t border-b border-gray-100 text-gray-600 hover:bg-gray-100 inline-flex items-center px-4 py-1 select-none">
                {quantity}
              </div>
              <button
                onClick={increaseQuantity}
                className="bg-white rounded-r border text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200"
              >
                +
              </button>
            </div>
            <div className="flex space-x-4 mb-6">
              <button
                onClick={handleAddToCart}
                className="bg-[#d4af5e] flex gap-2 items-center text-white px-2 md:px-6 py-2 hover:bg-[#d4af50] focus:outline-none"
              >
                <Cart />
                In den Warenkorb
              </button>
              <Link
                href="/cart"
                className="flex gap-2 items-center border border-[#121212] px-2 md:px-6 py-2 hover:bg-[#d4af50] hover:border-[#d4af50] hover:text-white focus:outline-none"
              >
                Zur Kasse
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
