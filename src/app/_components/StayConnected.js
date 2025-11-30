"use client";

import React, { useState } from "react";

export default function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Vielen Dank! Sie wurden erfolgreich abonniert.");
        setEmail("");
      } else {
        setError(data.error || "Subscription failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 mt-12 sm:mt-16 lg:mt-20 mb-6 sm:mb-8 lg:mb-10">
      <div className="relative w-full max-w-6xl">
        {/* Decorative dashed border */}
        <div className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-2xl sm:rounded-3xl"></div>

        {/* Main content card */}
        <div className="relative m-3 sm:m-4 bg-[#fdf6ed] backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-lg">
          <div className="text-center space-y-4 sm:space-y-6">
            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 leading-tight px-2 sm:px-0">
              Bleiben Sie verbunden mit{" "}
              <span className="text-[#fab572]">ENGEL PARFUMS</span>
            </h2>

            {/* Subheading */}
            <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed px-4 sm:px-0">
              Erhalten Sie exklusive Angebote, erste Einblicke in neue Düfte
              und Einladungen zu besonderen Events.
            </p>

            {/* Status messages */}
            {message && (
              <p className="text-green-600 text-sm font-medium px-4">{message}</p>
            )}
            {error && (
              <p className="text-red-600 text-sm font-medium px-4">{error}</p>
            )}

            {/* Subscription section */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:grid sm:grid-cols-[2fr_1fr] items-stretch sm:items-center justify-center gap-3 mt-6 sm:mt-8 max-w-2xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Geben Sie Ihre E-Mail ein"
                className="w-full px-6 py-3.5 rounded-full bg-white text-gray-700 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm text-sm"
                required
                disabled={loading}
                style={{
                  borderRadius: "10px 42px 9px 10px",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-2.5 bg-gradient-to-r from-[#e7be4a] to-[#e7be4a] hover:from-[#d4ab3a] hover:to-[#d4ab3a] text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-sm whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  borderRadius: "9px 10px 10px 42px",
                }}
              >
                {loading ? "Wird abonniert..." : "Jetzt abonnieren"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}