"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const router = useRouter();

  // Regular expression to validate German mobile numbers
  const validatePhoneNumber = (phone) => {
    const regex = /^(?:\+49|0)[1-9][0-9]{9,10}$/;
    return regex.test(phone);
  };

  async function handleFormSubmit(e) {
    e.preventDefault();

    // Basic validations
    if (name.trim().length === 0) {
      toast.error("Bitte gib deinen Namen ein.");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }

    if (password.length < 8) {
      toast.error("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }

    if (!validatePhoneNumber(phone)) {
      toast.error("Bitte gib eine gültige deutsche Handynummer ein.");
      return;
    }

    setCreatingUser(true);

    const loadingToastId = toast.loading("Benutzer wird erstellt...");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          streetAddress,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registrierung fehlgeschlagen.");
      }

      const { token } = await response.json(); // Extract the token from the response

      toast.success(
        "Benutzer erstellt! Bitte überprüfe deine E-Mail für den Verifizierungscode.",
        { id: loadingToastId }
      );
      router.push(
        `/verification-page?email=${encodeURIComponent(
          email
        )}&token=${encodeURIComponent(token)}`
      );
    } catch (err) {
      toast.error(err.message, { id: loadingToastId });
    } finally {
      setCreatingUser(false);
      toast.dismiss(loadingToastId);
    }
  }

  return (
    <form className="block max-w-sm mx-auto mt-24" onSubmit={handleFormSubmit}>
      <input
        name="name"
        type="text"
        placeholder="Name"
        value={name}
        required
        disabled={creatingUser}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        name="email"
        type="email"
        placeholder="E-Mail"
        value={email}
        required
        disabled={creatingUser}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        name="phone"
        type="tel"
        placeholder="Handynummer"
        value={phone}
        required
        disabled={creatingUser}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        name="streetAddress"
        type="text"
        placeholder="Straßenadresse"
        value={streetAddress}
        required
        disabled={creatingUser}
        onChange={(e) => setStreetAddress(e.target.value)}
      />
      <input
        name="password"
        type="password"
        placeholder="Passwort"
        value={password}
        required
        disabled={creatingUser}
        minLength={8}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        disabled={creatingUser}
        className={`bg-primary text-white px-6 py-2 rounded-[8px] ${
          creatingUser ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {creatingUser ? "Registrieren..." : "Registrieren"}
      </button>
      <div className="text-center my-4 text-gray-500">
        Oder melde dich mit einem Anbieter an
      </div>
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="mybutton mt-4 flex justify-center items-center gap-4"
        disabled={creatingUser}
      >
        <Image
          src="/google-logo.png"
          alt="Mit Google anmelden"
          width={32}
          height={32}
        />
        Mit Google anmelden
      </button>
      <div className="text-center text-gray-700 my-4">
        Hast du bereits ein Konto?{" "}
        <Link className="underline" href="/login">
          Einloggen
        </Link>
      </div>
    </form>
  );
}
