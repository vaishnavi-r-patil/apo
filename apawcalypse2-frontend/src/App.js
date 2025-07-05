
// import React, { useState } from "react";
// import CityInput from "./components/CityInput";
// import Result from "./components/Result";
// import DarkModeToggle from "./components/DarkModeToggle";
// import { LanguageProvider } from "./LanguageContext";
// import "./App.css"; // optional global styles

// export default function App() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   async function fetchData(cityName) {
//     setLoading(true);
//     try {
//       const res = await fetch(`http://localhost:5000/api/data`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ city: cityName }),
//       });
//       const json = await res.json();
//       setData(json);
//     } catch (e) {
//       alert("Failed to fetch data. Try again.");
//     }
//     setLoading(false);
//   }

//   return (
//     <LanguageProvider>
//       <div className="app-container">
//         <DarkModeToggle />
//         {!data ? (
//           <CityInput onSubmit={fetchData} loading={loading} />
//         ) : (
//           <Result data={data} onBack={() => setData(null)} />
//         )}
//       </div>
//     </LanguageProvider>
//   );
// }



// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CatScene from './components/CatScene';
import RipScene from './components/RipScene';
import HomePage from './components/HomePage';
import CityInput from './components/CityInput';

function App() {
  const [step, setStep] = useState(0);

  const handleCatSceneComplete = () => setStep(1);
  const handleRipSceneComplete = () => setStep(2);

  return (
    <Router>
      <Routes>
        {/* Start with CatScene */}
        {step === 0 && (
          <Route path="*" element={<CatScene onComplete={handleCatSceneComplete} />} />
        )}

        {/* Then go to RipScene */}
        {step === 1 && (
          <Route path="*" element={<RipScene onComplete={handleRipSceneComplete} />} />
        )}

        {/* Then go to HomePage, which leads to CityInput */}
        {step === 2 && (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/city" element={<CityInput />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
