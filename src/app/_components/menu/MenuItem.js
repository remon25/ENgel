"use client";
import { useContext, useEffect, useState } from "react";
import { cartContext } from "../AppContext";
import toast from "react-hot-toast";
import Image from "next/image";
import Cart from "../icons/Cart";
import Link from "next/link";

export default function MenuItem({ menuItemInfo, category }) {
  const { name, bannerImage, price, beforeSalePrice, sizes, _id } =
    menuItemInfo;

  const highestPrice = sizes.reduce(
    (max, item) => Math.max(max, item.price),
    0
  );

  return (
    <>
      <div className="w-60 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl menu-items-container">
        <Link className="menu-item-link" href={`/products/${_id}`}>
          <div className="bg-[#fff]">
            <Image
              width={250}
              height={250}
              src={bannerImage || "/default-menu.png"}
              alt="Product"
              className="h-60 w-60 object-cover rounded-t-xl"
            />
          </div>
          <div className="px-4 py-3 w-60 menu-item-details w-full">
            <p className="menu-item-name text-lg font-bold text-black block capitalize break-words text-left">
              {name}
            </p>
            <span className="text-gray-400 mr-3 uppercase text-xs text-left block mt-1">
              {category || ""}
            </span>

            <div className="menu-item-prices flex items-center">
              <p className="text-lg font-semibold text-black cursor-auto my-3">
                <span className="text-gray-500 mr-3 uppercase text-xs">ab</span>{" "}
                {price} €
              </p>

              <div className="menu-item-icon ml-auto">
                <button
                  className="relative text-[12px] px-3 py-2 bg-[#e7be4a]  text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{
                    borderRadius: "9px 10px 10px 42px",
                  }}
                >
                  Jetzt shoppen
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
