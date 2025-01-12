"use client";
import { useProfile } from "../../_components/useProfile";
import toast from "react-hot-toast";
import Link from "next/link";
import Left from "../../_components/icons/Left";
import ProductForm from "../../_components/layout/ProductForm";
import withAdminAuth from "@/app/_components/withAdminAuth";
import AdminTabs from "@/app/_components/layout/AdminTabs";
import Spinner from "@/app/_components/layout/Spinner";

function NewProductPage() {
  const { isAdmin, loading, status } = useProfile();

  async function handleFormSubmit(e, data) {
    e.preventDefault();

    try {
      await toast.promise(
        fetch("/api/products", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Failed to save");
          }
        }),
        {
          loading: "Speichern...",
          success: "Produkt gespeichert!",
          error: "Speichern des Produkts fehlgeschlagen!",
        }
      );

      // Clear fields logic has to be moved to `ProductForm` if needed.
    } catch (error) {
      console.error("Error saving product:", error);
    }
  }

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
      <div className="max-w-md mx-auto mt-8 p-4">
        <Link
          href={"/products"}
          className="button w-full flex justify-center gap-2"
        >
          <Left />
          <span>Alle Produkte anzeigen</span>
        </Link>
      </div>
      <ProductForm productItem={null} handleFormSubmit={handleFormSubmit} />
    </section>
  );
}


export default withAdminAuth(NewProductPage);
