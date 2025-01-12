"use client";
import { useProfile } from "../_components/useProfile";
import Link from "next/link";
import Right from "../_components/icons/Right";
import { useEffect, useState } from "react";
import Image from "next/image";
import withAdminAuth from "../_components/withAdminAuth";
import AdminTabs from "../_components/layout/AdminTabs";
import Spinner from "../_components/layout/Spinner";

function ProductsPage() {
  const { loading, status, isAdmin } = useProfile();
  const [ProductItems, setProductItems] = useState([]);

  useEffect(() => {
    const fetchProductItems = async () => {
      if (status === "unauthenticated") {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProductItems(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductItems();

    return () => {
      setProductItems([]);
    };
  }, [status]);
  if (loading || status === "loading") {
    return (
      <div className="w-full h-screen flex items-center justify-center overflow-hidden">
        <Spinner />
      </div>
    );
  }
  if (isAdmin === null) return null;

  return (
    <section className="mt-24 max-w-2xl mx-auto">
      <AdminTabs />
      <div className="mt-8 p-4">
        <Link
          className="button flex items-center justify-center gap-2"
          href="/products/new"
        >
          Neu hinzufügen
          <Right />
        </Link>
      </div>
      <div className="p-4">
        <h2 className="text-sm text-gray-500 mt-8">Produkt bearbeiten:</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 md:justify-center gap-6 mt-10 mb-12 px-5">
          {ProductItems?.length > 0 &&
            ProductItems.map((item, index) => (
              <Link
                key={`${item._id}-${index}`}
                href={"/products/edit/" + item._id}
                className="flex flex-col justify-center items-center bg-gray-200 rounded-lg p-4"
              >
                <div className="relative flex justify-center">
                  <Image
                    className="rounded-md"
                    src={item?.bannerImage || "/default-menu.png"}
                    alt={"product-image"}
                    width={200}
                    height={200}
                  />
                </div>
                <div className="text-center">{item?.name}</div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}

export default withAdminAuth(ProductsPage);
