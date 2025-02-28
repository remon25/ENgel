"use client";

import { useSession } from "next-auth/react";
import UserTabs from "../_components/layout/UserTabs";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import UserForm from "../_components/layout/UserForm";
import isAuth from "../_components/isAuth";
import Spinner from "../_components/layout/Spinner";

function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);

  const fetchProfile = useCallback(async () => {
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
  }, [status, router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  async function handleNameChange(e, data) {
    e.preventDefault();
    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/profile", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        resolve();
        await fetchProfile();
        window.location.reload();
      } else {
        reject();
      }
    });

    await toast.promise(savingPromise, {
      loading: "Speichern...",
      success: "Profil erfolgreich gespeichert",
      error: "Profil konnte nicht gespeichert werden",
    });
  }

  if (status === "loading" || !profileFetched) {
    return (
      <div className="w-full h-screen flex items-center justify-center overflow-hidden">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="mt-24 !overflow-hidden">
      <UserTabs />
      <UserForm user={user} onSave={handleNameChange} />
    </section>
  );
}

export default isAuth(ProfilePage);
