"use client";

import { useContext, useEffect, useState } from "react";
import Cart from "@/app/_components/icons/Cart";
import Image from "next/image";
import { useParams } from "next/navigation";
import Spinner from "@/app/_components/layout/Spinner";
import { cartContext } from "@/app/_components/AppContext";

export default function ProductPage() {
  const [mainImage, setMainImage] = useState(null);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { id } = useParams();

  const { addToCart } = useContext(cartContext);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products?_id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");

        const data = await response.json();
        setProduct(data);
        setMainImage(data.bannerImage); // Set the main image initially
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, null, [], quantity); // You can pass size and extras as needed
  };

  if (!product) {
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
    stock,
    extraOptions,
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
              src={mainImage || bannerImage}
              alt={name}
              className="w-full h-auto rounded-lg shadow-md mb-4"
            />
            <div className="flex gap-4 py-4 justify-center overflow-x-auto">
              {[bannerImage, ...moreImages].map((img, index) => (
                <Image
                  key={index}
                  width={50}
                  height={50}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                  onClick={() => changeImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2 px-4">
            <h2 className="text-3xl font-bold mb-2">{name}</h2>
            <p className="text-gray-600 mb-4">ID: {product._id}</p>
            <div className="mb-4">
              <span className="text-2xl font-bold mr-2">${product.price}</span>
              {product.price && (
                <span className="text-gray-500 line-through">
                  ${product.price * 1.2}
                </span>
              )}
            </div>
            <div className="border-b border-gray-300 py-4 mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Product Description
              </h3>
              <p className="text-gray-700 mb-6">{description}</p>
            </div>

            <div className="border-b border-gray-300 py-4 mb-4">
              {sizes && (
                <>
                  <h3 className="text-lg font-semibold mb-2">Sizes:</h3>
                  <div className="flex items-center mb-2 gap-3">
                    {sizes.map((size) => (
                      <p
                        key={size._id}
                        className="border border-gray-500 px-2 cursor-pointer"
                      >
                        {size.name}
                      </p>
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
                className="bg-[#d4af5e] flex gap-2 items-center text-white px-6 py-2 hover:bg-[#d4af50] focus:outline-none"
              >
                <Cart />
                Add to Cart
              </button>
              <button className="flex gap-2 items-center border border-[#121212] px-6 py-2 hover:bg-[#d4af50] hover:border-[#d4af50] hover:text-white focus:outline-none">
                Check out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
