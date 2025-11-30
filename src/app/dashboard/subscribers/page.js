"use client";
import toast from "react-hot-toast";
import { useProfile } from "@/app/_components/useProfile";
import { useEffect, useState } from "react";
import withAdminAuth from "@/app/_components/withAdminAuth";
import Spinner from "@/app/_components/layout/Spinner";

function SubscribersPage() {
  const { isAdmin, loading, status } = useProfile();
  const [subscribers, setSubscribers] = useState([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  function fetchSubscribers() {
    setLoadingSubscribers(true);
    fetch("/api/subscribers")
      .then((response) => response.json())
      .then((data) => {
        setSubscribers(data.subscribers || []);
        setLoadingSubscribers(false);
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen der Abonnenten:", error);
        setLoadingSubscribers(false);
      });
  }

  async function handleSubscriberDelete(_id) {
    try {
      await toast.promise(
        fetch("/api/subscribers/?_id=" + _id, {
          method: "DELETE",
        }),
        {
          loading: "Abonnent wird gelöscht...",
          success: "Abonnent erfolgreich gelöscht!",
          error: "Fehler beim Löschen des Abonnenten!",
        }
      );
    } catch (error) {
      console.error("Fehler beim Löschen des Abonnenten:", error);
    }
    fetchSubscribers();
  }

  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || status === "loading") {
    return (
      <div className="w-full h-screen flex items-center justify-center overflow-hidden">
        <Spinner />
      </div>
    );
  }

  if (isAdmin === null) return null;

  return (
    <section className="mt-24 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Newsletter-Abonnenten</h1>
        <p className="text-gray-600">
          Gesamt: <span className="font-semibold text-lg">{subscribers.length}</span> Abonnenten
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Nach E-Mail suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Subscribers List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loadingSubscribers ? (
          <div className="flex items-center justify-center p-8">
            <Spinner />
          </div>
        ) : filteredSubscribers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    E-Mail
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Abonniert am
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Aktion
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.map((subscriber) => (
                  <tr
                    key={subscriber._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(subscriber.subscribedAt).toLocaleDateString("de-DE", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          subscriber.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {subscriber.isActive ? "Aktiv" : "Inaktiv"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleSubscriberDelete(subscriber._id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                      >
                        Löschen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>Keine Abonnenten gefunden</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default withAdminAuth(SubscribersPage);