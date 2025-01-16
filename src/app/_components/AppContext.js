"use client";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
import { createContext } from "react";
import toast from "react-hot-toast";

export const cartContext = createContext({});

export function cartProductPrice(cartProduct) {
  let price = cartProduct.price;
  if (cartProduct.size) {
    price += cartProduct.size.price;
  }
  if (cartProduct.extras?.length > 0) {
    for (const extra of cartProduct.extras) {
      price += extra.price;
    }
  }
  return price;
}

function calculateTotal(cartProducts) {
  return cartProducts.reduce((total, cartProduct) => {
    const productPrice = cartProductPrice(cartProduct);
    return total + productPrice * cartProduct.quantity;
  }, 0);
}

export default function AppProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [orderType, setOrderType] = useState("delivery");
  const [showSidebarContext, setShowSidebarContext] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedCart = window.localStorage.getItem("cart");
      if (storedCart) {
        setCartProducts(JSON.parse(storedCart));
      }
      const storedOrderType = window.localStorage.getItem("orderType");
      if (storedOrderType) {
        setOrderType(storedOrderType);
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      window.localStorage.setItem("orderType", orderType);
    }
  }, [orderType, isClient]);

  function clearCart() {
    setCartProducts([]);
    saveCartProductsToLocalStorage([]);
  }

  function removeCartProduct(index) {
    setCartProducts((prev) => {
      const newProducts = prev.filter((_, i) => i !== index);
      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
    toast.success("Product removed");
  }

  function saveCartProductsToLocalStorage(cartProducts) {
    if (isClient) {
      window.localStorage.setItem("cart", JSON.stringify(cartProducts));
    }
  }

  function addToCart(product, size = null, extras = [], quantity = 1) {
    setCartProducts((prev) => {
      const existingProductIndex = prev.findIndex(
        (cartProduct) =>
          cartProduct._id === product._id &&
          cartProduct.size?._id === size?._id &&
          JSON.stringify(cartProduct.extras) === JSON.stringify(extras)
      );

      if (existingProductIndex >= 0) {
        const updatedProducts = [...prev];
        updatedProducts[existingProductIndex] = {
          ...updatedProducts[existingProductIndex],
          quantity: updatedProducts[existingProductIndex].quantity + quantity,
        };
        saveCartProductsToLocalStorage(updatedProducts);
        return updatedProducts;
      } else {
        const newProduct = { ...product, size, extras, quantity };
        const newProducts = [...prev, newProduct];
        saveCartProductsToLocalStorage(newProducts);
        return newProducts;
      }
    });

    toast.success("Product added to cart!");
  }

  const totalCost = calculateTotal(cartProducts);

  return (
    <SessionProvider>
      <cartContext.Provider
        value={{
          cartProducts,
          setCartProducts,
          addToCart,
          removeCartProduct,
          clearCart,
          orderType,
          setOrderType,
          showSidebarContext,
          setShowSidebarContext,
          totalCost,
        }}
      >
        {children}
      </cartContext.Provider>
    </SessionProvider>
  );
}
