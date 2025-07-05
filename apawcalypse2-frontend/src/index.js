// ⚠️ Must be at the top BEFORE imports to avoid ESLint 'import/first' error
const isDark = localStorage.getItem("darkMode") === "true";
document.body.classList.add(isDark ? "dark" : "light");

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './App.css';
import { LanguageProvider } from './LanguageContext'; // ✅ Import context

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
);
