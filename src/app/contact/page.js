"use client";
import { useState } from "react";
import toast from "react-hot-toast"; // Import React Hot Toast

export default function Page() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Use toast.promise to show loading and handle success/error
    const promise = fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    toast.promise(promise, {
      loading: "Sending message...",
      success: (response) => {
        return response.json().then((result) => {
          setFormData({ name: "", email: "", message: "" });
          setIsLoading(false);
          return result.message;
        });
      },
      error: (error) => {
        setIsLoading(false);
        return error.message || "Something went wrong. Please try again.";
      },
    });
  };

  return (
    <div>
      <div className="bg-gray-50 dark:bg-gray-900 px-3" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 text-center">
          <h2 className="text-4xl font-bold dark:text-gray-100">Kontakt</h2>
          <p className="pt-6 pb-6 text-base max-w-2xl text-center m-auto dark:text-gray-400">
            Möchten Sie uns kontaktieren? Wählen Sie eine Option unten aus, und
            wir zeigen Ihnen gerne, wie wir die Web-Erfahrung Ihres Unternehmens
            transformieren können.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 grid md:grid-cols-2 lg:grid-cols-2 gap-y-8 md:gap-x-8 md:gap-y-8 lg:gap-x-8 lg:gap-y-16">
          <div>
            <h2 className="text-lg font-bold dark:text-gray-100">
              Kontaktieren Sie
            </h2>
            <p className="max-w-sm mt-4 mb-4 dark:text-gray-400">
              Möchten Sie etwas mitteilen? Wir sind hier, um Ihnen zu helfen.
              Füllen Sie das Formular aus, senden Sie eine E-Mail oder rufen Sie
              uns an.
            </p>

            <div className="flex items-center mt-8 space-x-2 text-dark-600 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                ></path>
              </svg>
              <span>Krummholzberg 3 21073 Hamburg</span>
            </div>
            <div className="flex items-center mt-2 space-x-2 text-dark-600 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                ></path>
              </svg>
              <a href="mailto:angelwardparfumier@gmail.com">
                angelwardparfumier@gmail.com
              </a>
            </div>
            <div className="flex items-center mt-2 space-x-2 text-dark-600 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                ></path>
              </svg>
              <a href="tel:15216722182">15216722182</a>
            </div>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <input
                  disabled={isLoading}
                  type="text"
                  name="name"
                  placeholder="Vollständiger Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 rounded-md"
                />
              </div>
              <div className="mb-5">
                <input
                  disabled={isLoading}
                  type="email"
                  name="email"
                  placeholder="E-Mail-Adresse"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 rounded-md"
                />
              </div>
              <div className="mb-5">
                <textarea
                  disabled={isLoading}
                  name="message"
                  placeholder="Ihre Nachricht"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 rounded-md"
                />
              </div>
              <button
                disabled={isLoading}
                type="submit"
                className="w-full py-4 font-semibold text-white bg-gray-900 rounded-md"
              >
                Nachricht senden
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
