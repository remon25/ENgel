"use client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ProductForm from "../../../_components/layout/ProductForm";
import { useProfile } from "../../../_components/useProfile";
import { useEffect, useState } from "react";
import DeleteButton from "../../../_components/DeleteButton";
import toast from "react-hot-toast";
import Link from "next/link";
import Left from "../../../_components/icons/Left";
import withAdminAuth from "@/app/_components/withAdminAuth";
import AdminTabs from "@/app/_components/layout/AdminTabs";
import Spinner from "@/app/_components/layout/Spinner";

function EditProductPage() {
  const params = useParams();
  const { isAdmin, loading: profileLoading, status } = useProfile();
  const [productItem, setProductItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true); // Set loading state to true when fetching starts
    fetch(`/api/products/`)
      .then((response) => response.json())
      .then((items) => {
        const item = items.find((i) => i._id === params.id);
        if (item) {
          setProductItem(item);
        }
        setLoading(false); // Set loading to false after fetching is done
      })
      .catch(() => setLoading(false)); // Ensure loading state is updated even if an error occurs
  }, [params.id]);

  async function handleFormSubmit(e, data) {
    e.preventDefault();
    data = { ...data, _id: params.id };
    try {
      await toast.promise(
        fetch("/api/products", {
          method: "PUT",
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
          loading: "Produkt wird gespeichert...",
          success: "Produkt erfolgreich gespeichert!",
          error: "Fehler beim Speichern des Produkts!",
        }
      );
    } catch (error) {
      console.error("Error saving product:", error);
    }
  }

  async function handleDelete(_id) {
    try {
      await toast.promise(
        fetch("/api/products/?_id=" + _id, {
          method: "DELETE",
        }),
        {
          loading: "Produkt wird gelöscht...",
          success: "Produkt erfolgreich gelöscht!",
          error: "Fehler beim Löschen des Produkts!",
        }
      );

      router.push("/products");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  if (profileLoading || status === "loading" || loading) {
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
          <span>
            <span>Alle Produkte anzeigen</span>
          </span>
        </Link>
      </div>
      {productItem ? (
        <ProductForm
          handleFormSubmit={handleFormSubmit}
          productItem={productItem}
          editForm={true}
        />
      ) : (
        <p>Keine Produkte gefunden</p>
      )}
      <div className="md:max-w-2xl mx-auto px-4">
        <div className="md:max-w-[31rem] ml-auto">
          <DeleteButton
            label="Löschen"
            onDelete={() => handleDelete(productItem._id)}
          />
        </div>
      </div>
    </section>
  );
}

export default withAdminAuth(EditProductPage);
