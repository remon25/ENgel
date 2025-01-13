"use client";
import { useState, useEffect } from "react";
import Spinner from "@/app/_components/layout/Spinner";
import { useProfile } from "@/app/_components/useProfile";
import { toast } from "react-hot-toast";
import withAdminAuth from "@/app/_components/withAdminAuth";
import ChevronDown from "@/app/_components/icons/ChevronDown";
import ChevronUp from "@/app/_components/icons/ChevronUp";
import DeleteButton from "@/app/_components/DeleteButton";

function DeliveryPage() {
  const { loading, status, isAdmin } = useProfile();
  const [deliveryPrices, setDeliveryPrices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [editingPrice, setEditingPrice] = useState(null);
  const [updatedPrice, setUpdatedPrice] = useState("");
  const [updatedPostalCode, setUpdatedPostalCode] = useState("");
  const [updatedMinimumOrder, setUpdatedMinimumOrder] = useState("");
  const [updatedIsFreeDelivery, setUpdatedIsFreeDelivery] = useState(false);
  const [newCity, setNewCity] = useState({
    postalCode: "",
    price: "",
    name: "",
    minimumOrder: "",
    isFreeDelivery: false,
  });

  useEffect(() => {
    async function fetchDeliveryPrices() {
      try {
        const response = await fetch("/api/delivery-prices");
        if (!response.ok)
          throw new Error("Fehler beim Abrufen der Lieferpreise");
        const data = await response.json();
        setDeliveryPrices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingPrices(false);
      }
    }

    fetchDeliveryPrices();
  }, []);

  async function handleSavePrice(id) {
    const savePromise = fetch("/api/delivery-prices", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
        price: Number(updatedPrice),
        postalCode: updatedPostalCode,
        minimumOrder: Number(updatedMinimumOrder),
        isFreeDelivery: updatedIsFreeDelivery,
      }),
    })
      .then(async (response) => {
        if (!response.ok)
          throw new Error("Fehler beim Aktualisieren der Lieferpreise");
        return response.json();
      })
      .then((updatedItem) => {
        setDeliveryPrices((prevPrices) =>
          prevPrices.map((item) => (item._id === id ? updatedItem : item))
        );
        setEditingPrice(null);
        setUpdatedPrice("");
        setUpdatedPostalCode("");
        setUpdatedMinimumOrder("");
        setUpdatedIsFreeDelivery(false);
      });

    toast.promise(savePromise, {
      loading: "Preis wird gespeichert...",
      success: "Preis erfolgreich aktualisiert!",
      error: "Fehler beim Aktualisieren des Preises.",
    });
  }

  async function toggleFreeDelivery(isFreeDelivery) {
    const togglePromise = fetch("/api/delivery-prices", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isFreeDelivery }),
    })
      .then((response) => {
        if (!response.ok)
          throw new Error("Fehler beim Umschalten der Lieferpreise");
        return response.json();
      })
      .then(() => {
        // Re-fetch delivery prices to ensure the state is up-to-date
        fetchDeliveryPrices();
      })
      .then(() => {
        window.location.reload();
      });

    toast.promise(togglePromise, {
      loading: isFreeDelivery
        ? "Alle auf kostenlose Lieferung setzen..."
        : "Preise werden zurückgesetzt...",
      success: isFreeDelivery
        ? "Alle Lieferungen sind jetzt kostenlos!"
        : "Preise wurden erfolgreich zurückgesetzt!",
      error: "Fehler beim Umschalten der Lieferpreise.",
    });
  }

  // Add fetchDeliveryPrices function to re-fetch data
  async function fetchDeliveryPrices() {
    try {
      const response = await fetch("/api/delivery-prices");
      if (!response.ok) throw new Error("Fehler beim Abrufen der Lieferpreise");
      const data = await response.json();
      setDeliveryPrices(data);
    } catch (error) {
      console.error(error);
    }
  }
  async function handleAddCity(e) {
    e.preventDefault();
    const { name, postalCode, price, minimumOrder, isFreeDelivery } = newCity;

    if (!name || !postalCode || !price || !minimumOrder) {
      toast.error("Alle Felder sind erforderlich.");
      return;
    }

    const addPromise = fetch("/api/delivery-prices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        postalCode,
        price: Number(price),
        minimumOrder: Number(minimumOrder),
        isFreeDelivery,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Fehler beim Hinzufügen der Stadt");
        return response.json();
      })
      .then((newPrice) => {
        setDeliveryPrices((prevPrices) => [...prevPrices, newPrice]);
        setNewCity({
          postalCode: "",
          price: "",
          name: "",
          minimumOrder: "",
          isFreeDelivery: false,
        });
        setShowForm(false);
      });

    toast.promise(addPromise, {
      loading: "Stadt wird hinzugefügt...",
      success: "Stadt erfolgreich hinzugefügt!",
      error: "Fehler beim Hinzufügen der Stadt.",
    });
  }

  async function handleDeleteCity(id) {
    const deletePromise = fetch(`/api/delivery-prices`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: id }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Fehler beim Löschen der Stadt");
        return response.json();
      })
      .then(() => {
        setDeliveryPrices((prevPrices) =>
          prevPrices.filter((price) => price._id !== id)
        );
      });

    toast.promise(deletePromise, {
      loading: "Stadt wird gelöscht...",
      success: "Stadt erfolgreich gelöscht!",
      error: "Fehler beim Löschen der Stadt.",
    });
  }

  if (loading || status === "loading" || loadingPrices) {
    return (
      <div className="w-full h-screen flex items-center justify-center overflow-hidden">
        <Spinner />
      </div>
    );
  }

  if (isAdmin === null) return null;

  return (
    <section className="mt-24 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold my-4 p-4">Lieferpreise</h1>
      <div className="flex gap-2 mb-4 p-4">
        <button
          onClick={() => toggleFreeDelivery(true)}
          className="button bg-[#009B77] !text-white"
        >
          Alle kostenlos machen
        </button>
        <button
          onClick={() => toggleFreeDelivery(false)}
          className="button bg-[#cf2a2a] !text-white"
        >
          Preise zurücksetzen
        </button>
      </div>
      <div className="mb-6 p-4 border rounded-md">
        <div
          className="flex justify-between cursor-pointer"
          onClick={() => setShowForm(!showForm)}
        >
          <h2 className="text-lg font-bold mb-2">Neue Stadt hinzufügen</h2>
          {showForm ? (
            <ChevronUp className="w-6 h-6" />
          ) : (
            <ChevronDown className="w-6 h-6" />
          )}
        </div>
        {showForm && (
          <form onSubmit={handleAddCity}>
            <input
              type="text"
              placeholder="Stadtname"
              value={newCity.name}
              onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
              className="input mb-2"
            />
            <input
              type="text"
              placeholder="Postleitzahl"
              value={newCity.postalCode}
              onChange={(e) =>
                setNewCity({ ...newCity, postalCode: e.target.value })
              }
              className="input mb-2"
            />
            <input
              type="number"
              placeholder="Lieferpreis (€)"
              value={newCity.price}
              onChange={(e) =>
                setNewCity({ ...newCity, price: e.target.value })
              }
              className="input mb-2"
            />
            <input
              type="number"
              placeholder="Mindestbestellung (€)"
              value={newCity.minimumOrder}
              onChange={(e) =>
                setNewCity({ ...newCity, minimumOrder: e.target.value })
              }
              className="input mb-2"
            />
            <div className="flex gap-1 mb-2">
              <label htmlFor="freeDelivery">Gratis Lieferung:</label>
              <input
                type="checkbox"
                placeholder="Gratis Lieferung"
                value={newCity.isFreeDelivery}
                checked={newCity.isFreeDelivery}
                onChange={(e) =>
                  setNewCity({ ...newCity, isFreeDelivery: e.target.checked })
                }
                className="input mb-2"
              />
            </div>

            <button type="submit" className="button bg-blue-500 text-white">
              Hinzufügen
            </button>
          </form>
        )}
      </div>

      <ul className="space-y-4 p-4">
        {deliveryPrices.map((price) => (
          <li
            key={price._id}
            className="p-4 border rounded-md shadow-md flex justify-between items-center"
          >
            {editingPrice === price._id ? (
              <div className="flex flex-col items-center mr-1">
                <div>
                  <label>Preis:</label>
                  <input
                    type="number"
                    value={updatedPrice}
                    onChange={(e) => setUpdatedPrice(e.target.value)}
                    className="input"
                  />
                  <label>Postleitzahl:</label>
                  <input
                    type="text"
                    value={updatedPostalCode}
                    onChange={(e) => setUpdatedPostalCode(e.target.value)}
                    className="input"
                    placeholder="Postleitzahl"
                  />
                  <label>Mindestbestellung:</label>
                  <input
                    type="number"
                    value={updatedMinimumOrder}
                    onChange={(e) => setUpdatedMinimumOrder(e.target.value)}
                    className="input"
                    placeholder="Mindestbestellung"
                  />
                  <div className="flex gap-1 items-center mb-2">
                    <label htmlFor="updatedIsFreeDelivery">
                      Gratis Lieferung:
                    </label>
                    <input
                      type="checkbox"
                      id="updatedIsFreeDelivery"
                      checked={updatedIsFreeDelivery}
                      onChange={(e) =>
                        setUpdatedIsFreeDelivery(e.target.checked)
                      }
                      className="ml-2"
                    />
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleSavePrice(price._id)}
                    className="button bg-green-500 ml-2"
                  >
                    Speichern
                  </button>
                  <button
                    onClick={() => setEditingPrice(null)}
                    className="button ml-2"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <h2 className="text-lg font-bold">{price.name}</h2>
                <p className="text-gray-800 font-semibold">
                  Preis: {price.price === 0 ? "Kostenlos" : price.price + "€"}
                </p>
                <p className="text-gray-800 font-semibold">
                  Postleitzahl: {price.postalCode}
                </p>
                <p className="text-gray-800 font-semibold">
                  Mindestbestellung: {price.minimumOrder}€
                </p>
                <p className="text-gray-800 font-semibold">
                  Gratis Lieferung: {price.isFreeDelivery ? "Ja" : "Nein"}
                </p>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => {
                  setEditingPrice(price._id);
                  setUpdatedPrice(price.price);
                  setUpdatedPostalCode(price.postalCode);
                  setUpdatedMinimumOrder(price.minimumOrder);
                  setUpdatedIsFreeDelivery(price.isFreeDelivery);
                }}
                className="button !w-auto"
              >
                Bearbeiten
              </button>
              <DeleteButton
                label="Löschen"
                onDelete={() => handleDeleteCity(price._id)}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default withAdminAuth(DeliveryPage);
