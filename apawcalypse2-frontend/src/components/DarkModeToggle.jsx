// DarkModeToggle.jsx
import React, { useEffect, useState } from "react";
import './DarkModeToggle.css';
import sunIcon from '../assets/sun.png';
import moonIcon from '../assets/moon.png';

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored === null ? true : stored === "true";
  });

  useEffect(() => {
    document.body.classList.remove("dark", "light");
    document.body.classList.add(darkMode ? "dark" : "light");
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
      <img
        src={darkMode ? sunIcon : moonIcon}
        alt={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        className="toggle-icon"
      />
    </button>
  );
}
