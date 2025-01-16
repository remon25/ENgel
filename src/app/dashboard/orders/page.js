"use client";
import { useEffect, useState } from "react";
import { useProfile } from "@/app/_components/useProfile";
import Link from "next/link";
import { dbTimeForHuman } from "@/app/libs/datetime";
import isAuth from "@/app/_components/isAuth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Spinner from "@/app/_components/layout/Spinner";
import Image from "next/image";

function OrdersPage() {
  const { data: session, status } = useSession();
  const { loading, data: profile } = useProfile();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [profileFetched, setProfileFetched] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (status === "authenticated") {
        try {
          const res = await fetch("/api/profile");
          const data = await res.json();
          setUser(data);
          setAdmin(data?.admin); // Update admin state here
          setProfileFetched(true);
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          // Optionally redirect or show an error
        }
      } else if (status === "unauthenticated") {
        router.push("/login");
      }
    };

    fetchProfile();
  }, [status, router]);

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    setLoadingOrders(true);
    fetch("/api/orders").then((res) => {
      res.json().then((orders) => {
        setOrders(orders.reverse());
        setLoadingOrders(false);
      });
    });
  }

  return (
    <section className="mt-8 max-w-3xl mx-auto p-4">
      {loadingOrders ? (
        <div className="w-full h-screen flex items-center justify-center overflow-hidden">
          <Spinner />
        </div>
      ) : orders.length > 0 ? (
        <div className="mt-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-100 mb-2 p-4 rounded-lg flex flex-col md:flex-row items-center gap-6"
            >
              <div className="grow flex flex-col md:flex-row items-center gap-6">
                <div>
                  <div
                    className={`${
                      order.paid
                        ? "bg-green-500"
                        : order.payOnDelivery
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    } p-2 rounded-md text-white w-24 text-center`}
                  >
                    {order.paid ? "Bezahlt" : "Nicht bezahlt"}
                    {order.payOnDelivery && (
                      <div className="text-xs font-bold text-gray-700">
                        Barzahlung
                      </div>
                    )}
                  </div>
                </div>
                <div className="grow">
                  <div className="flex flex-col gap-2 items-center mb-1">
                    <div className="grow">{order.email}</div>
                    <div className="text-gray-500 text-sm">
                      {dbTimeForHuman(order.createdAt)}
                    </div>
                  </div>
                  <div className="text-gray-500 text-center text-xs">
                    {order.cartProducts.map((p) => p.name).join(", ")}
                  </div>
                </div>
              </div>
              <div className="justify-end flex gap-2 items-center whitespace-nowrap">
                <Link href={"/dashboard/orders/" + order._id} className="button">
                  Anzeigen
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center overflow-hidden">
          <Link href="/" className="my-6">
            <Image src="/no-order.png" alt="empty" width={250} height={250} />
          </Link>
          <h1 className="text-[20px] text-center font-semibold">
            Sie haben noch keine Produkte! <br />
            Fügen Sie einige Produkte hinzu, um zu beginnen.
          </h1>
        </div>
      )}
    </section>
  );
}

export default isAuth(OrdersPage);
