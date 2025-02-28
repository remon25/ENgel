"use client";
import { useContext, useEffect, useState } from "react";
import { cartContext } from "../_components/AppContext";
import { cartProductPrice } from "../_components/AppContext";
import { useProfile } from "../_components/useProfile";
import AddressInputs from "../_components/layout/AdressInputs";
import toast from "react-hot-toast";
import ChevronRight from "../_components/icons/ChevronRight";
import Dialog from "../_components/Dialog";
import CartProduct from "../_components/menu/CartProduct";
import {
  PayPalScriptProvider,
  PayPalButtons,
  FUNDING,
} from "@paypal/react-paypal-js";
import Paypal from "../_components/icons/Paypal";
import Credit from "../_components/icons/Credit";
import Check from "../_components/icons/Check";
import Cart from "../_components/icons/Cart";
import Spinner from "../_components/layout/Spinner";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CartPage() {
  const { cartProducts, removeCartProduct, orderType } =
    useContext(cartContext);
  const [address, setAddress] = useState({});
  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
  } = useProfile();
  const [deliveryPrices, setDeliveryPrices] = useState({});
  const [deliveryPrice, setDeliveryPrice] = useState(undefined);
  const [loadingDeliveryPrices, setLoadingDeliveryPrices] = useState(true);
  const [finalTotalPrice, setFinalTotalPrice] = useState(0);
  const [timeOptions, setTimeOptions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit");
  const [reachMinimumOreder, setReachMinimumOreder] = useState(true);
  const [loading, setLoading] = useState(true);
  const { session } = useSession();
  const [minimumOrder, setMinimumOrder] = useState(undefined);
  const [disabled, setDisabled] = useState(false);
  const [insideGermany, setInsideGermany] = useState(false);

  let totalPrice = 0;
  for (const p of cartProducts) {
    totalPrice += cartProductPrice(p) * (p?.quantity || 1);
  }

  useEffect(() => {
    if (profileLoading || !cartProducts || session) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [profileLoading, cartProducts, session]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.href.includes("canceled=1")) {
        toast.error("Zahlung fehlgeschlagen!");
      }
    }
  }, []);

  useEffect(() => {
    const fetchDeliveryPrices = async () => {
      try {
        const response = await fetch("/api/delivery-prices");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        const prices = {};
        data.forEach((price) => (prices[price.name] = price.price));
        setDeliveryPrices(prices);
        setLoadingDeliveryPrices(false);
      } catch (error) {
        console.error("Error fetching");
      }
    };
    fetchDeliveryPrices();
  }, []);

  useEffect(() => {
    const containsGermany = insideGermany;
    const calculateFinalPrice = () => {
      const deliveryPrice = containsGermany
        ? deliveryPrices.germany
        : deliveryPrices.other;
      setDeliveryPrice(deliveryPrice);

      if (deliveryPrices !== undefined) {
        setFinalTotalPrice(totalPrice + deliveryPrice);
      } else {
        setFinalTotalPrice("");
      }
    };
    calculateFinalPrice();
  }, [
    totalPrice,
    address.city,
    deliveryPrices,
    address.streetAdress,
    insideGermany,
  ]);

  useEffect(() => {
    if (profileData) {
      const { phone, streetAdress, name, email } = profileData;
      const addressFromProfile = {
        phone,
        streetAdress,
        email,
        name,
      };
      setAddress({ ...addressFromProfile });
    }
  }, [profileData]);

  console.log(reachMinimumOreder, "ordermini");

  function handleAddressChange(propName, value) {
    setAddress((prevAddress) => ({ ...prevAddress, [propName]: value }));
  }

  const requiredFields = ["name", "email", "phone", "streetAdress"];

  const pickupRequiredFields = ["name", "email", "phone"];

  const isComplete =
    orderType === "delivery"
      ? requiredFields.every((field) => address[field])
      : pickupRequiredFields.every((field) => address[field]);
  console.log(isComplete);

  async function proceedToCheckout(ev) {
    ev.preventDefault();
    if (!isComplete) {
      toast.error(
        "Bitte vervollständige alle Adressfelder, bevor du fortfährst."
      );
      return;
    }
    const promise = new Promise((resolve, reject) => {
      setDisabled(true);
      fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartProducts,
          address,
          subtotal: totalPrice,
          deliveryPrice: deliveryPrice,
          orderType,
        }),
      }).then(async (response) => {
        if (response.ok) {
          resolve();
          window.location = await response.json();
        } else {
          reject();
          setDisabled(false);
        }
      });
    });

    await toast.promise(promise, {
      loading: "Bestellung wird erstellt...",
      success: "Weiterleitung zur Zahlung...",
      error: "Etwas ist schiefgelaufen! Bitte versuche es erneut.",
    });
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  console.log(cartProducts);

  if (cartProducts?.length === 0) {
    return (
      <section className="mt-24 text-center">
        <div className="text-center">
          <h2 className="text-gray-950 font-bold text-4xl">Kasse</h2>
        </div>
        <div className="flex flex-col items-center gap-8">
          <p className="mt-4">Keine Produkte in deinem Warenkorb!</p>
          <Cart className="w-16 h-16" />
        </div>
      </section>
    );
  }
  return (
    <section className="mt-10 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-gray-950 font-bold text-4xl">Kasse</h2>
      </div>
      <div className="grid md:grid-cols-1 gap-4 mt-8">
        <div className="bg-gray-100 p-4 rounded-lg">
          <form onSubmit={proceedToCheckout}>
            <AddressInputs
              addressProps={address}
              setAddressProp={handleAddressChange}
              deliveryPrices={deliveryPrices}
              timeOptions={timeOptions}
              selectedPaymentMethod={selectedPaymentMethod}
              orderType={orderType}
              disabled={disabled}
              setInsideGermany={setInsideGermany}
            />
            <div className="w-full">
              <button
                disabled={disabled}
                type="button"
                className={`button flex justify-between items-center my-4 ${
                  disabled ? "cursor-not-allowed" : ""
                }`}
                onClick={() => setShowPopup(true)}
              >
                <div className="flex items-center gap-4">
                  {selectedPaymentMethod === "paypal" && <Paypal />}
                  {selectedPaymentMethod === "credit" && <Credit />}
                  <div>
                    <h3 className="text-sm sm:text-xl text-left text-gray-900 font-semibold">
                      Zahlung abschließen mit
                    </h3>
                    <div className="text-left">{selectedPaymentMethod}</div>
                  </div>
                </div>
                <ChevronRight />
              </button>
              {showPopup && (
                <>
                  <Dialog setShowPopup={setShowPopup}>
                    <h3>Zahlungsmethoden</h3>
                    <button
                      type="button"
                      className="button flex justify-between items-center my-4 !py-5"
                      onClick={() => setSelectedPaymentMethod("credit")}
                    >
                      <div className="flex items-center gap-4">
                        <Credit />
                        <div>
                          <h3 className="text-xl text-left text-gray-900 font-semibold">
                            Kreditkarte
                          </h3>
                          <div className="text-left"></div>
                        </div>
                      </div>
                      {selectedPaymentMethod === "credit" && <Check />}
                    </button>

                    <button
                      type="button"
                      className="button flex justify-between items-center my-4 !py-5"
                      onClick={() => setSelectedPaymentMethod("paypal")}
                    >
                      <div className="h-full flex items-center gap-4">
                        <Paypal />
                        <div>
                          <h3 className="text-xl text-left text-gray-900 font-semibold">
                            Paypal
                          </h3>
                          <div className="text-left"></div>
                        </div>
                      </div>
                      {selectedPaymentMethod === "paypal" && <Check />}
                    </button>
                  </Dialog>
                </>
              )}
            </div>
            {orderType === "delivery" && (
              <div>
                {reachMinimumOreder ? (
                  selectedPaymentMethod === "credit" ? (
                    <button
                      disabled={!isComplete || disabled}
                      className="button"
                      type="submit"
                    >
                      Bestellen & Bezahlen{" "}
                      {finalTotalPrice && finalTotalPrice + " €"}
                    </button>
                  ) : selectedPaymentMethod === "paypal" ? (
                    <div className="relatie z-1 mt-4">
                      {!loadingDeliveryPrices && (
                        <div className="relative">
                          <button
                            disabled={!isComplete || disabled}
                            type="button"
                            className="button Dialog_button"
                          >
                            Bestellen & Bezahlen{" "}
                            {finalTotalPrice && finalTotalPrice + " €"}
                          </button>
                          <div className="absolute top-0 right-0 left-0 bottom-0 opacity-0">
                            {isComplete && (
                              <PayPalScriptProvider
                                options={{
                                  "client-id":
                                    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                                  currency: "EUR",
                                }}
                              >
                                <PayPalButtons
                                  forceReRender={[finalTotalPrice, address]}
                                  disabled={
                                    !isComplete ||
                                    loadingDeliveryPrices ||
                                    !finalTotalPrice ||
                                    disabled
                                  }
                                  fundingSource={FUNDING.PAYPAL}
                                  style={{ layout: "vertical", color: "blue" }}
                                  createOrder={async () => {
                                    const res = await fetch("api/paypal", {
                                      method: "POST",
                                      body: JSON.stringify({
                                        cartProducts,
                                        address,
                                        subtotal: totalPrice,
                                        deliveryPrice: deliveryPrice,
                                        orderType,
                                      }),
                                    });
                                    const order = await res.json();
                                    return order.paypalOrderId;
                                  }}
                                  onApprove={async (data) => {
                                    try {
                                      const res = await fetch("/api/capture", {
                                        method: "POST",
                                        body: JSON.stringify({
                                          paypalOrderId: data.orderID,
                                        }),
                                      });
                                      const result = await res.json();

                                      if (res.ok) {
                                        // Redirect to success URL
                                        toast.success("Zahlung erfolgreich");
                                        window.location.href =
                                          result.successUrl;
                                      } else {
                                        throw new Error(
                                          result.message ||
                                            "Error capturing order"
                                        );
                                      }
                                    } catch (error) {
                                      toast.error("Error capturing payment");
                                      console.error(error);
                                    }
                                  }}
                                  onCancel={(data) => {}}
                                  onError={() =>
                                    toast.error("PayPal-Zahlung fehlgeschlagen")
                                  }
                                />
                              </PayPalScriptProvider>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4">
                      <button
                        disabled={!isComplete || disabled}
                        onClick={handlePayOnDelivery}
                        type="button"
                        className="button Dialog_button"
                      >
                        Bestellen & Bezahlen{" "}
                        {finalTotalPrice && finalTotalPrice + " €"}
                      </button>
                    </div>
                  )
                ) : (
                  <p className="text-center text-sm text-gray-800 bg-orange-100 rounded-[5px] p-2 mt-4">
                    {!minimumOrder && !address.city && (
                      <span className="text-xs">
                        Hängt von Ihrer Adresse ab
                      </span>
                    )}
                    {minimumOrder && address.city && (
                      <span>
                        Mindestbestellwert für Ihre Stadt beträgt <br />
                        <span className="font-semibold">
                          {minimumOrder} €
                        </span>{" "}
                        <br />
                        <Link
                          href="/"
                          className="text-primary font-semibold flex justify-center items-center transition-all gap-2 hover:gap-3"
                        >
                          <ChevronRight className="w-4 h-4 rotate-180" />
                          Zurück zum Menü
                        </Link>
                      </span>
                    )}
                  </p>
                )}
              </div>
            )}
          </form>
        </div>
        <div className="p-3">
          {cartProducts?.length > 0 &&
            cartProducts.map((product, index) => (
              <CartProduct
                disabled={disabled}
                key={`${product._id}-${index}`}
                product={product}
                onRemove={removeCartProduct}
                index={index}
                quantity={product.quantity || 1}
              />
            ))}

          {orderType === "delivery" ? (
            <>
              <div className="py-1 px-2 flex justify-end items-center">
                <div className="text-gray-500">
                  Zwischensumme : &nbsp; <br /> Lieferung : <br /> Gesamt :
                  &nbsp;
                </div>
                <div className="font-semibold">
                  {totalPrice} € <br />
                  {deliveryPrice === 0 ? (
                    "kostenlos"
                  ) : deliveryPrice == undefined ? (
                    <span className="text-gray-500 text-[0.6rem]">
                      Hängt von Ihrer Adresse ab
                    </span>
                  ) : (
                    deliveryPrice + " €"
                  )}
                  <br />
                  {totalPrice + (deliveryPrice || 0)} €
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="py-1 px-2">
                <div>
                  Zwischensumme:{" "}
                  <span className="font-semibold text-black">
                    {totalPrice} €
                  </span>
                </div>
                <div>
                  Gesamt :{" "}
                  <span className="font-semibold text-black">
                    {totalPrice} €
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
