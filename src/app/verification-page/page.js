"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import withAuthRedirect from "../_components/withAuthRedirect";
import toast from "react-hot-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../_components/ui/input-otp";

function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [code, setCode] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!email || !token) {
      // Redirect to login if email is missing
      router.replace("/login");
    }
    async function verifyToken() {
      try {
        const response = await fetch("/api/validate-token", {
          method: "POST",
          body: JSON.stringify({ email, token }),
          headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
      } catch (err) {
        toast.error("Unauthorized access. Redirecting...");
        router.replace("/login");
      }
    }

    verifyToken();
  }, [email, router, token]);

  useEffect(() => {
    if (code.length === 6) {
      handleVerification();
    }
  }, [code]);

  const handleOTPChange = (value) => setCode(value);

  async function handleVerification() {
    const loadingToastId = toast.loading("Überprüfung...");
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        body: JSON.stringify({ email, code }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast.success("Überprüfung erfolgreich!", { id: loadingToastId });
      router.push(`/login?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error(err.message, { id: loadingToastId });
    } finally {
      toast.dismiss(loadingToastId);
    }
  }

  async function resendVerificationCode() {
    setResending(true);
    try {
      const response = await fetch("/api/resend", {
        method: "POST",
        body: JSON.stringify({ email, resend: true }),
        headers: { "Content-Type": "application/json" },
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
  
      toast.success("Neuer Bestätigungscode an deine E-Mail gesendet!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setResending(false);
    }
  }
  

  return email ? (
    <form className="max-w-md mx-auto p-4 mt-24">
      <h1 className="text-2xl text-center font-bold mb-4">
        Bestätige Deine E-Mail-Adresse
      </h1>
      <p className="mb-4 text-center">
        Ein Bestätigungscode wurde an {email} gesendet. Bitte gib ihn unten ein.
      </p>
      <input type="hidden" value={email} />

      <div className="w-full flex justify-center">
        <InputOTP maxLength={6} value={code} onChange={handleOTPChange}>
          <InputOTPGroup className="w-full">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="w-[50px] h-[50px]"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <button
        type="button"
        onClick={handleVerification}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4"
        disabled={code.length !== 6}
      >
        Bestätigen
      </button>
      <button
        type="button"
        onClick={resendVerificationCode}
        disabled={resending}
        className="bg-gray-500 text-white px-4 py-2 rounded w-full mt-2"
      >
        {resending ? "Wird gesendet..." : "Keinen Code erhalten? Erneut senden"}
      </button>
    </form>
  ) : null;
}

export default withAuthRedirect(VerifyPage);
