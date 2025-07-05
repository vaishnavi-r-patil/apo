// CityInput.jsx
import React, { useState } from "react";
import DarkModeToggle from "./DarkModeToggle";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
import "./CityInput.css";
import loadingImg from "../assets/earth2.png"; // <-- Make sure this path is correct

export default function CityInput({ onSubmit }) {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  function t(text) {
    return translations[text]?.[language] || text;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });
      const data = await res.json();
      onSubmit(data);
    } catch (err) {
      alert("Error fetching data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="city-input-container">
      <div className="top-controls">
        <LanguageSelector />
        <DarkModeToggle />
      </div>

      <h1 className="title">Apawcalypse</h1>

      <form onSubmit={handleSubmit} className="city-input-form">
        <h2>{t("Enter a City Name")}</h2>
        <input
          type="text"
          placeholder={t("e.g. Mumbai")}
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">{t("Analyse")}</button>
      </form>

      {loading && (
        <div className="loading-image-container">
          <img src={loadingImg} alt="Loading..." className="loading-image" />
        </div>
      )}
    </div>
  );
}
