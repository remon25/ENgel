"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import withAdminAuth from "../_components/withAdminAuth";

function Layout({ children }) {
  const path = usePathname();

  return (
    <div className="w-[90dvw] h-dvh bg-gray-200 grid grid-cols-7">
      {/* SideBar */}
      <div className="col-span-1 bg-white">
        <div className="p-2 h-full w-full flex flex-col bg-white dark:bg-gray-900 border-r border-r-gray-200">
          {/* Logo */}
          <a href="#">
            <div className="flex justify-center lg:justify-start items-center gap-2 py-2 px-0 md:px-2 lg:px-4 cursor-pointer">
              <Image
                src={"/logo.png"}
                alt="Engel logo"
                width={50}
                height={50}
              />
            </div>
          </a>

          <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden flex-grow pt-2 justify-between">
            <div className="flex flex-col space-y-1 mx-1 lg:mt-1">
              <div className="px-5 pt-4 hidden lg:block">
                <div className="flex flex-row items-center">
                  <div className="text-xs font-bold tracking-wide text-gray-600">
                    Menu
                  </div>
                </div>
              </div>
              <Link
                className="flex flex-row items-center justify-center lg:justify-start rounded-md h-12 focus:outline-none pr-3.5 lg:pr-6 font-semibold text-gray-500 hover:text-primary-400 cursor-pointer"
                href="/dashboard"
              >
                <span className="inline-flex justify-center items-center ml-3.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.25rem"
                    height="1.25rem"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M10.894 22h2.212c3.447 0 5.17 0 6.345-1.012s1.419-2.705 1.906-6.093l.279-1.937c.38-2.637.57-3.956.029-5.083s-1.691-1.813-3.992-3.183l-1.385-.825C14.2 2.622 13.154 2 12 2s-2.199.622-4.288 1.867l-1.385.825c-2.3 1.37-3.451 2.056-3.992 3.183s-.35 2.446.03 5.083l.278 1.937c.487 3.388.731 5.081 1.906 6.093S7.447 22 10.894 22"
                      opacity=".5"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M12 0c.713 0 1.49.394 2.062 1.073l.623.804 1.397.837c1.754 1.053 2.607 1.574 3.452 2.27 1.17.851 2.455 1.623 3.053 2.794 1.163 2.369-.145 5.423-1.212 9.471L18.623 17.5a4.175 4.175 0 0 1-1.5.459l-1.684-.28c-.52-.217-.93-.47-1.228-.749-.315-.297-.594-.56-.826-.832-.54-.814-.978-1.658-1.576-2.283C12.3 13.221 9.226 13.449 9.226 13.449s-.232-2.548-.303-4.411C8.927 7.487 9.413 4.897 10.48 2.83c.623-1.062 1.338-2.012 1.52-2.492C11.671.394 11.923 0 12 0z"
                    ></path>
                  </svg>
                </span>
                <span className="inline-block text-sm ml-3">Dashboard</span>
              </Link>
              <Link
                className={`${
                  path === "/dashboard/profile"
                    ? "border border-gray-700 rounded-[5px]"
                    : ""
                } flex items-center gap-2 font-semibold text-gray-500 hover:text-primary-400 cursor-pointer text-sm ml-3 h-12 p-2`}
                href="/dashboard/profile"
              >
                <Image
                  width={30}
                  height={30}
                  alt="profile icon"
                  src={"/profile.svg"}
                />
                Profil
              </Link>
              <Link
                className={`${
                  path === "/dashboard/categories"
                    ? "border border-gray-700 rounded-[5px]"
                    : ""
                } flex items-center gap-2 font-semibold text-gray-500 hover:text-primary-400 cursor-pointer text-sm ml-3 h-12 p-2`}
                href="/dashboard/categories"
              >
                <Image
                  width={30}
                  height={30}
                  alt="avatar"
                  src={"/category.svg"}
                />
                Kategorien
              </Link>
              <Link
                className={`${
                  path === "/dashboard/products"
                    ? "border border-gray-700 rounded-[5px]"
                    : ""
                } flex items-center gap-2 font-semibold text-gray-500 hover:text-primary-400 cursor-pointer text-sm ml-3 h-12 p-2`}
                href="/dashboard/products"
              >
                <Image
                  width={30}
                  height={30}
                  alt="avatar"
                  src={"/product.svg"}
                />
                Produkte
              </Link>
              <Link
                className={`${
                  path === "/dashboard/users"
                    ? "border border-gray-700 rounded-[5px]"
                    : ""
                } flex items-center gap-2 font-semibold text-gray-500 hover:text-primary-400 cursor-pointer text-sm ml-3 h-12 p-2`}
                href="/dashboard/users"
              >
                <Image width={30} height={30} alt="avatar" src={"/users.svg"} />
                Benutzer
              </Link>
              <Link
                className={`${
                  path === "/dashboard/orders"
                    ? "border border-gray-700 rounded-[5px]"
                    : ""
                } flex items-center gap-2 font-semibold text-gray-500 hover:text-primary-400 cursor-pointer text-sm ml-3 h-12 p-2`}
                href="/dashboard/orders"
              >
                <Image
                  width={30}
                  height={30}
                  alt="avatar"
                  src={"/orders.svg"}
                />
                Bestellungen
              </Link>
              <Link
                className={`${
                  path === "/dashboard/delivery"
                    ? "border border-gray-700 rounded-[5px]"
                    : ""
                } flex items-center gap-2 font-semibold text-gray-500 hover:text-primary-400 cursor-pointer text-sm ml-3 h-12 p-2 `}
                href="/dashboard/delivery"
              >
                <Image
                  width={30}
                  height={30}
                  alt="avatar"
                  src={"/delivery.svg"}
                />
                Lieferung
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="col-span-6 p-6 bg-white">{children}</div>
    </div>
  );
}

export default withAdminAuth(Layout);
