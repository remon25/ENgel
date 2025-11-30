"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import withAdminAuth from "../_components/withAdminAuth";

function Layout({ children }) {
  const path = usePathname();
  const [showAdminSide, setShowAdminSide] = useState(false);

  return (
    <div className="relative">
      <div
        onClick={() => setShowAdminSide((showAdminSide) => !showAdminSide)}
        className="absolute right-[10px] top-[-25px] w-[40px] h-[40px] bg-gray-300 hidden show-admin-side p-2 rounded-[50%] cursor-pointer"
      >
        <Image src={"/menu-bar.svg"} alt="menu-bar" width={30} height={30} />
      </div>
      <div className="w-[95dvw] min-h-dvh bg-gray-200 grid grid-cols-7 admin_dashboard">
        {/* SideBar */}
        <div
          className={`col-span-1 bg-white admin_dashboard_side ${
            showAdminSide ? "show-side" : "hide-side"
          }`}
        >
          <div className="p-2 h-full w-full flex flex-col bg-white dark:bg-gray-900 border-r border-r-gray-300">
            {/* Logo */}
            <a href="#">
              <div className="flex justify-center items-center gap-2 py-2 px-0 md:px-2 lg:px-4 cursor-pointer">
                <h2 className="text-center font-semibold border-b border-gray-500 uppercase my-5">
                  Admin-Dashboard
                </h2>
              </div>
            </a>

            <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden flex-grow pt-2 justify-between">
              <div className="flex flex-col space-y-1 lg:mt-1">
                <Link
                  onClick={() => setShowAdminSide(false)}
                  className={`${
                    path === "/dashboard"
                      ? "border border-gray-700 rounded-[5px]"
                      : ""
                  } flex items-center gap-2 font-semibold text-gray-800 hover:text-primary-400 cursor-pointer text-sm ml-3 h-12 p-2`}
                  href="/dashboard"
                >
                  <Image
                    width={30}
                    height={30}
                    alt="profile icon"
                    src={"/dashboard.svg"}
                  />
                  <span>Dashboard</span>
                </Link>
                <Link
                  onClick={() => setShowAdminSide(false)}
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
                  <span>Profil</span>
                </Link>
                <Link
                  onClick={() => setShowAdminSide(false)}
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
                  <span> Kategorien</span>
                </Link>
                <Link
                  onClick={() => setShowAdminSide(false)}
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
                  <span>Produkte</span>
                </Link>
                <Link
                  onClick={() => setShowAdminSide(false)}
                  className={`${
                    path === "/dashboard/users"
                      ? "border border-gray-700 rounded-[5px]"
                      : ""
                  } flex items-center gap-2 font-semibold text-gray-500 hover:text-primary-400 cursor-pointer text-sm ml-3 h-12 p-2`}
                  href="/dashboard/users"
                >
                  <Image
                    width={30}
                    height={30}
                    alt="avatar"
                    src={"/users.svg"}
                  />
                  <span>Benutzer</span>
                </Link>
                <Link
                  onClick={() => setShowAdminSide(false)}
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
                  <span>Bestellungen</span>
                </Link>
                <Link
                  onClick={() => setShowAdminSide(false)}
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
                  <span> Lieferung</span>
                </Link>
                <Link
                  onClick={() => setShowAdminSide(false)}
                  className={`${
                    path === "/dashboard/subscribers"
                      ? "border border-gray-700 rounded-[5px]"
                      : ""
                  } flex items-center gap-2 font-semibold text-gray-500 hover:text-primary-400 cursor-pointer text-sm ml-3 h-12 p-2`}
                  href="/dashboard/subscribers"
                >
                  <Image
                    width={30}
                    height={30}
                    alt="subscribers icon"
                    src={"/subscribers.svg"}
                  />
                  <span>Abonnenten</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-6 p-6 bg-white admin_dashboard_main">
          {children}
        </div>
      </div>
    </div>
  );
}

export default withAdminAuth(Layout);
