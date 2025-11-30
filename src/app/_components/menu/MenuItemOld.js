"use client";
import { useContext, useEffect, useState } from "react";
import { cartContext } from "../AppContext";
import toast from "react-hot-toast";
import Image from "next/image";
import Cart from "../icons/Cart";
import Link from "next/link";

export default function MenuItemOld({ menuItemInfo, category }) {
  const { name, bannerImage, price, beforeSalePrice, sizes, _id } =
    menuItemInfo;

  const highestPrice = sizes.reduce(
    (max, item) => Math.max(max, item.price),
    0
  );

  return (
    <>
      <div className="w-60 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl menu-items-container pb-2">
        <Link className="menu-item-link" href={`/products/${_id}`}>
          <div className="bg-[#eee]">
            <Image
              width={250}
              height={250}
              src={bannerImage || "/default-menu.png"}
              alt="Product"
              className="h-60 w-60 object-cover rounded-t-xl"
            />
          </div>
          <div className="px-4 py-4 w-60 menu-item-details">
            <span className="text-gray-400 mr-3 uppercase text-xs">
              {category || ""}
            </span>
            <p className="menu-item-name text-lg font-bold text-black block capitalize break-words">
              {name}
            </p>
            <div className="menu-item-prices flex items-center">
              <p className="text-lg font-semibold text-black cursor-auto my-3">
                <span className="text-gray-500 mr-3 uppercase text-xs">ab</span>{" "}
                {price} €
              </p>
              <del>
                <p className="text-sm text-gray-600 cursor-auto ml-2">
                  {beforeSalePrice &&
                    beforeSalePrice > 0 &&
                    beforeSalePrice + "€"}
                </p>
              </del>

              <div className="menu-item-icon ml-auto">
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
            <div className="text-sm text-gray-800">
              {highestPrice &&
                price + "€" + " - " + (highestPrice + price) + "€"}
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}