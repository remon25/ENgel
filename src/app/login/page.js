"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import withAuthRedirect from "../_components/withAuthRedirect";
import Spinner from "../_components/layout/Spinner";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  useEffect(() => {
    const emailFromQuery = searchParams.get("email"); // Use get directly on searchParams
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [searchParams]); // Add searchParams as a dependency

  async function handleFormSubmit(e) {
    e.preventDefault();
    setLoggingIn(true);
    setError(""); // Clear previous errors

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevent automatic redirection
    });

    setLoggingIn(false);

    if (result.error) {
      // Check if error is related to unverified user
      if (result.error === "UNVERIFIED_USER") {
        // Redirect to verification page
        const response = await fetch("/api/resend", {
          method: "POST",
          body: JSON.stringify({ email, resend: true }),
          headers: { "Content-Type": "application/json" },
        });

        const { token } = await response.json(); // Extract the token from the response

        toast("Please verify your email before logging in.");

        window.location.href = `/verification-page?email=${encodeURIComponent(
          email
        )}&token=${encodeURIComponent(token)}`;
      } else {
        // Display other error messages
        setError("Invalid email or password. Please try again.");
        toast.error("Invalid email or password. Please try again.");
      }
    } else {
      // Redirect to the specified callback URL
      window.location.href = "/";
    }
  }

  async function handleGoogleLogin() {
    setLoggingIn(true);
    await signIn("google", { callbackUrl: "/" });
    setLoggingIn(false);
  }

  return (
    <section className="mt-16 p-4">
      {loggingIn && (
        <div className="fixed w-full h-full inset-0 flex justify-center items-center bg-white opacity-80">
          <Spinner />
        </div>
      )}
      <h1 className="text-center text-primary text-4xl font-bold mb-6">
        Anmelden
      </h1>
      <form className="block max-w-sm mx-auto" onSubmit={handleFormSubmit}>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <input
          name="email"
          type="email"
          placeholder="E-Mail"
          required
          value={email}
          disabled={loggingIn}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          name="password"
          type="password"
          placeholder="Passwort"
          required
          value={password}
          disabled={loggingIn}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loggingIn}
          className="bg-primary text-white px-6 py-2 rounded"
        >
          {loggingIn ? "Laden..." : "Anmelden"}
        </button>
        <div className="text-center my-4 text-gray-500">
          Oder mit Anbieter anmelden
        </div>
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loggingIn}
          className="mybutton mt-4 flex justify-center items-center gap-4"
        >
          {loggingIn ? (
            <span>Laden...</span>
          ) : (
            <>
              <Image
                src="/google-logo.png"
                alt="Mit Google anmelden"
                width={32}
                height={32}
              />
              Mit Google anmelden
            </>
          )}
        </button>
        <div className="text-center text-gray-700 my-4">
          Noch nicht registriert?{" "}
          <Link className="underline" href="/register">
            Registrieren
          </Link>
        </div>
      </form>
    </section>
  );
}

export default withAuthRedirect(LoginPage);
