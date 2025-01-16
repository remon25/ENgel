"use client";
import { useState, useEffect, useRef } from "react";
import { getAddressAutocomplete } from "../_utilis/openCage";

export default function Address({ setAddressProp }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(true);
  const debounceTimer = useRef(null); // Ref to store debounce timer

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setAddressProp("streetAdress", value);

    if (value.length < 3) {
      setSuggestions([]);
      return; // Avoid searching for very short input
    }

    // Clear the previous timer to avoid calling the API too often
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set a new timer to call the API after a delay (500ms in this case)
    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);

      const results = await getAddressAutocomplete(value);
      if (results && results.length > 0) {
        setSuggestions(results);
        setIsValidAddress(true);
      } else {
        setSuggestions([]);
        setIsValidAddress(false);
      }

      setIsLoading(false);
    }, 500); // Delay in milliseconds (500ms)
  };

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion);
    setAddressProp("streetAdress", suggestion);
    setSuggestions([]); // Clear suggestions after selection

    // Validate the selected suggestion
    setIsValidAddress(true);
  };

  useEffect(() => {
    // Cleanup the timer if the component unmounts
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <label htmlFor="address">Adresse</label>
      <input
        id="address"
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Adresse"
        className="input-address"
      />
      {isLoading && <p>Loading...</p>}
      {!isValidAddress && (
        <p style={{ color: "red" }}>
          Please select a valid address from the suggestions.
        </p>
      )}
      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
            margin: "0",
            padding: "0 0.5rem",
            backgroundColor: "white",
            border: "1px solid #ccc",
            listStyleType: "none",
            zIndex: "1000",
          }}
          className="border-t-[none] rounded-[5px]"
        >
          {suggestions.map((suggestion, index) => (
            <li
              className="my-2 hover:text-gray-900 cursor-pointer"
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
