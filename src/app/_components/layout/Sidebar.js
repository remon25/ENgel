"use client";
import React, { useContext, useEffect, useState, useRef } from "react";
import SectionHeader from "./SectionHeader";
import CartProduct from "../menu/CartProduct";
import { cartContext, cartProductPrice } from "../AppContext";
import Cart from "../icons/Cart";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Spinner from "./Spinner";
import { useProfile } from "../useProfile";

export default function Sidebar() {
  const {
    cartProducts,
    removeCartProduct,
    orderType,
    showSidebarContext,
    totalCost,
    setShowSidebarContext,
  } = useContext(cartContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const sidebarRef = useRef(null); // Reference for the sidebar
  const [loading, setLoading] = useState(true);
  const [deliveryPrices, setDeliveryPrices] = useState([]);
  const [myDeliveryPrice, setMyDeliveryPrice] = useState(undefined);
  const [loadingDeliveryPrices, setLoadingDeliveryPrices] = useState(true);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [reachMinimumOreder, setReachMinimumOreder] = useState(false);
  let totalPrice = 0;
  let minimumOrder;

  const pathname = usePathname();
  const {
    data: profileData = null,
    loading: profileLoading,
    error: profileError,
  } = useProfile();

  for (const p of cartProducts) {
    totalPrice += cartProductPrice(p);
  }

  useEffect(() => {
    const headerHeight = document.getElementById("header").scrollHeight;
    setIsScrolled(window.scrollY > headerHeight);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > headerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (cartProducts !== undefined) {
      setLoading(false);
    }
  }, [cartProducts]);

  useEffect(() => {
    const fetchDeliveryPrices = async () => {
      try {
        const response = await fetch("/api/delivery-prices");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();

        const prices = {};
        data.forEach((price) => (prices[price.name] = price.price));
        setDeliveryPrices(data);
        if (profileData?.city) {
          const deliveryPrice = prices[profileData.city];
          const isFree = data.find(
            (price) => price.name === profileData.city
          )?.isFreeDelivery;
          setMyDeliveryPrice(deliveryPrice);
          setFreeDelivery(isFree || false);
        }
      } catch (error) {
        console.error("Error fetching delivery prices", error);
      } finally {
        setLoadingDeliveryPrices(false);
      }
    };

    if (profileData?.city) {
      fetchDeliveryPrices();
    } else {
      setLoadingDeliveryPrices(false);
    }
  }, [profileData?.city]);

  minimumOrder = deliveryPrices.find(
    (c) => c.name === profileData?.city
  )?.minimumOrder;

  useEffect(() => {
    if (
      totalPrice >=
      deliveryPrices.find((c) => c.name === profileData?.city)?.minimumOrder
    ) {
      setReachMinimumOreder(true);
    } else {
      setReachMinimumOreder(false);
    }
  }, [profileData?.city, deliveryPrices, totalPrice]);

  // Click outside logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest("#cartButton") // Ensure it doesn't close on button click
      ) {
        setShowSidebarContext(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowSidebarContext]);

  const handleClickInside = (e) => {
    e.stopPropagation();
  };

  if (loading || loadingDeliveryPrices) {
    return (
      <aside
        id="sidebar"
        className={`sidebar ${
          showSidebarContext ? "translate-x-0" : "translate-x-full"
        } fixed top-0 bottom-0 right-0 h-screen w-[330px] z-[12] px-6 ${
          isScrolled ? "pt-1" : "pt-20"
        } flex flex-col justify-center items-center bg-white transition-all`}
      >
        <Spinner />
      </aside>
    );
  }
  return (
    <aside
      ref={sidebarRef}
      id="sidebar"
      onClick={handleClickInside}
      className={`sidebar ${
        showSidebarContext ? "translate-x-0" : "translate-x-full"
      } fixed top-0 bottom-0 right-0 h-screen w-[330px] z-[12] px-6 ${
        isScrolled ? "pt-1" : "pt-[11rem]"
      } flex flex-col bg-white transition-all`}
    >
      <div className="text-center">
        <SectionHeader subtitle={"Warenkorb"} />
      </div>

      {cartProducts?.length !== 0 ? (
        <div className="relative grid md:grid-cols-1 gap-4 mt-8 overflow-auto">
          <div>
            {cartProducts?.length > 0 &&
              cartProducts.map((product, index) => (
                <CartProduct
                  key={`${product._id}-${index}`}
                  product={product}
                  onRemove={removeCartProduct}
                  index={index}
                  quantity={product.quantity}
                />
              ))}
            <div className="flex flex-col items-start">
              <div className="py-1 flex justify-end items-center">
                <div className="text-gray-500">Zwischensumme : &nbsp; </div>
                <div className="font-semibold"> {totalCost} €</div>
              </div>
              {myDeliveryPrice !== undefined && (
                <>
                  {orderType == "delivery" && (
                    <div className="py-1 flex justify-end items-center">
                      <>
                        <div className="text-gray-500">Lieferung : &nbsp; </div>
                        <div className="font-semibold">
                          {freeDelivery ? "Kostenlos" : myDeliveryPrice + " €"}
                        </div>
                      </>
                    </div>
                  )}
                  <div className="py-1 flex justify-end items-center">
                    <div className="text-gray-500">Gesamt : &nbsp; </div>
                    {orderType == "delivery" && (
                      <div className="font-semibold">
                        {totalCost + (freeDelivery ? 0 : myDeliveryPrice)} €
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {(reachMinimumOreder ||
            !profileData?.city ||
            orderType == "pickup") && (
            <Link className="mb-20" href={"/cart"}>
              <button onClick={() => setShowSidebarContext(false)} type="button" className="mt-6 sidebar_button button">
                Zur Kasse gehen
              </button>
            </Link>
          )}
          {!reachMinimumOreder &&
            profileData?.city &&
            orderType != "pickup" && (
              <>
                <button
                  type="button"
                  className="mt-6 sidebar_button button opacity-50 cursor-not-allowed"
                  disabled
                >
                  Zur Kasse gehen
                </button>
                <p className="text-center text-sm text-gray-800 bg-orange-100 rounded-[5px] p-2 mt-4">
                  Mindestbestellwert für Ihre Stadt beträgt <br />
                  <span className="font-semibold">{minimumOrder} €</span>
                </p>
              </>
            )}
        </div>
      ) : (
        <div className="text-center grow flex flex-col items-center justify-center">
          <Cart className="text-gray-900 w-10 h-10" />
          <h3 className="text-2xl text-gray-800 font-semibold">
            Fülle deinen Warenkorb
          </h3>
          <p className="text-gray-700 text-lg"> Dein Warenkorb ist leer</p>
        </div>
      )}
    </aside>
  );
}
