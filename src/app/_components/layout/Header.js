"use client";
import { useState, useEffect, useContext, useRef } from "react";
import { cartContext } from "../AppContext";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Bars2 from "../icons/Bars2";
import Cart from "../icons/Cart";

// Simple Spinner Component
function Spinner({ size = "sm" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <svg
        className="w-full h-full text-primary"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
}

function AuthLinks({ status, userName, image, mobile = false }) {
  if (status === "authenticated") {
    return (
      <>
        <Link href={"/profile"} className="whitespace-nowrap">
          <div className="flex flex-col gap-1 items-center justify-center">
            {!mobile && (
              <Image
                src={image || "/avatar.svg"}
                alt={userName}
                className="rounded-[50%]"
                width={40}
                height={40}
              />
            )}
          </div>
        </Link>
        <button
          onClick={() => signOut()}
          className="bg-white rounded-[5px] text-primary px-4 py-2"
        >
          Abmelden
        </button>
      </>
    );
  }
  if (status === "unauthenticated") {
    return (
      <>
        <Link href={"/login"}>Anmelden</Link>
        <Link
          href={"/register"}
          className="bg-white rounded-[5px] text-primary px-4 py-2"
        >
          Registrieren
        </Link>
      </>
    );
  }
}

export default function Header() {
  const { showSidebarContext, setShowSidebarContext, cartProducts } =
    useContext(cartContext);

  const session = useSession();
  const status = session?.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [allDeliveryFree, setAllDeliveryFree] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [error, setError] = useState(false);
  const mobileMenuRef = useRef(null);

  if (userName && userName.includes(" ")) {
    userName = userName.split(" ")[0];
  }

  useEffect(() => {
    // Check if user is an admin
    async function checkAdmin() {
      try {
        setAdminLoading(true);
        const response = await fetch("/api/check-admin");
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      } finally {
        setAdminLoading(false);
      }
    }

    if (status === "authenticated") {
      checkAdmin();
    }
  }, [status]);

  useEffect(() => {
    // Fetch delivery prices
    async function fetchDeliveryPrices() {
      try {
        const response = await fetch("/api/delivery-prices");
        if (!response.ok) throw new Error("Failed to fetch delivery prices");
        const prices = await response.json();
        const allFree = prices.every((price) => price.price === 0);
        setAllDeliveryFree(allFree);
      } catch (error) {
        console.error("Error fetching delivery prices:", error);
      }
    }

    fetchDeliveryPrices();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/categories`);
        if (!response.ok) throw new Error("Failed to load data");

        const data = await response.json();

        if (!data || data.length === 0) {
          setError(true);
        } else {
          setCategories(data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError(true);
      }
    }

    fetchData();
  }, []);

  // Handle click outside to close mobile menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileNavOpen(false);
      }
    }

    if (mobileNavOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [mobileNavOpen]);

  return (
    <header
      id="header"
      className="fixed top-0 left-0 bg-gray-950 right-0 w-full z-20"
    >
      <div className="flex items-center lg:hidden justify-between px-8 py-2">
        <Link className="text-primary font-semibold text-2xl" href={"/"}>
          <Image src="/logo.png" alt="ENGEL logo" width={70} height={70} />
        </Link>
        <div className="flex gap-8 items-center">
          <div className="w-10 h-10 flex items-center justify-center">
            {!isAdmin && !adminLoading && (
              <Link href={"/profile"}>
                <Image
                  src={userData?.image || "/avatar.svg"}
                  alt={userName}
                  className="rounded-[50%]"
                  width={40}
                  height={40}
                />
              </Link>
            )}
            {adminLoading && <Spinner size="sm" />}
          </div>
          <button
            className="p-1 border"
            onClick={() => {
              setMobileNavOpen((prev) => {
                if (!prev) setShowSidebarContext(false);
                return !prev;
              });
            }}
          >
            <Bars2 />
          </button>
          <div
            id="cartButton"
            onClick={(e) => {
              e.preventDefault();
              setShowSidebarContext((prev) => {
                if (!prev) setMobileNavOpen(false);
                return !prev;
              });
            }}
            className="relative block"
          >
            {cartProducts.length > 0 && (
              <span className="absolute top-[-10px] right-[-10px] bg-[#d4af5e] w-5 h-5 flex items-center justify-center rounded-full text-sm">
                {cartProducts.length}
              </span>
            )}

            <Cart className="w-6 h-6 fill-white cursor-pointer" />
          </div>
        </div>
      </div>

      {mobileNavOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden top-0 p-4 bg-gray-950 text-white rounded-lg mt-2 flex flex-col gap-2 text-center"
        >
          <Link onClick={() => setMobileNavOpen(false)} href={"/"}>
            Startseite
          </Link>
          <Link onClick={() => setMobileNavOpen(false)} href={"/products/all"}>
            Alle Produkte
          </Link>
          <div className="relative inline-block text-left">
            <div>
              <button
                onClick={() => {
                  setShowDropDown((s) => !s);
                }}
                type="button"
                className="inline-flex w-full justify-center gap-x-1.5 rounded-md  px-3 py-2 text-sm font-semibold shadow-sm"
                id="menu-button"
                aria-expanded="true"
                aria-haspopup="true"
              >
                Kategorien
                <svg
                  className="-mr-1 size-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {showDropDown && (
              <div
                className="mt-2 w-full text-white text-center"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
              >
                <div className="py-1" role="none">
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/categories/${category._id}`}
                      className="block px-4 py-2 text-sm text-white"
                      role="menuitem"
                      tabIndex="-1"
                      id="menu-item-0"
                      onClick={() => {
                        setShowDropDown(false);
                        setMobileNavOpen(false);
                      }}
                    >
                      {category?.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link onClick={() => setMobileNavOpen(false)} href={"/about"}>
            Über uns
          </Link>
          <Link onClick={() => setMobileNavOpen(false)} href={"/contact"}>
            Kontakt
          </Link>
          {adminLoading ? (
            <div className="flex items-center justify-center py-4">
              <Spinner size="md" />
            </div>
          ) : isAdmin ? (
            <>
              <Link
                onClick={() => setMobileNavOpen(false)}
                href={"/dashboard"}
                className="flex items-center justify-center gap-2 bg-white rounded-[5px] text-primary text-center px-4 py-2"
              >
                <Image
                  width={20}
                  height={20}
                  alt="dashboard icon"
                  src={"/dashboard.svg"}
                />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setMobileNavOpen(false);
                }}
                className="bg-white rounded-[5px] text-primary px-4 py-2"
              >
                Abmelden
              </button>
            </>
          ) : (
            <div
              className="flex flex-col gap-2"
              onClick={() => setMobileNavOpen(false)}
            >
              <AuthLinks
                status={status}
                userName={userName}
                image={userData?.image}
              />
            </div>
          )}
        </div>
      )}

      <div className="hidden lg:flex items-center justify-between px-8 py-6">
        <nav className="flex items-center gap-8 text-white font-semibold">
          <Link className="text-primary font-semibold text-2xl" href={"/"}>
            <Image src="/logo.png" alt="ENGEL logo" width={70} height={70} />
          </Link>
          <Link href={"/"}>Startseite</Link>
          <Link href={"/products/all"}>Alle Produkte</Link>
          <div className="relative inline-block text-left">
            <div>
              <button
                onClick={() => {
                  setShowDropDown((s) => !s);
                }}
                type="button"
                className="inline-flex w-full justify-center gap-x-1.5 rounded-md  px-3 py-2 text-sm font-semibold shadow-sm"
                id="menu-button"
                aria-expanded="true"
                aria-haspopup="true"
              >
                Kategorien
                <svg
                  className="-mr-1 size-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {showDropDown && (
              <div
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
              >
                <div className="py-1" role="none">
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/categories/${category._id}`}
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex="-1"
                      id="menu-item-0"
                      onClick={() => setShowDropDown(false)}
                    >
                      {category?.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href={"/about"}>Über uns</Link>
          <Link href={"/contact"}>Kontakt</Link>
        </nav>
        <nav className="flex items-center gap-4 text-white font-semibold">
          <div className="flex items-center gap-4">
            {adminLoading ? (
              <Spinner size="md" />
            ) : isAdmin ? (
            <>
              <Link
                href={"/dashboard"}
                className="flex items-center text-[15px] gap-2 bg-white rounded-[5px] text-primary px-2 py-2"
              >
                <Image
                  width={20}
                  height={20}
                  alt="dashboard icon"
                  src={"/dashboard.svg"}
                />
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-white rounded-[5px] text-primary text-[15px] px-4 py-2"
              >
                Abmelden
              </button>
            </>
          ) : (
            <AuthLinks
              status={status}
              userName={userName}
              image={userData?.image}
            />
          )}
          </div>

          <div
            id="cartButton"
            onClick={(e) => {
              e.preventDefault();
              setShowSidebarContext((prev) => !prev);
            }}
            className="relative block"
          >
            {cartProducts.length > 0 && (
              <span className="absolute top-[-10px] right-[-10px] bg-[#d4af5e] w-5 h-5 flex items-center justify-center rounded-full text-sm">
                {cartProducts.length}
              </span>
            )}

            <Cart className="w-6 h-6 fill-white cursor-pointer" />
          </div>
        </nav>
      </div>
    </header>
  );
}