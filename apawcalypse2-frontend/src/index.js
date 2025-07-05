import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './App.css';
import { LanguageProvider } from './LanguageContext';

// Dark mode setup - runs after imports
const isDark = localStorage.getItem("darkMode") === "true";
document.body.classList.add(isDark ? "dark" : "light");

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
