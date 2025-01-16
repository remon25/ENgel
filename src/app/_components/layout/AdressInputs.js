"use client";
import { useState } from "react";
import Paypal from "../icons/Paypal";
import Credit from "../icons/Credit";
import Address from "@/app/_components/Address";

export default function AddressInputs({
  addressProps,
  setAddressProp,
  deliveryPrices,
  disabled = false,
  orderPage = false,
  orderType,
  setInsideGermany,
}) {
  const { phone, streetAdress, name, email, paymentMethod } = addressProps;

  const cities = Object.keys(deliveryPrices || []);
  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#d4af5e] to-[#fff] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>
      <label>Name und Nachname</label>
      <input
        disabled={disabled}
        type="text"
        placeholder="Name und Nachname"
        value={name || ""}
        onChange={(ev) => setAddressProp("name", ev.target.value)}
      />
      <label>E-Mail</label>
      <input
        disabled={disabled}
        type="email"
        placeholder="E-Mail"
        value={email || ""}
        onChange={(ev) => setAddressProp("email", ev.target.value)}
      />
      <label>Telefon</label>
      <input
        disabled={disabled}
        type="tel"
        placeholder="Telefonnummer"
        value={phone || ""}
        onChange={(ev) => setAddressProp("phone", ev.target.value)}
      />
      {!orderPage && (
        <div className="mb-8">
          <Address
            setAddressProp={setAddressProp}
            setInsideGermany={setInsideGermany}
          />
        </div>
      )}
      {orderPage && (
        <div className="mb-8">
          <label htmlFor="address">Adresse</label>
          <input
            disabled
            value={addressProps?.streetAdress || ""}
            id="address"
            type="text"
            placeholder="Adresse"
            className="input-address"
          />
        </div>
      )}
      <div className={`${orderType === "delivery" ? "-mt-4" : "mt-0"} w-full`}>
        {orderPage && (
          <>
            <button
              type="button"
              disabled
              className="button flex justify-between items-center my-4 !py-5"
            >
              <div className="flex items-center gap-4">
                {paymentMethod === "paypal" ? <Paypal /> : <Credit />}
                <div>
                  <p className="text-xs">Ausgewählte Zahlungsmethode</p>
                  <h3 className="text-xl text-left text-gray-900 font-semibold">
                    {paymentMethod === "paypal" ? "PayPal" : "Kreditkarte"}
                  </h3>
                </div>
              </div>
            </button>
          </>
        )}
      </div>
    </>
  );
}
